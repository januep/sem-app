
//api/pdf-check
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    // Pobieranie danych formularza z żądania
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Sprawdzenie czy plik został przesłany i czy jest to plik PDF
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Proszę podać prawidłowy plik PDF' },
        { status: 400 }
      );
    }

    // Sprawdzenie rozmiaru pliku - Supabase Storage ma limit 25MB
    const maxFileSize = 25 * 1024 * 1024; // 25MB w bajtach
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'Plik jest za duży. Maksymalny rozmiar to 25MB' },
        { status: 400 }
      );
    }

    // Konwersja pliku na ArrayBuffer do dalszego przetwarzania
    const arrayBuffer = await file.arrayBuffer();
    
    // Ładowanie dokumentu PDF przy użyciu pdf-lib w celu wyodrębnienia metadanych
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Wyodrębnianie podstawowych metadanych z dokumentu PDF
    const pageCount = pdfDoc.getPageCount();
    const title = pdfDoc.getTitle() || null;
    const author = pdfDoc.getAuthor() || null;
    const subject = pdfDoc.getSubject() || null;
    const creationDate = pdfDoc.getCreationDate();
    const modificationDate = pdfDoc.getModificationDate();

    // Używanie pdf-parse do wyodrębnienia tekstu w celu policzenia słów i znaków
    const dataBuffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(dataBuffer);
    
    // Obliczanie liczby słów i znaków z wyodrębnionego tekstu
    const text = pdfData.text || '';
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const characterCount = text.length;

    // Tworzenie obiektu z metadanymi PDF
    const metadata = {
      filename: file.name,
      fileSize: file.size,
      pageCount,
      title,
      author,
      subject,
      wordCount,
      characterCount,
      creationDate: creationDate ? creationDate.toISOString() : null,
      modificationDate: modificationDate ? modificationDate.toISOString() : null,
    };

    // Zwracanie metadanych jako odpowiedź JSON
    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error) {
    // Logowanie błędu do konsoli dla celów debugowania
    console.error('Błąd podczas przetwarzania pliku PDF:', error);
    
    // Zwracanie komunikatu o błędzie do klienta
    return NextResponse.json(
      { error: 'Nie udało się przetworzyć pliku PDF' },
      { status: 500 }
    );
  }
}