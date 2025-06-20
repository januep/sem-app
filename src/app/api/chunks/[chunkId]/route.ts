// app/api/chunks/[chunkId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/app/lib/database.types'

// initialize once
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chunkId: string }> }
): Promise<NextResponse> {
  try {
    // await the promise
    const { chunkId } = await context.params

    if (!chunkId) {
      return NextResponse.json({ error: 'Chunk ID is required' }, { status: 400 })
    }

    const { data: chunk, error } = await supabase
      .from('chunks')
      .select('*')
      .eq('id', chunkId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Chunk not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Database error while fetching chunk' }, { status: 500 })
    }

    if (!chunk) {
      return NextResponse.json({ error: 'Chunk not found' }, { status: 404 })
    }

    return NextResponse.json(chunk)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
