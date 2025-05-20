// app/api/generate-course/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const MODEL = 'gpt-4-1106-preview'

export async function POST(req: NextRequest) {
  const { document_id, topics } = await req.json() as {
    document_id: string
    topics: string[]
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

  // 1) fetch all chunks
  const { data: chunks, error: chunksErr } = await supabase
    .from('pdf_chunks')
    .select('chunk_index, text')
    .eq('document_id', document_id)
    .order('chunk_index', { ascending: true })

  if (chunksErr || !chunks) {
    return NextResponse.json({ error: chunksErr?.message }, { status: 500 })
  }

  // 2) build prompt to generate a Markdown course
  const prompt = `
Generate a Markdown course based on these selected topics:
${JSON.stringify(topics, null, 2)}

Use the text below as your source material—organize one section per topic,
include headings, long explanations, all in Markdown using all of Markdown goodies.

try to use the single hash # only once.

Source text:
${chunks.map(c => c.text).join('\n\n').slice(0, 20000)}
`

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt.trim() }],
  })

  const markdown = completion.choices[0].message?.content?.trim() || ''

  // 3) insert into courses
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .insert({
      pdf_document_id: document_id,
      title: `Course for ${topics.join(', ')}`,
      markdown
    })
    .select('id')
    .single()

  if (courseErr || !course) {
    return NextResponse.json({ error: courseErr?.message }, { status: 500 })
  }

  // 4) insert course_topics
  const topicRows = topics.map(topic => ({
    course_id: course.id,
    topic,
  }))
  await supabase.from('course_topics').insert(topicRows)

  return NextResponse.json({ course_id: course.id, markdown })
}
