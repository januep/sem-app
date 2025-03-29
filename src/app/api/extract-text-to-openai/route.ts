import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Received request for processing text and sending prompt to OpenAI.');

    // Parse the FormData and extract the text file.
    const formData = await request.formData();
    const textFile = formData.get('text') as File | null;
    if (!textFile) {
      console.error('No text file provided');
      return NextResponse.json({ error: 'No text file provided' }, { status: 400 });
    }

    console.log(`Processing file: ${textFile.name}`);
    // Read the text file content.
    const promptText = await textFile.text();
    console.log('Extracted prompt (first 100 chars):', promptText.substring(0, 100));

    // Now send the extracted text as a prompt to OpenAI API.
    const openAIResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Make sure your OPENAI_API_KEY is set in your environment.
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // specify GPT-4
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: promptText },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const openAIData = await openAIResponse.json();
    console.log('Response from OpenAI:', openAIData);

    if (!openAIResponse.ok) {
      return NextResponse.json(
        { error: openAIData.error || 'OpenAI API request failed' },
        { status: 500 }
      );
    }

    // Return the generated completion text.
    return NextResponse.json({ completion: openAIData.choices[0].text });
  } catch (error: any) {
    console.error('Error processing text and calling OpenAI API:', error.message || error);
    return NextResponse.json({ error: 'Failed to process text and call OpenAI API' }, { status: 500 });
  }
}
