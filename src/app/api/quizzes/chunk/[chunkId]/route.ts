import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { chunkId: string } }
) {
  try {
    const { chunkId } = params;

    if (!chunkId) {
      return NextResponse.json(
        { error: 'Chunk ID is required' },
        { status: 400 }
      );
    }

    // Fetch quiz(es) associated with this chunk
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('chunk_id', chunkId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      if (error.code === 'PGRST116') {
        // No rows returned - this is normal, just means no quiz exists yet
        return NextResponse.json(
          { error: 'No quiz found for this chunk' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error while fetching quiz' },
        { status: 500 }
      );
    }

    if (!quiz) {
      return NextResponse.json(
        { error: 'No quiz found for this chunk' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: POST method to create/update quiz for a chunk
export async function POST(
  request: NextRequest,
  { params }: { params: { chunkId: string } }
) {
  try {
    const { chunkId } = params;
    const body = await request.json();

    if (!chunkId) {
      return NextResponse.json(
        { error: 'Chunk ID is required' },
        { status: 400 }
      );
    }

    // Verify the chunk exists
    const { data: chunk, error: chunkError } = await supabase
      .from('chunks')
      .select('id')
      .eq('id', chunkId)
      .single();

    if (chunkError || !chunk) {
      return NextResponse.json(
        { error: 'Chunk not found' },
        { status: 404 }
      );
    }

    // Create the quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([
        {
          ...body,
          chunk_id: chunkId,
        }
      ])
      .select('*')
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      return NextResponse.json(
        { error: 'Failed to create quiz' },
        { status: 500 }
      );
    }

    return NextResponse.json(quiz, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}