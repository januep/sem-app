import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse';
import { Quiz } from '@/app/types/quiz';

// Inicjalizacja klienta OpenAI i Supabase
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Pobierz dane formularza
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile || !(pdfFile instanceof File)) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    // Odczytaj zawartość pliku do ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    // Używamy nowej tablicy bajtów, aby uniknąć kopiowania niechcianych właściwości (np. "path")
    const pdfBuffer = Buffer.from(new Uint8Array(arrayBuffer));
    const pdfData = await pdfParse(pdfBuffer);
    const textFromPdf = pdfData.text;

    if (!textFromPdf) {
      return NextResponse.json(
        { error: 'Failed to extract text from PDF' },
        { status: 400 }
      );
    }

    // Definicja promptu systemowego
    const systemPrompt = `
      You are an expert quiz creator that creates JSON quiz data adhering to a specific format.

      /**
       * Quiz JSON Schema Instructions:
       * 
       * This file defines the structure for generating quiz JSON objects.
       * When generating a quiz for any subject, ensure the JSON adheres to the following:
       * 
       * - The quiz object must have a 'quizTitle' string and an array of 'questions'.
       * - Each question must follow one of the defined types:
       *    - MAMCQ: Multiple Answer Multiple Choice (more than one correct answer).
       *    - SAMCQ: Single Answer Multiple Choice.
       *    - FillBlanks: Questions with one or more blanks to fill.
       *    - TrueFalse: A statement that is either true or false.
       *    - Matching: Matching pairs of terms and definitions.
       * 
       * Each question must include a unique numeric 'id' and a 'prompt' (the question text).
       * Use the properties defined below for each specific question type.
       */

      Quiz Interface:
      {
        quizTitle: string;
        description: string;
        approximateTime: number;
        heroIconName: string;
        questions: QuizQuestion[];
      }

      Where QuizQuestion can be one of:
      - MAMCQQuestion:
        {
          id: number;
          type: "MAMCQ";
          prompt: string;
          options: string[];
          correctAnswers: string[];
        }

      - SAMCQQuestion:
        {
          id: number;
          type: "SAMCQ";
          prompt: string;
          options: string[];
          correctAnswer: string;
        }

      - FillBlanksQuestion:
        {
          id: number;
          type: "FillBlanks";
          prompt: string;
          blanks: number;
          answers: string[];
        }

      - TrueFalseQuestion:
        {
          id: number;
          type: "TrueFalse";
          prompt: string;
          correctAnswer: boolean;
        }

      - MatchingQuestion:
        {
          id: number;
          type: "Matching";
          prompt: string;
          pairs: [
            {
              term: string;
              definition: string;
            }
          ];
        }

      For heroIconName, use one of: "AcademicCapIcon", "BookOpenIcon", "BeakerIcon", "LightBulbIcon", "PuzzlePieceIcon", etc.
      
      Generate a quiz based on the content of the provided PDF document. Respond with ONLY a valid JSON object that matches the Quiz interface. DO NOT include any explanations, comments, or markdown formatting in your response.
    `;

    // Tworzymy prompt użytkownika, włączając treść wyekstrahowaną z PDF
    const userPrompt = `Here is the content of a PDF document:\n\n${textFromPdf}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    let quizData: Quiz;

    try {
      quizData = JSON.parse(content);
    } catch (_error) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      console.error(_error);
      return NextResponse.json(
        { error: 'Failed to generate valid quiz data. Please try again.' },
        { status: 500 }
      );
    }

    // Zapisujemy wygenerowany quiz do Supabase
    const { data, error: insertError } = await supabase
      .from('quizzes')
      .insert([
        {
          quizTitle: quizData.quizTitle,
          description: quizData.description,
          approximateTime: quizData.approximateTime,
          heroIconName: quizData.heroIconName,
          questions: quizData.questions,
        }
      ])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting quiz into Supabase:', insertError);
      return NextResponse.json(
        { error: 'Failed to save quiz to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quizTitle: quizData.quizTitle,
      id: data.id,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
