import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Quiz not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
