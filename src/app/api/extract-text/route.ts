import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Received request to extract text and call GPT‑3.5.');

    // 1) Parse the FormData and extract the .txt file
    const formData = await request.formData();
    const textFile = formData.get('text') as File | null;
    if (!textFile) {
      console.error('No text file provided');
      return NextResponse.json({ error: 'No text file provided' }, { status: 400 });
    }

    console.log(`Processing file: ${textFile.name}`);
    // 2) Read the text file content
    const promptText = await textFile.text();
    console.log('Extracted prompt (first 100 chars):', promptText.substring(0, 100));

    // 3) Send prompt to OpenAI (GPT‑3.5)
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Must be set in .env.local
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',           // GPT-3.5 model
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: promptText },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response:', openAIData);

    if (!openAIResponse.ok) {
      // If OpenAI returned an error (e.g. insufficient permissions, invalid key, etc.)
      return NextResponse.json(
        { error: openAIData.error?.message || 'OpenAI API request failed' },
        { status: 500 }
      );
    }

    // 4) Return the generated completion text from GPT-3.5
    const completionText = openAIData.choices?.[0]?.message?.content || '';
    return NextResponse.json({ completion: completionText });
  } catch (error: any) {
    console.error('Error extracting text or calling GPT‑3.5:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to process text and call OpenAI API' },
      { status: 500 }
    );
  }
}
