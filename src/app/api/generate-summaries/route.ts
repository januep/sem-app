// src/app/api/generate-summaries/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { pdfId } = await req.json()

    // 1. Pobierz wszystkie strony bez podsumowania
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('id, text')
      .eq('pdf_id', pdfId)
      .is('summary', null)
    if (pagesErr) throw pagesErr

    // 2. Filtruj te, które mają > 500 znaków
    const toSummarize = pages.filter(p => p.text.length > 500)

    // 3. Dla każdej strony wywołaj OpenAI i zapisz summary
    for (const page of toSummarize) {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym asystentem.' },
          { role: 'user',
            content: `Podsumuj poniższy tekst w 2–3 zdaniach:\n\n${page.text}` }
        ]
      })
      const summary = resp.choices?.[0]?.message?.content.trim() || ''

      await supabaseAdmin
        .from('pdf_pages')
        .update({ summary })
        .eq('id', page.id)
    }

    // 4. Oznacz dokument jako wygenerowany
    await supabaseAdmin
      .from('pdf_documents')
      .update({ generated_summaries: true })
      .eq('id', pdfId)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('generate-summaries error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
