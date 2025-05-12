// app/api/pdf-list/route.ts
import { Database } from '@/app/lib/database.types';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is not configured.');
    return NextResponse.json(
      { error: 'Server configuration error. Unable to connect to the database.' },
      { status: 500 }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { data: pdfs, error } = await supabase
      .from('pdf_documents')
      .select('id, filename, uploaded_at, page_count, title, author, subject, word_count, char_count, processed')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json(
        { error: 'Błąd ładowania PDF-ów', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(pdfs);

  } catch (e: any) {
    console.error('API route error:', e.message);
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.', details: e.message },
      { status: 500 }
    );
  }
}