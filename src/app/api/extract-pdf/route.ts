import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(request: Request) {
  try {
    console.log('Received PDF processing request.');
    
    const formData = await request.formData();
    const simulateFailure = formData.get('simulateFailure');
    if (simulateFailure === 'true') {
      console.error('Simulated failure triggered.');
      throw new Error('Simulated failure for debugging purposes.');
    }
    
    const pdfFile = formData.get('pdf') as File | null;
    if (!pdfFile) {
      console.error('No PDF file provided');
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }
    console.log(`Processing file: ${pdfFile.name}`);
    
    // Get the file data as an ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('Obtained arrayBuffer of length:', arrayBuffer.byteLength);
    
    // Create a Buffer from the ArrayBuffer
    const originalBuffer = Buffer.from(arrayBuffer);
    console.log('Original Buffer length:', originalBuffer.length);
    
    // Create a new Buffer copy to ensure no extra properties (like "path") persist
    const buffer = Buffer.alloc(originalBuffer.length);
    originalBuffer.copy(buffer);
    if ((buffer as any).path) {
      console.log('Removing path property from buffer:', (buffer as any).path);
      delete (buffer as any).path;
    }
    
    // Parse the PDF using the clean Buffer
    const data = await pdfParse(buffer);
    console.log('PDF parsed successfully. Number of pages:', data.numpages);
    
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error('Error processing PDF:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
