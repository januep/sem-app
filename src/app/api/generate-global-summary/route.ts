// src/app/api/generate-global-summary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { OpenAI } from 'openai'

// Inicjalizacja klienta OpenAI z kluczem API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    // Pobranie ID dokumentu PDF z żądania
    const { pdfId } = await req.json()

    // 1. Pobranie wszystkich stron: preferuj summary jeśli istnieje, inaczej użyj text
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('text, summary')
      .eq('pdf_id', pdfId)
    
    if (pagesErr) throw pagesErr

    // Przygotowanie zawartości do podsumowania - priorytet dla summary nad text
    const contents = (pages || []).map(p =>
      (p.summary && p.summary.trim().length > 0)
        ? p.summary.trim()
        : p.text.trim()
    ).filter(c => c.length > 0)

    // Sprawdzenie czy mamy jakąkolwiek zawartość do podsumowania
    if (contents.length === 0) {
      throw new Error('No page content to summarize')
    }

    // 2. Połączenie wszystkich fragmentów w jeden spójny tekst
    const combined = contents.join('\n\n')

    // 3. Wywołanie OpenAI w celu wygenerowania globalnego podsumowania dokumentu
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `Please write a concise, 3-sentence summary of the overall document (in the same language as the content), based on the following content:\n\n${combined}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
    
    // Bezpieczne wyodrębnienie podsumowania z odpowiedzi OpenAI
    const summary = resp.choices?.[0]?.message?.content?.trim()
    if (!summary) throw new Error('Empty summary from OpenAI')

    // 4. Zapisanie globalnego podsumowania w tabeli pdf_documents
    const { error: updateErr } = await supabaseAdmin
      .from('pdf_documents')
      .update({ summary })
      .eq('id', pdfId)
    
    if (updateErr) throw updateErr

    // Zwrócenie informacji o pomyślnym wygenerowaniu podsumowania
    return NextResponse.json({ success: true, summary })
    
  } catch (err: unknown) {
    // Obsługa nieoczekiwanych błędów
    console.error('Błąd podczas generowania globalnego podsumowania:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}