// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // process.env.SUPABASE_SERVICE_ROLE_KEY!  // dla serwerowych operacji; w UI możesz użyć anon key + RLS
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const supabaseAlt = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // dla serwerowych operacji; w UI możesz użyć anon key + RLS
  // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
