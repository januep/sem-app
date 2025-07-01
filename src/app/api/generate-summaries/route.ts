// src/app/api/generate-summaries/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { OpenAI } from 'openai'

// Inicjalizacja klienta OpenAI z kluczem API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    // Pobranie ID dokumentu PDF z żądania
    const { pdfId } = await req.json()

    // 1. Pobranie wszystkich stron bez wygenerowanego podsumowania
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('id, text')
      .eq('pdf_id', pdfId)
      .is('summary', null)
    
    if (pagesErr) throw pagesErr

    // 2. Filtrowanie stron które mają więcej niż 500 znaków (warte podsumowania)
    const toSummarize = pages?.filter(p => p.text.length > 500) || []

    // 3. Generowanie podsumowań dla każdej strony przy użyciu OpenAI
    for (const page of toSummarize) {
      // Wywołanie OpenAI API do wygenerowania podsumowania
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', 
            content: `Summarize the below text in 2-3 sentences, in the same language as provided:\n\n${page.text}` }
        ]
      })
      
      // Bezpieczne wyodrębnienie podsumowania z odpowiedzi OpenAI
      const summary = resp.choices?.[0]?.message?.content?.trim() || ''

      // Zapisanie wygenerowanego podsumowania do bazy danych
      await supabaseAdmin
        .from('pdf_pages')
        .update({ summary })
        .eq('id', page.id)
    }

    // 4. Oznaczenie dokumentu jako posiadającego wygenerowane podsumowania
    await supabaseAdmin
      .from('pdf_documents')
      .update({ generated_summaries: true })
      .eq('id', pdfId)

    // Zwrócenie informacji o pomyślnym zakończeniu procesu
    return NextResponse.json({ success: true })
    
  } catch (err: unknown) {
    // Obsługa nieoczekiwanych błędów
    console.error('Błąd podczas generowania podsumowań:', err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 })
  }
}