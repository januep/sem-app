// app/api/check-course/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pdfId = params.id

    // Validate that pdfId exists
    if (!pdfId) {
      return NextResponse.json({ error: 'PDF ID is required' }, { status: 400 })
    }

    // Check environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: course, error } = await supabase
      .from('courses')
      .select('id')
      .eq('pdf_document_id', pdfId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // jeżeli nie ma kursu, course będzie null
    return NextResponse.json({ courseId: course?.id || null })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}