// src/app/api/pdf-list/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAnonKey } from '@/app/lib/supabaseClient'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // czekamy na rozpakowanie params
  const { id } = await context.params

  // Walidacja czy ID zostało podane
  if (!id) {
    return NextResponse.json({ error: 'PDF ID is required' }, { status: 400 })
  }

  // Pobranie szczegółów dokumentu PDF z bazy danych Supabase
  const { data: pdf, error } = await supabaseAnonKey
    .from('pdf_documents')
    .select('*')
    .eq('id', id)
    .single()

  // Obsługa błędów zapytania do bazy danych
  if (error) {
    console.error('Błąd Supabase:', error)
    return NextResponse.json(
      { error: 'Error fetching PDF details' },
      { status: 500 }
    )
  }

  // Sprawdzenie czy dokument został znaleziony
  if (!pdf) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  // Zwrócenie danych dokumentu PDF
  return NextResponse.json(pdf)
}
