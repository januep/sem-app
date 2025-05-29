// app/api/check-course/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const pdfId = params.id
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: course, error } = await supabase
    .from('courses')
    .select('id')
    .eq('pdf_document_id', pdfId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  // jeżeli nie ma kursu, course będzie null
  return NextResponse.json({ courseId: course?.id || null })
}
