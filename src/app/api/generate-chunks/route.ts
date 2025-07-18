// src/app/api/generate-chunks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

// Maksymalna liczba tokenów na chunk
const MAX_TOKENS = 700
// Liczba zdań do zachowania jako overlap między chunkami
const OVERLAP_SENTENCES = 1

// Przybliżone obliczenie liczby tokenów (1 token ≈ 4 znaki)
function countTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Funkcja do dzielenia tekstu na zdania
function splitIntoSentences(text: string): string[] {
  const regex = /[^\.!\?]+[\.!\?]+/g
  const matches = text.match(regex)
  const sentences: string[] = matches ? [...matches] : []
  
  // Dodanie pozostałego tekstu (bez zakończenia zdania)
  const leftover = text.replace(regex, '').trim()
  if (leftover) {
    sentences.push(leftover)
  }
  
  return sentences.map(s => s.trim())
}

export async function POST(req: NextRequest) {
  try {
    // Pobranie ID dokumentu PDF z żądania
    const { pdfId } = await req.json()

    // 1) Wyczyszczenie starych chunków dla tego PDF
    await supabaseAdmin.from('chunks').delete().eq('pdf_id', pdfId)

    // 2) Pobranie wszystkich stron dokumentu PDF w kolejności
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('page_number, text')
      .eq('pdf_id', pdfId)
      .order('page_number', { ascending: true })
    
    if (pagesErr) throw pagesErr
    if (!pages) throw new Error('No pages found')

    // Definicja typów dla lepszej czytelności kodu
    interface Page { page_number: number; text: string }
    const allPages = pages as Page[]

    // 3) Proces chunkowania - dzielenie tekstu na mniejsze fragmenty
    type Sent = { page: number; sentence: string }
    let current: Sent[] = [] // Aktualnie budowany chunk
    let currentTokens = 0    // Liczba tokenów w aktualnym chunku
    let order = 1           // Numer porządkowy chunka
    
    // Tablica chunków do wstawienia do bazy danych
    const toInsert: Array<{
      pdf_id: string
      start_page: number
      end_page: number
      text: string
      token_count: number
      order: number
    }> = []

    // Przetwarzanie każdej strony dokumentu
    for (const { page_number, text } of allPages) {
      const tokensOnPage = countTokens(text)

      // a) Jeśli cała strona przekracza limit tokenów - dziel na zdania
      if (tokensOnPage > MAX_TOKENS) {
        const sentences = splitIntoSentences(text)
        let bucket: string[] = []
        let bucketTokens = 0
        
        // Grupowanie zdań w chunki o odpowiednim rozmiarze
        for (const s of sentences) {
          const t = countTokens(s)
          
          // Jeśli dodanie zdania przekroczy limit - zapisz aktualny bucket
          if (bucketTokens + t > MAX_TOKENS && bucket.length) {
            toInsert.push({
              pdf_id:      pdfId,
              start_page:  page_number,
              end_page:    page_number,
              text:        bucket.join(' '),
              token_count: bucketTokens,
              order:       order++,
            })
            
            // Zachowanie overlap - ostatnie zdania jako początek nowego chunka
            bucket = bucket.slice(-OVERLAP_SENTENCES)
            bucketTokens = bucket.reduce((sum, ss) => sum + countTokens(ss), 0)
          }
          
          bucket.push(s)
          bucketTokens += t
        }
        
        // Zapisanie ostatniego bucket'a jeśli zawiera zdania
        if (bucket.length) {
          toInsert.push({
            pdf_id:      pdfId,
            start_page:  page_number,
            end_page:    page_number,
            text:        bucket.join(' '),
            token_count: bucketTokens,
            order:       order++,
          })
        }
        continue
      }

      // b) Jeśli dodanie całej strony przekroczy limit tokenów - zapisz aktualny chunk
      if (currentTokens + tokensOnPage > MAX_TOKENS && current.length) {
        toInsert.push({
          pdf_id:      pdfId,
          start_page:  current[0].page,
          end_page:    current[current.length - 1].page,
          text:        current.map(x => x.sentence).join(' '),
          token_count: currentTokens,
          order:       order++,
        })
        
        // Zachowanie overlap - ostatnie zdania jako początek nowego chunka
        current = current.slice(-OVERLAP_SENTENCES)
        currentTokens = current.reduce((sum, x) => sum + countTokens(x.sentence), 0)
      }

      // c) Dodanie całej strony jako jednego "zdania" do aktualnego chunka
      current.push({ page: page_number, sentence: text })
      currentTokens += tokensOnPage
    }

    // 4) Zapisanie ostatniego chunka jeśli zawiera dane
    if (current.length) {
      toInsert.push({
        pdf_id:      pdfId,
        start_page:  current[0].page,
        end_page:    current[current.length - 1].page,
        text:        current.map(x => x.sentence).join(' '),
        token_count: currentTokens,
        order:       order++,
      })
    }

    // 5) Wstawienie wszystkich chunków do bazy danych
    for (const c of toInsert) {
      const { error } = await supabaseAdmin.from('chunks').insert([c])
      if (error) console.error('Błąd podczas wstawiania chunka:', error)
    }

    // Zwrócenie informacji o pomyślnym zakończeniu procesu
    return NextResponse.json({ success: true, count: toInsert.length })
    
  } catch (e: unknown) {
    // Obsługa nieoczekiwanych błędów
    console.error('Błąd podczas generowania chunków:', e)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}