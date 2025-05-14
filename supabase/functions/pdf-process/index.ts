// index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import pdfParse from "npm:pdf-parse";
import { PDFDocument } from "npm:pdf-lib";
import OpenAI from "npm:openai";

//
// Helper to split text into roughly 2 000-char chunks
//
function chunkText(text: string, maxChars = 2000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

//
// The one‐and‐only HTTP entrypoint
//
Deno.serve(async (req) => {
  try {
    console.log("➡️  pdf-process invoked");

    const body = await req.json().catch(() => null);
    if (!body || !body.document_id) {
      return new Response(
        JSON.stringify({ error: "document_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const document_id = body.document_id as string;

    // 1) init Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 2) init OpenAI client
    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

    // 3) fetch document record
    const { data: doc, error: docErr } = await supabaseAdmin
      .from("pdf_documents")
      .select("path")
      .eq("id", document_id)
      .single();
    if (docErr || !doc) {
      return new Response(
        JSON.stringify({ error: docErr?.message || "Document not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // 4) download PDF from storage
    const { data: fileBlob, error: dlErr } = await supabaseAdmin
      .storage
      .from("pdfs")
      .download(doc.path);
    if (dlErr || !fileBlob) {
      return new Response(
        JSON.stringify({ error: dlErr?.message || "Download error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5) parse PDF
    const [pdfData, pdfDoc] = await Promise.all([
      pdfParse(buffer),
      PDFDocument.load(buffer),
    ]);
    const fullText = pdfData.text || "";
    const pageCount = pdfDoc.getPageCount();
    const wordCount = fullText.trim().split(/\s+/).length;
    const charCount = fullText.length;

    // 6) chunk + embed + insert
    const chunks = chunkText(fullText, 2000);
    for (let i = 0; i < chunks.length; i++) {
      const embResp = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: chunks[i],
      });
      await supabaseAdmin.from("pdf_chunks").insert({
        document_id,
        chunk_index: i,
        text: chunks[i],
        embedding: embResp.data[0].embedding,
      });
    }

    // 7) mark processed
    await supabaseAdmin
      .from("pdf_documents")
      .update({
        page_count: pageCount,
        word_count: wordCount,
        char_count: charCount,
        processed: true,
      })
      .eq("id", document_id);

    return new Response(
      JSON.stringify({ success: true, chunks: chunks.length }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
