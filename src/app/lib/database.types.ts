// src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pdf_documents: {
        Row: {
          id: string;
          filename: string;
          path: string;
          uploaded_at: string;       // timestamptz
          page_count: number | null;
          title: string | null;
          author: string | null;
          subject: string | null;
          summary: string | null;
          word_count: number | null;
          char_count: number | null;
          processed: boolean;
          generated_summaries: boolean;
        };
        Insert: {
          id?: string;
          filename: string;
          path: string;
          uploaded_at?: string;
          page_count?: number | null;
          title?: string | null;
          author?: string | null;
          subject?: string | null;
          summary?: string | null;
          word_count?: number | null;
          char_count?: number | null;
          processed?: boolean;
          generated_summaries?: boolean;
        };
        Update: {
          id?: string;
          filename?: string;
          path?: string;
          uploaded_at?: string;
          page_count?: number | null;
          title?: string | null;
          author?: string | null;
          subject?: string | null;
          summary?: string | null;
          word_count?: number | null;
          char_count?: number | null;
          processed?: boolean;
          generated_summaries?: boolean;
        };
      };
      pdf_chunks: {
        Row: {
          id: string;
          document_id: string;
          chunk_index: number;
          text: string;
          embedding: number[];
        };
        Insert: {
          id?: string;
          document_id: string;
          chunk_index: number;
          text: string;
          embedding: number[];
        };
        Update: {
          id?: string;
          document_id?: string;
          chunk_index?: number;
          text?: string;
          embedding?: number[];
        };
      };
      course_lessons: {
        Row: {
          id: string;
          document_id: string;
          lesson_index: number;
          mdx_content: string;
          created_at: string;      // timestamptz
        };
        Insert: {
          id?: string;
          document_id: string;
          lesson_index: number;
          mdx_content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          lesson_index?: number;
          mdx_content?: string;
          created_at?: string;
        };
      };
      pdf_topics: {
        Row: {
          document_id: string;
          topics: string;
        };
        Insert: {
          document_id: string;
          topics: string;
        };
        Update: {
          document_id?: string;
          topics?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
