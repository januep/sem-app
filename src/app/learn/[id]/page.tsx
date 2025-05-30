// app/learn/[id]/page.tsx
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Play,
  Award,
  Sparkles
} from 'lucide-react'

interface Chunk {
  id: string
  start_page: number
  end_page: number
  order: number
}

interface Quiz {
  id: string
  quizTitle: string
  description: string
  approximateTime: number
  heroIconName: string
  chunk_id: string
}

interface PdfDocument {
  id: string
  title: string
  filename: string
  path: string
  summary: string
}

export default async function LearnPage({ params }: { params: { id: string } }) {
  const pdfId = params.id

  // 1. Pobierz informacje o PDF
  const { data: doc, error: docErr } = await supabaseAdmin
    .from('pdf_documents')
    .select('path, title, filename, summary')
    .eq('id', pdfId)
    .single()
  
  if (docErr || !doc) {
    console.error('PDF not found:', docErr)
    return notFound()
  }

  const pdfDoc = doc as PdfDocument

  // 2. Pobierz publiczny URL pliku
  const { data: urlData, error: urlErr } = supabaseAdmin
    .storage
    .from('pdfs')
    .getPublicUrl(pdfDoc.path)
  
  if (urlErr || !urlData) {
    console.error('Could not get public URL:', urlErr)
    return <p>Unable to load PDF</p>
  }
  const publicUrl = urlData.publicUrl

  // 3. Pobierz wszystkie chunki dla tego PDF-a
  const { data: chunks, error: chunksErr } = await supabaseAdmin
    .from('chunks')
    .select('id, start_page, end_page, order')
    .eq('pdf_id', pdfId)
    .order('order', { ascending: true })
  
  if (chunksErr) {
    console.error('Error fetching chunks:', chunksErr)
    return <p>Unable to load content chunks</p>
  }

  // 4. Pobierz wszystkie quizy powiązane z chunkami
  const chunkIds = chunks?.map(chunk => chunk.id) || []
  const { data: quizzes, error: quizzesErr } = await supabaseAdmin
    .from('quizzes')
    .select('id, quizTitle, description, approximateTime, heroIconName, chunk_id')
    .in('chunk_id', chunkIds)
  
  if (quizzesErr) {
    console.error('Error fetching quizzes:', quizzesErr)
  }

  // 5. Sprawdź czy istnieje już quiz dla tego PDF - jeśli tak, przekieruj
  if (quizzes && quizzes.length === 1 && chunks && chunks.length === 1) {
    // Jeśli jest tylko jeden chunk i jeden quiz, przekieruj bezpośrednio
    const quiz = quizzes[0]
    redirect(`/courses/${quiz.id}`)
  }

  // Mapowanie quizów według chunk_id
  const quizByChunkId = new Map(quizzes?.map(quiz => [quiz.chunk_id, quiz]) || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen">
        {/* PDF Viewer */}
        <div className="w-1/2 border-r border-gray-200 bg-white shadow-lg">
          <div className="h-full flex flex-col">
            {/* PDF Header */}
            <div className="bg-gradient-to-r from-slate-700 to-gray-800 text-white p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h2 className="font-semibold text-lg truncate">
                    {pdfDoc.title || pdfDoc.filename}
                  </h2>
                  <p className="text-slate-100 text-sm">Learning Material</p>
                </div>
              </div>
            </div>
            
            {/* PDF Iframe */}
            <div className="flex-1">
              <iframe
                src={publicUrl}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>

        {/* Content & Quizzes Panel */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-slate-800 text-white p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Interactive Learning</h1>
            </div>
            
            {pdfDoc.summary && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm leading-relaxed">
                  {pdfDoc.summary}
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {chunks && chunks.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-slate-600" />
                    Learning Sections
                  </h2>
                  <div className="text-sm text-gray-500">
                    {chunks.length} section{chunks.length !== 1 ? 's' : ''} available
                  </div>
                </div>

                <div className="grid gap-4">
                  {chunks.map((chunk, index) => {
                    const quiz = quizByChunkId.get(chunk.id)
                    const isCompleted = !!quiz
                    
                    return (
                      <div
                        key={chunk.id}
                        className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          isCompleted 
                            ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-300' 
                            : 'border-gray-200 bg-white hover:border-slate-400 hover:shadow-md'
                        }`}
                      >
                        {/* Quiz Available - Direct Link */}
                        {quiz ? (
                          <Link
                            href={`/courses/${quiz.id}`}
                            className="block p-6"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                    Quiz Ready
                                  </span>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                  {quiz.quizTitle}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {quiz.description}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-1" />
                                    Pages {chunk.start_page}–{chunk.end_page}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {quiz.approximateTime} min
                                  </div>
                                </div>
                              </div>
                              
                              <div className="ml-4 flex flex-col items-center space-y-2">
                                <Play className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium text-green-700">Start Quiz</span>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          /* No Quiz - Create Link */
                          <Link
                            href={`/learn/${pdfId}/chunk/${chunk.id}`}
                            className="block p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    Section {index + 1}
                                  </span>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                  Content Section {chunk.start_page}–{chunk.end_page}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-3">
                                  Create an interactive quiz for pages {chunk.start_page} to {chunk.end_page}
                                </p>
                                
                                <div className="flex items-center text-sm text-gray-500">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Pages {chunk.start_page}–{chunk.end_page}
                                </div>
                              </div>
                              
                              <div className="ml-4 flex flex-col items-center space-y-2">
                                <ArrowRight className="w-6 h-6 text-slate-600 group-hover:translate-x-1 transition-transform" />
                                <span className="text-xs font-medium text-slate-700">Create Quiz</span>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Progress Summary */}
                <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-slate-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Learning Progress</h3>
                        <p className="text-sm text-gray-700">
                          {quizzes?.length || 0} of {chunks.length} sections have quizzes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(((quizzes?.length || 0) / chunks.length) * 100)}%
                      </div>
                      <div className="text-xs text-gray-700">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Content Sections</h3>
                <p className="text-gray-500 max-w-md">
                  No chunks are available for this document. Please generate chunks first to create interactive learning content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}