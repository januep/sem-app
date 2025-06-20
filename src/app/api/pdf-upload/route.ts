// api/pdf-upload
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { PDFDocument } from 'pdf-lib'
import pdfParse from 'pdf-parse'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    // Pobieranie danych formularza z żądania
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    // Sprawdzenie czy plik został przesłany i czy jest to plik PDF
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Nieprawidłowy plik PDF' }, { status: 400 })
    }

    // Generowanie unikalnego identyfikatora i ścieżki dla pliku
    const id = uuidv4()
    const path = `raw/${id}__${file.name}`

    // Przesyłanie pliku do Supabase Storage
    const { error: uploadErr } = await supabaseAdmin
      .storage
      .from('pdfs')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    // Obsługa błędów przesyłania do storage
    if (uploadErr) {
      console.error('Błąd przesyłania do storage:', uploadErr)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    // Odczytanie pliku w celu wyodrębnienia metadanych
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Równoległe wyodrębnianie tekstu i metadanych PDF dla lepszej wydajności
    const [pdfData, pdfDoc] = await Promise.all([
      pdfParse(buffer),    // Wyodrębnianie tekstu z PDF
      PDFDocument.load(buffer)  // Ładowanie dokumentu PDF dla metadanych
    ])
    
    // Przetwarzanie wyodrębnionego tekstu i obliczanie statystyk
    const text = pdfData.text || ''
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    const charCount = text.length
    
    // Wyodrębnianie metadanych z dokumentu PDF
    const pageCount = pdfDoc.getPageCount()
    const title = pdfDoc.getTitle() || null
    const author = pdfDoc.getAuthor() || null
    const subject = pdfDoc.getSubject() || null
    const creationDate = pdfDoc.getCreationDate()?.toISOString() || null
    const modificationDate = pdfDoc.getModificationDate()?.toISOString() || null

    // Wstawianie rekordu do bazy danych z metadanymi PDF
    const { error: dbErr } = await supabaseAdmin
      .from('pdf_documents')
      .insert([{
        id,
        filename: file.name,
        path,
        processed: false,
        // Statystyki dokumentu
        page_count: pageCount,
        word_count: wordCount,
        char_count: charCount,
        // Metadane dokumentu
        title,
        author,
        subject
      }])

    // Obsługa błędów zapisu do bazy danych
    if (dbErr) {
      console.error('Błąd zapisu do bazy danych:', dbErr)
      return NextResponse.json({ error: dbErr.message }, { status: 500 })
    }

    // Zwracanie pełnych metadanych aby klient mógł je natychmiast wyświetlić
    return NextResponse.json({
      document_id: id,
      metadata: {
        filename: file.name,
        fileSize: file.size,
        pageCount,
        title,
        author,
        subject,
        wordCount,
        characterCount: charCount,
        creationDate,
        modificationDate
      }
    }, { status: 201 })

  } catch (err: unknown) {
    // Logowanie nieoczekiwanych błędów
    console.error('Nieoczekiwany błąd:', err)
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  }
}