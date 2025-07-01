import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const { document_id } = await request.json();

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // 1) fetch record
  const { data: doc } = await supabaseAdmin
    .from('pdf_documents')
    .select('path')
    .eq('id', document_id)
    .single();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 2) download blob
  const { data: blob } = await supabaseAdmin
    .storage.from('pdfs').download(doc.path);
  const buffer = Buffer.from(await blob!.arrayBuffer());

  // 3) parse & chunk
  const [pdfData, pdfDoc] = await Promise.all([
    pdfParse(buffer),
    PDFDocument.load(buffer),
  ]);
  const text = pdfData.text || '';
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push(text.slice(i, i + 2000));
  }

  // 4) embed & insert
  for (let i = 0; i < chunks.length; i++) {
    const emb = (
      await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunks[i],
      })
    ).data[0].embedding;
    await supabaseAdmin.from('pdf_chunks').insert({
      document_id,
      chunk_index: i,
      text: chunks[i],
      embedding: emb,
    });
  }

  // 5) update metadata
  await supabaseAdmin
    .from('pdf_documents')
    .update({
      page_count: pdfDoc.getPageCount(),
      word_count: text.trim().split(/\s+/).length,
      char_count: text.length,
      processed: true,
    })
    .eq('id', document_id);

  return NextResponse.json({ success: true, chunks: chunks.length });
}
