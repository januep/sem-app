import { NextRequest, NextResponse } from 'next/server'
import { supabaseAlt } from '@/app/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { PDFDocument } from 'pdf-lib'
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid PDF' }, { status: 400 })
    }

    // generate id + path
    const id = uuidv4()
    const path = `raw/${id}__${file.name}`

    // upload to storage
    const { error: uploadErr } = await supabaseAlt
      .storage
      .from('pdfs')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      console.error('Storage upload error:', uploadErr)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    // read the file to extract metadata
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // extract text + PDF metadata
    const [pdfData, pdfDoc] = await Promise.all([
      pdfParse(buffer),
      PDFDocument.load(buffer)
    ])
    const text = pdfData.text || ''
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    const charCount = text.length
    const pageCount = pdfDoc.getPageCount()
    const title = pdfDoc.getTitle() || null
    const author = pdfDoc.getAuthor() || null
    const subject = pdfDoc.getSubject() || null
    const creationDate = pdfDoc.getCreationDate()?.toISOString() || null
    const modificationDate = pdfDoc.getModificationDate()?.toISOString() || null

    // only insert the columns that actually exist:
    const { error: dbErr } = await supabaseAlt
      .from('pdf_documents')
      .insert([{
        id,
        filename: file.name,
        path,
        processed: false,
        // page_count, word_count, char_count *do* exist from earlier steps,
        // but if they too don't exist, remove them here:
        page_count: pageCount,
        word_count: wordCount,
        char_count: charCount,
        // title, author, subject likewise:
        title,
        author,
        subject
      }])

    if (dbErr) {
      console.error('DB insert error:', dbErr)
      return NextResponse.json({ error: dbErr.message }, { status: 500 })
    }

    // return full metadata so the client can show it immediately
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

  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
