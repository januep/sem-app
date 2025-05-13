// src/app/api/pdf/[id]/route.ts
import { Database } from '@/app/lib/database.types'
import { supabase } from '@/app/lib/supabaseClient'

import { NextResponse } from 'next/server'

export async function GET(
  _req: Request, 
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json({ error: 'PDF ID is required' }, { status: 400 })
  }

  const { data: pdf, error } = await supabase
    .from<Database['public']['Tables']['pdf_documents']['Row']>('pdf_documents')
    .select(`
      id, filename, uploaded_at, page_count, title, author,
      subject, word_count, char_count, processed, path
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json(
      { error: 'Error fetching PDF details' },
      { status: 500 }
    )
  }
  if (!pdf) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  return NextResponse.json(pdf)
}
