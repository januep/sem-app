// api/pdf-page-slice
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { PDFDocument } from 'pdf-lib'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    // Pobranie ID dokumentu PDF z żądania
    const { pdfId } = await req.json()

    console.log(`Rozpoczynanie wyodrębniania tekstu dla PDF ID: ${pdfId}`)

    // 1. Pobranie ścieżki do pliku PDF z bazy danych
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('pdf_documents')
      .select('path, filename')
      .eq('id', pdfId)
      .single()
    
    if (docErr || !doc) {
      throw docErr || new Error('PDF not found')
    }

    // 2. Pobranie pliku z bucketu 'pdfs' w Supabase Storage
    const { data: file, error: downloadErr } = await supabaseAdmin
      .storage
      .from('pdfs')
      .download(doc.path)
    
    if (downloadErr || !file) {
      throw downloadErr || new Error('Could not download PDF')
    }

    // 3. Konwersja pliku na Buffer do dalszego przetwarzania
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // 4. Użycie pdf-lib do precyzyjnego odczytu liczby stron
    const pdfDoc = await PDFDocument.load(buffer)
    const totalPages = pdfDoc.getPageCount()
    
    console.log(`PDF zawiera ${totalPages} stron`)

    // 5. Przetwarzanie każdej strony osobno w pętli
    let successfulPages = 0
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        console.log(`Przetwarzanie strony ${pageNum}/${totalPages}`)

        // Wyodrębnienie tekstu z pojedynczej strony (pdf-lib używa indeksów od 0)
        const pageText = await extractSinglePageText(pdfDoc, pageNum - 1)

        // Wstawienie danych strony do tabeli pdf_pages w bazie danych
        const { error: pageErr } = await supabaseAdmin
          .from('pdf_pages')
          .insert({
            pdf_id: pdfId,
            page_number: pageNum,
            text: pageText || `Page ${pageNum} - No extractable text`
          })

        if (pageErr) {
          console.error(`Błąd podczas wstawiania strony ${pageNum}:`, pageErr)
        } else {
          successfulPages++
          console.log(`Pomyślnie przetworzono stronę ${pageNum}`)
        }

      } catch (pageErr) {
        console.error(`Błąd podczas przetwarzania strony ${pageNum}:`, pageErr)
        continue // Kontynuuj z następną stroną mimo błędu
      }
    }

    // 6. Oznaczenie dokumentu PDF jako przetworzony w bazie danych
    const { error: updateErr } = await supabaseAdmin
      .from('pdf_documents')
      .update({ processed: true })
      .eq('id', pdfId)

    if (updateErr) {
      console.error('Błąd podczas oznaczania PDF jako przetworzony:', updateErr)
    }

    console.log(`Pomyślnie przetworzono ${successfulPages}/${totalPages} stron`)

    // Zwrócenie podsumowania rezultatów przetwarzania
    return NextResponse.json({ 
      success: true, 
      totalPages: totalPages,
      processedPages: successfulPages,
      message: `Successfully processed ${successfulPages} out of ${totalPages} pages`
    })

  } catch (err: unknown) {
    // Obsługa nieoczekiwanych błędów
    console.error('Błąd pdf-page-slice:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

// Funkcja pomocnicza do wyodrębniania tekstu z pojedynczej strony przy użyciu pdf-lib
async function extractSinglePageText(pdfDoc: PDFDocument, pageIndex: number): Promise<string> {
  try {
    // Utworzenie nowego dokumentu PDF zawierającego tylko jedną stronę
    const singlePageDoc = await PDFDocument.create()
    const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [pageIndex])
    singlePageDoc.addPage(copiedPage)
    
    // Serializacja dokumentu do postaci binarnej
    const pdfBytes = await singlePageDoc.save()
    const buffer = Buffer.from(pdfBytes)
    
    // Użycie pdf-parse do wyodrębnienia tekstu z pojedynczej strony
    const data = await pdfParse(buffer)
    
    return data.text?.trim() || ''
    
  } catch (err) {
    console.error(`Błąd podczas wyodrębniania tekstu ze strony ${pageIndex + 1}:`, err)
    return '' // Zwróć pusty string w przypadku błędu
  }
}