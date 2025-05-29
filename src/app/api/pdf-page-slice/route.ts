import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { PDFDocument } from 'pdf-lib'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    const { pdfId } = await req.json()

    console.log(`Starting text extraction for PDF ID: ${pdfId}`)

    // 1. Pobierz ścieżkę do PDF-a
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('pdf_documents')
      .select('path, filename')
      .eq('id', pdfId)
      .single()
    
    if (docErr || !doc) {
      throw docErr || new Error('PDF not found')
    }

    // 2. Pobierz plik z bucketu `pdfs`
    const { data: file, error: downloadErr } = await supabaseAdmin
      .storage
      .from('pdfs')
      .download(doc.path)
    
    if (downloadErr || !file) {
      throw downloadErr || new Error('Could not download PDF')
    }

    // 3. Przekonwertuj na Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // 4. Użyj pdf-lib do precyzyjnego odczytu stron
    const pdfDoc = await PDFDocument.load(buffer)
    const totalPages = pdfDoc.getPageCount()
    
    console.log(`PDF has ${totalPages} pages`)

    // 5. Przetwórz każdą stronę osobno
    let successfulPages = 0
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${totalPages}`)

        // Wyciągnij tekst z pojedynczej strony
        const pageText = await extractSinglePageText(pdfDoc, pageNum - 1) // pdf-lib używa indeksów od 0

        // Wstaw stronę do bazy danych
        const { error: pageErr } = await supabaseAdmin
          .from('pdf_pages')
          .insert({
            pdf_id: pdfId,
            page_number: pageNum,
            text: pageText || `Page ${pageNum} - No extractable text`
          })

        if (pageErr) {
          console.error(`Error inserting page ${pageNum}:`, pageErr)
        } else {
          successfulPages++
          console.log(`Successfully processed page ${pageNum}`)
        }

      } catch (pageErr) {
        console.error(`Error processing page ${pageNum}:`, pageErr)
        continue
      }
    }

    // 6. Oznacz PDF jako przetworzony
    const { error: updateErr } = await supabaseAdmin
      .from('pdf_documents')
      .update({ processed: true })
      .eq('id', pdfId)

    if (updateErr) {
      console.error('Error marking PDF as processed:', updateErr)
    }

    console.log(`Successfully processed ${successfulPages}/${totalPages} pages`)

    return NextResponse.json({ 
      success: true, 
      totalPages: totalPages,
      processedPages: successfulPages,
      message: `Successfully processed ${successfulPages} out of ${totalPages} pages`
    })

  } catch (err: any) {
    console.error('pdf-page-slice error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}

// Helper function to extract text from a single page using pdf-lib
async function extractSinglePageText(pdfDoc: PDFDocument, pageIndex: number): Promise<string> {
  try {
    // Utwórz nowy dokument PDF z pojedynczą stroną
    const singlePageDoc = await PDFDocument.create()
    const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [pageIndex])
    singlePageDoc.addPage(copiedPage)
    
    // Serializuj do buffer
    const pdfBytes = await singlePageDoc.save()
    const buffer = Buffer.from(pdfBytes)
    
    // Użyj pdf-parse do wyciągnięcia tekstu z pojedynczej strony
    const data = await pdfParse(buffer)
    
    return data.text?.trim() || ''
    
  } catch (err) {
    console.error(`Error extracting text from page ${pageIndex + 1}:`, err)
    return ''
  }
}