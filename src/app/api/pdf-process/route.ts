
import { supabaseAnonKey } from '@/app/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { document_id } = await request.json()

  if (!document_id) {
    return NextResponse.json({ error: 'document_id is required' }, { status: 400 })
  }

  try {
    // invoke the deployed Edge Function named "pdf-process"
    const { data, error } = await supabaseAnonKey.functions.invoke('pdf-process', {
      body: { document_id }
    })

    if (error) {
      console.error('Edge function error:', error)
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
