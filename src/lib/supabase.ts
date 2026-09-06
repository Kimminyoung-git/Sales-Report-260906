import { createClient } from "@supabase/supabase-js";

export type Post = {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  created_at: string;
};

export type Comment = {
  id: number;
  post_id: number;
  content: string;
  author: string;
  created_at: string;
};

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
