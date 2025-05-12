import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Please provide a valid PDF file' },
        { status: 400 }
      );
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document using pdf-lib for metadata
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Extract basic metadata
    const pageCount = pdfDoc.getPageCount();
    const title = pdfDoc.getTitle() || 'No title';
    const author = pdfDoc.getAuthor() || 'Unknown author';
    const subject = pdfDoc.getSubject() || 'No subject';
    const creationDate = pdfDoc.getCreationDate();
    const modificationDate = pdfDoc.getModificationDate();

    // Use pdf-parse to extract text for word and character counts
    const dataBuffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(dataBuffer);
    
    // Calculate word count and character count
    const text = pdfData.text || '';
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const characterCount = text.length;

    // Create a metadata object
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

    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
}