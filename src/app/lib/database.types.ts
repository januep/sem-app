// Database Types for Next.js Application
// Auto-generated from PostgreSQL schema

export interface Database {
  public: {
    Tables: {
      chunks: {
        Row: Chunk
        Insert: ChunkInsert
        Update: ChunkUpdate
      }
      course_topics: {
        Row: CourseTopic
        Insert: CourseTopicInsert
        Update: CourseTopicUpdate
      }
      courses: {
        Row: Course
        Insert: CourseInsert
        Update: CourseUpdate
      }
      page_images: {
        Row: PageImage
        Insert: PageImageInsert
        Update: PageImageUpdate
      }
      pdf_chunks: {
        Row: PdfChunk
        Insert: PdfChunkInsert
        Update: PdfChunkUpdate
      }
      pdf_documents: {
        Row: PdfDocument
        Insert: PdfDocumentInsert
        Update: PdfDocumentUpdate
      }
      pdf_pages: {
        Row: PdfPage
        Insert: PdfPageInsert
        Update: PdfPageUpdate
      }
      quizzes: {
        Row: Quiz
        Insert: QuizInsert
        Update: QuizUpdate
      }
    }
  }
}

// Table Types
export interface Chunk {
  id: string
  pdf_id: string
  start_page: number
  end_page: number
  text: string
  token_count: number
  order: number
  created_at: string | null
  updated_at: string | null
}

export interface ChunkInsert {
  id?: string
  pdf_id: string
  start_page: number
  end_page: number
  text: string
  token_count: number
  order: number
  created_at?: string | null
  updated_at?: string | null
}

export interface ChunkUpdate {
  id?: string
  pdf_id?: string
  start_page?: number
  end_page?: number
  text?: string
  token_count?: number
  order?: number
  created_at?: string | null
  updated_at?: string | null
}

export interface CourseTopic {
  course_id: string
  topic: string
}

export interface CourseTopicInsert {
  course_id: string
  topic: string
}

export interface CourseTopicUpdate {
  course_id?: string
  topic?: string
}

export interface Course {
  id: string
  pdf_document_id: string
  title: string
  markdown: string
  created_at: string
  updated_at: string
}

export interface CourseInsert {
  id?: string
  pdf_document_id: string
  title: string
  markdown: string
  created_at?: string
  updated_at?: string
}

export interface CourseUpdate {
  id?: string
  pdf_document_id?: string
  title?: string
  markdown?: string
  created_at?: string
  updated_at?: string
}

export interface PageImage {
  id: string
  page_id: string
  url: string
  bbox: Json
  vision_text: string | null
  created_at: string | null
}

export interface PageImageInsert {
  id?: string
  page_id: string
  url: string
  bbox: Json
  vision_text?: string | null
  created_at?: string | null
}

export interface PageImageUpdate {
  id?: string
  page_id?: string
  url?: string
  bbox?: Json
  vision_text?: string | null
  created_at?: string | null
}

export interface PdfChunk {
  id: number
  document_id: string
  chunk_index: number
  text: string
  embedding: unknown // USER-DEFINED type - adjust based on your embedding format
  created_at: string
}

export interface PdfChunkInsert {
  id?: number
  document_id: string
  chunk_index: number
  text: string
  embedding: unknown // USER-DEFINED type - adjust based on your embedding format
  created_at?: string
}

export interface PdfChunkUpdate {
  id?: number
  document_id?: string
  chunk_index?: number
  text?: string
  embedding?: unknown // USER-DEFINED type - adjust based on your embedding format
  created_at?: string
}

export interface PdfDocument {
  id: string
  filename: string
  path: string
  uploaded_at: string
  page_count: number | null
  title: string | null
  author: string | null
  subject: string | null
  word_count: number | null
  char_count: number | null
  processed: boolean
  generated_summaries: boolean | null
  summary: string | null
}

export interface PdfDocumentInsert {
  id?: string
  filename: string
  path: string
  uploaded_at?: string
  page_count?: number | null
  title?: string | null
  author?: string | null
  subject?: string | null
  word_count?: number | null
  char_count?: number | null
  processed?: boolean
  generated_summaries?: boolean | null
  summary?: string | null
}

export interface PdfDocumentUpdate {
  id?: string
  filename?: string
  path?: string
  uploaded_at?: string
  page_count?: number | null
  title?: string | null
  author?: string | null
  subject?: string | null
  word_count?: number | null
  char_count?: number | null
  processed?: boolean
  generated_summaries?: boolean | null
  summary?: string | null
}

export interface PdfPage {
  id: string
  pdf_id: string
  page_number: number
  text: string
  summary: string | null
  created_at: string | null
  updated_at: string | null
}

export interface PdfPageInsert {
  id?: string
  pdf_id: string
  page_number: number
  text: string
  summary?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PdfPageUpdate {
  id?: string
  pdf_id?: string
  page_number?: number
  text?: string
  summary?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Quiz {
  id: string
  quizTitle: string
  description: string | null
  approximateTime: number | null
  heroIconName: string | null
  created_by: string | null
  questions: Json | null
  created_at: string | null
  chunk_id: string | null
}

export interface QuizInsert {
  id?: string
  quizTitle: string
  description?: string | null
  approximateTime?: number | null
  heroIconName?: string | null
  created_by?: string | null
  questions?: Json | null
  created_at?: string | null
  chunk_id?: string | null
}

export interface QuizUpdate {
  id?: string
  quizTitle?: string
  description?: string | null
  approximateTime?: number | null
  heroIconName?: string | null
  created_by?: string | null
  questions?: Json | null
  created_at?: string | null
  chunk_id?: string | null
}

// Utility Types
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enum-like types for specific fields (add as needed)
export type TableNames = keyof Database['public']['Tables']

// Helper types for relationships
export interface ChunkWithPdf extends Chunk {
  pdf_document?: PdfDocument
}

export interface CourseWithPdf extends Course {
  pdf_document?: PdfDocument
  topics?: CourseTopic[]
}

export interface PdfDocumentWithPages extends PdfDocument {
  pdf_pages?: PdfPage[]
  chunks?: Chunk[]
  courses?: Course[]
}

export interface PdfPageWithImages extends PdfPage {
  page_images?: PageImage[]
}

export interface QuizWithChunk extends Quiz {
  chunk?: Chunk
}

// Type guards
export const isValidUuid = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

// Database response types
export type DbResult<T> = T | null
export type DbError = {
  message: string
  details?: string
  hint?: string
  code?: string
}