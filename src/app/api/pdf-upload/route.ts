// app/api/pdf-upload/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid PDF' }, { status: 400 });
    }

    // unikalna ścieżka
    const id = uuidv4();
    const path = `raw/${id}__${file.name}`;

    // upload do Supabase Storage
    const { error: uploadErr } = await supabase
      .storage
      .from('pdfs')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      console.error('Error on uploading to storage:', uploadErr);
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    // zapis rekordu w tabeli
    // const { data, error: dbErr } = await supabase
    const { error: dbErr } = await supabase
      .from('pdf_documents')
      .insert([{
        id,
        filename: file.name,
        path,
        processed: false
      }]);

    if (dbErr) {
      console.error('DB insert error:', dbErr);
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    return NextResponse.json({ document_id: id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
