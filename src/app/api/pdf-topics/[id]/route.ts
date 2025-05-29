//api/pdf-topics/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Handle GET requests with ID parameter in the URL
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const document_id = params.id;
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // 1) fetch all chunks text
  const { data: chunks, error } = await supabase
    .from('pdf_chunks')
    .select('text')
    .eq('document_id', document_id)
    .order('chunk_index', { ascending: true });
  if (error || !chunks) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  // 2) combine into one prompt (or sample)
  const combined = chunks.map(c => c.text).join('\n\n');
  const prompt = `
Extract the main topics covered in this text. 
List them as short labels (max 8), e.g.: ["Topic A", "Topic B", ...].
Write topics in the same language as content
Text:
${combined.slice(0, 20000)}  // trim if too long
`;

  // 3) call OpenAI
  const resp = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });
  const content = resp.choices[0].message?.content || '[]';
  let topics: string[] = [];
  try {
    topics = JSON.parse(content);
  } catch {
    // fallback: split by lines
    topics = content.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return NextResponse.json({ topics });
}

// Keep the existing POST method for backward compatibility
export async function POST(request: NextRequest) {
  const { document_id } = await request.json();
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // 1) fetch all chunks text
  const { data: chunks, error } = await supabase
    .from('pdf_chunks')
    .select('text')
    .eq('document_id', document_id)
    .order('chunk_index', { ascending: true });
  if (error || !chunks) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  // 2) combine into one prompt (or sample)
  const combined = chunks.map(c => c.text).join('\n\n');
  const prompt = `
Extract the main topics covered in this text. 
List them as short labels (max 8), e.g.: ["Topic A", "Topic B", ...].

Text:
${combined.slice(0, 20000)}  // trim if too long
`;

  // 3) call OpenAI
  const resp = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });
  const content = resp.choices[0].message?.content || '[]';
  let topics: string[] = [];
  try {
    topics = JSON.parse(content);
  } catch {
    // fallback: split by lines
    topics = content.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return NextResponse.json({ topics });
}

//Idea for the future:
// app/api/pdf-topics/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import OpenAI from 'openai';

// // const MODEL = 'gpt-4-1106-preview'; // GPT-4.1
// const MODEL = 'gpt-4o'; // GPT-4.1

// async function extractChunkTopics(openai: OpenAI, text: string): Promise<string[]> {
//   const prompt = `
// Extract up to 3 main topics from this text. Return a JSON array of short labels in the same language.

// Text:
// ${text}
// `;
//   const resp = await openai.chat.completions.create({
//     model: MODEL,
//     messages: [{ role: 'user', content: prompt.trim() }],
//   });
//   const raw = resp.choices[0].message?.content || '[]';
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return raw.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 3);
//   }
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const document_id = params.id;
//   const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

//   const { data: chunks, error } = await supabase
//     .from('pdf_chunks')
//     .select('text')
//     .eq('document_id', document_id)
//     .order('chunk_index', { ascending: true });

//   if (error || !chunks) {
//     return NextResponse.json({ error: error?.message }, { status: 500 });
//   }

//   // 1) extract per-chunk
//   const lists = await Promise.all(chunks.map(c => extractChunkTopics(openai, c.text)));

//   // 2) flatten + dedupe
//   const topics = Array.from(new Set(lists.flat()));

//   return NextResponse.json({ topics });
// }

// export async function POST(request: NextRequest) {
//   const { document_id } = await request.json();
//   // delegate to GET logic for consistency
//   return GET(request, { params: { id: document_id } });
// }
