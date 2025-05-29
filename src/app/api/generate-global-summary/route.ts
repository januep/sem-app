// src/app/api/generate-global-summary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { pdfId } = await req.json()

    // 1. Pobierz wszystkie strony: jeśli jest summary → użyj, inaczej text
    const { data: pages, error: pagesErr } = await supabaseAdmin
      .from('pdf_pages')
      .select('text, summary')
      .eq('pdf_id', pdfId)
    if (pagesErr) throw pagesErr

    const contents = pages.map(p =>
      (p.summary && p.summary.trim().length > 0)
        ? p.summary.trim()
        : p.text.trim()
    ).filter(c => c.length > 0)

    if (contents.length === 0) {
      throw new Error('No page content to summarize')
    }

    // 2. Połącz wszystkie fragmenty w jeden string
    const combined = contents.join('\n\n')

    // 3. Wywołaj OpenAI, żeby wygenerować ~3-zdaniowe podsumowanie
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
    const summary = resp.choices?.[0]?.message?.content.trim()
    if (!summary) throw new Error('Empty summary from OpenAI')

    // 4. Zapisz podsumowanie w pdf_documents.summary
    const { error: updateErr } = await supabaseAdmin
      .from('pdf_documents')
      .update({ summary })
      .eq('id', pdfId)
    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, summary })
  } catch (err: any) {
    console.error('generate-global-summary error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
