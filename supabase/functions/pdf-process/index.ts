import { serve } from 'https://deno.land/x/supabase_edge_functions@1.0.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import pdfParse from 'npm:pdf-parse';
import { PDFDocument } from 'npm:pdf-lib';
import OpenAI from 'npm:openai';

// klient z service_role, RLS pominięte
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

// prosta funkcja do dzielenia tekstu na chunki
function chunkText(text: string, maxChars = 2000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

serve(async (req) => {
  try {
    const { document_id } = await req.json();

    // 1) pobierz rekord z path
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('pdf_documents')
      .select('path')
      .eq('id', document_id)
      .single();
    if (docErr || !doc) throw docErr ?? new Error('Document not found');

    // 2) ściągnij PDF
    const { data: fileBlob, error: dlErr } = await supabaseAdmin
      .storage
      .from('pdfs')
      .download(doc.path);
    if (dlErr || !fileBlob) throw dlErr ?? new Error('Download error');

    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) wyciągnij tekst i metadane
    const [pdfData, pdfDoc] = await Promise.all([
      pdfParse(buffer),
      PDFDocument.load(buffer)
    ]);
    const fullText = pdfData.text || '';
    const pageCount = pdfDoc.getPageCount();
    const wordCount = fullText.trim().split(/\s+/).length;
    const charCount = fullText.length;

    // 4) podziel na chunki
    const chunks = chunkText(fullText, 2000);

    // 5) generuj embeddingi i zapisuj
    for (let i = 0; i < chunks.length; i++) {
      const embResp = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunks[i]
      });
      const embedding = embResp.data[0].embedding;

      await supabaseAdmin
        .from('pdf_chunks')
        .insert({
          document_id,
          chunk_index: i,
          text: chunks[i],
          embedding
        });
    }

    // 6) oznacz processed = true + metadane
    await supabaseAdmin
      .from('pdf_documents')
      .update({
        page_count: pageCount,
        word_count: wordCount,
        char_count: charCount,
        processed: true
      })
      .eq('id', document_id);

    return new Response(JSON.stringify({ success: true, chunks: chunks.length }), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
