import { serve } from 'https://deno.land/x/supabase_edge_functions@1.0.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import pdfParse from 'npm:pdf-parse';
import { PDFDocument } from 'npm:pdf-lib';
import OpenAI from 'npm:openai';

// initialize admin client (bypasses RLS)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// initialize OpenAI
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

// helper to split text
function chunkText(text: string, maxChars = 2000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

serve(async (req) => {
  try {
    console.log('➡️  pdf-process invoked');
    console.log('Method:', req.method);
    console.log('Headers:', [...(req.headers.entries())]);

    let body: any;
    try {
      body = await req.json();
      console.log('📡  Request body:', body);
    } catch (parseErr) {
      console.error('❌  Failed to parse JSON body:', parseErr);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const document_id = body?.document_id;
    if (!document_id) {
      console.error('❌  document_id missing');
      return new Response(JSON.stringify({ error: 'document_id is required' }), { status: 400 });
    }

    // 1) fetch document record
    console.log(`📥  Fetching pdf_documents record for id=${document_id}`);
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('pdf_documents')
      .select('path')
      .eq('id', document_id)
      .single();
    if (docErr || !doc) {
      console.error('❌  Could not fetch pdf_documents:', docErr);
      return new Response(JSON.stringify({ error: docErr?.message || 'Document not found' }), { status: 404 });
    }
    console.log('✅  Retrieved path:', doc.path);

    // 2) download file from storage
    console.log(`📥  Downloading file from bucket 'pdfs' at path=${doc.path}`);
    const { data: fileBlob, error: dlErr } = await supabaseAdmin
      .storage
      .from('pdfs')
      .download(doc.path);
    if (dlErr || !fileBlob) {
      console.error('❌  Storage download error:', dlErr);
      return new Response(JSON.stringify({ error: dlErr?.message || 'Download error' }), { status: 500 });
    }
    console.log('✅  File downloaded, size:', fileBlob.size);

    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) extract text & metadata
    console.log('🔍  Parsing PDF text and metadata');
    const [pdfData, pdfDoc] = await Promise.all([
      pdfParse(buffer),
      PDFDocument.load(buffer)
    ]);
    const fullText = pdfData.text || '';
    console.log(`✅  Extracted text length=${fullText.length}`);
    const pageCount = pdfDoc.getPageCount();
    const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = fullText.length;
    console.log(`✅  Metadata: pages=${pageCount}, words=${wordCount}, chars=${charCount}`);

    // 4) chunk text
    console.log('✂️  Chunking text');
    const chunks = chunkText(fullText, 2000);
    console.log(`✅  Created ${chunks.length} chunks`);

    // 5) generate embeddings & insert
    for (let i = 0; i < chunks.length; i++) {
      console.log(`🧠  Generating embedding for chunk ${i}`);
      const embResp = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunks[i]
      });
      const embedding = embResp.data[0].embedding;

      console.log(`💾  Inserting chunk ${i} into pdf_chunks`);
      const { error: insertErr } = await supabaseAdmin
        .from('pdf_chunks')
        .insert({
          document_id,
          chunk_index: i,
          text: chunks[i],
          embedding
        });
      if (insertErr) {
        console.error(`❌  Failed to insert chunk ${i}:`, insertErr);
        // continue inserting others
      }
    }
    console.log('✅  All chunks processed');

    // 6) update document record
    console.log('🔄  Updating pdf_documents record');
    const { error: updateErr } = await supabaseAdmin
      .from('pdf_documents')
      .update({
        page_count: pageCount,
        word_count: wordCount,
        char_count: charCount,
        processed: true
      })
      .eq('id', document_id);
    if (updateErr) {
      console.error('❌  Failed to update pdf_documents:', updateErr);
      return new Response(JSON.stringify({ error: 'Failed to update document record' }), { status: 500 });
    }
    console.log('✅  pdf_documents updated');

    return new Response(JSON.stringify({ success: true, chunks: chunks.length }), { status: 200 });
  } catch (e: any) {
    console.error('🔥  Unexpected error in pdf-process:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
