// src/app/api/generate-chunks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

const MAX_TOKENS = 700
const OVERLAP_SENTENCES = 1

// 1 token ≈ 4 znaki
function countTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Proste dzielenie na zdania
function splitIntoSentences(text: string): string[] {
  const regex = /[^\.!\?]+[\.!\?]+/g
  const matches = text.match(regex) || []
  const leftover = text.replace(regex, '').trim()
  if (leftover) matches.push(leftover)
  return matches.map(s => s.trim())
}

export async function POST(req: NextRequest) {
  try {
    const { pdfId } = await req.json()

    // 1) Wyczyść stare chunki
    await supabaseAdmin.from('chunks').delete().eq('pdf_id', pdfId)

    // 2) Pobierz wszystkie strony
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('page_number, text')
      .eq('pdf_id', pdfId)
      .order('page_number', { ascending: true })
    if (pagesErr) throw pagesErr
    if (!pages) throw new Error('No pages found')

    interface Page { page_number: number; text: string }
    const allPages = pages as Page[]

    // 3) Chunkowanie
    type Sent = { page: number; sentence: string }
    let current: Sent[] = []
    let currentTokens = 0
    let order = 1
    const toInsert: Array<{
      pdf_id: string
      start_page: number
      end_page: number
      text: string
      token_count: number
      order: number
    }> = []

    for (const { page_number, text } of allPages) {
      const tokensOnPage = countTokens(text)

      // a) Jeśli cała strona jest za długa, rozbij na zdania i grupuj same zdania
      if (tokensOnPage > MAX_TOKENS) {
        const sentences = splitIntoSentences(text)
        let bucket: string[] = []
        let bucketTokens = 0
        for (const s of sentences) {
          const t = countTokens(s)
          if (bucketTokens + t > MAX_TOKENS && bucket.length) {
            toInsert.push({
              pdf_id:      pdfId,
              start_page:  page_number,
              end_page:    page_number,
              text:        bucket.join(' '),
              token_count: bucketTokens,
              order:       order++,
            })
            // overlap
            bucket = bucket.slice(-OVERLAP_SENTENCES)
            bucketTokens = bucket.reduce((sum, ss) => sum + countTokens(ss), 0)
          }
          bucket.push(s)
          bucketTokens += t
        }
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

      // b) Jeśli dodanie całej strony do current przekroczy limit → flush
      if (currentTokens + tokensOnPage > MAX_TOKENS && current.length) {
        toInsert.push({
          pdf_id:      pdfId,
          start_page:  current[0].page,
          end_page:    current[current.length - 1].page,
          text:        current.map(x => x.sentence).join(' '),
          token_count: currentTokens,
          order:       order++,
        })
        // overlap ostatnie zdanie
        current = current.slice(-OVERLAP_SENTENCES)
        currentTokens = current.reduce((sum, x) => sum + countTokens(x.sentence), 0)
      }

      // c) Normalnie: dodajemy całe tekst strony jako jeden „sentence”
      current.push({ page: page_number, sentence: text })
      currentTokens += tokensOnPage
    }

    // 4) Flush finalnego chunka
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

    // 5) Wstaw do bazy
    for (const c of toInsert) {
      const { error } = await supabaseAdmin.from('chunks').insert([c])
      if (error) console.error('Chunk insert error:', error)
    }

    return NextResponse.json({ success: true, count: toInsert.length })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
