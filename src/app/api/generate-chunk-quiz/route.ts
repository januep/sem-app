import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Quiz } from '@/app/types/quiz';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { chunkId, chunkText } = await request.json();

    if (!chunkId || !chunkText) {
      return NextResponse.json(
        { error: 'chunkId and chunkText are required' },
        { status: 400 }
      );
    }

    // Verify that the chunk exists and get PDF document info
    const { data: chunk, error: chunkError } = await supabase
      .from('chunks')
      .select('id, text, pdf_id')
      .eq('id', chunkId)
      .single();

    if (chunkError || !chunk) {
      return NextResponse.json(
        { error: 'Chunk not found' },
        { status: 404 }
      );
    }

    // Get the PDF document summary for context
    const { data: pdfDocument, error: pdfError } = await supabase
      .from('pdf_documents')
      .select('summary, title, filename')
      .eq('id', chunk.pdf_id)
      .single();

    if (pdfError) {
      console.error('Error fetching PDF document:', pdfError);
      // Continue without summary if not available
    }

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
       * 
       * Follow these interfaces to create valid quiz JSON objects.
       */

      Quiz Interface:
      {
        // The title of the quiz.
        quizTitle: string;
        description: string;
        //approximate time in minutes
        approximateTime: number;
        // from @heroicons/react
        heroIconName: string;
        // An array of questions that follow the QuizQuestion union type.
        questions: QuizQuestion[];
      }

      Where QuizQuestion can be one of:
      - MAMCQQuestion: Multiple Answer Multiple Choice question.
        {
          id: number;
          type: "MAMCQ";
          prompt: string;
          options: string[];
          correctAnswers: string[];
        }

      - SAMCQQuestion: Single Answer Multiple Choice question.
        {
          id: number;
          type: "SAMCQ";
          prompt: string;
          options: string[];
          correctAnswer: string;
        }

      - FillBlanksQuestion: Fill in the Blanks question.
        {
          id: number;
          type: "FillBlanks";
          prompt: string;
          blanks: number;
          answers: string[];
        }

      - TrueFalseQuestion: True/False question.
        {
          id: number;
          type: "TrueFalse";
          prompt: string;
          correctAnswer: boolean;
        }

      - MatchingQuestion: Matching question consists of pairs of terms and definitions.
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

      For heroIconName, use one of the common Heroicons like: "AcademicCapIcon", "BookOpenIcon", "BeakerIcon", "LightBulbIcon", "PuzzlePieceIcon", etc.
      
      IMPORTANT CONTEXT:
      - This quiz is for a SPECIFIC SECTION/CHUNK of a larger PDF document
      - You are creating questions based on only this portion of content, not the entire document
      - The content chunk is part of a larger educational document
      - Generate questions in the SAME LANGUAGE as the provided content
      - Aim for exactly 7 questions that test understanding of the key concepts in this specific chunk (unless chunk is so small)
      - Mix different question types (SAMCQ, MAMCQ, TrueFalse, Matching) for variety
      - Be careful with using FillBlanks, because blanks don't accept synonyms, and people fail
      - Focus on the most important concepts and facts presented in this chunk
      - False answers should not look too obvious
      
      Generate a focused quiz based on the provided text chunk. The quiz should be concise and directly related to the content.
      
      Respond with ONLY a valid JSON object that matches the Quiz interface. 
      DO NOT include any explanations, comments, or markdown formatting in your response.
    `;

    // Construct the user prompt with context about the PDF document
    let userPrompt = '';
    
    if (pdfDocument?.summary) {
      userPrompt = `CONTEXT: This content chunk is part of a larger PDF document.

Document Title: ${pdfDocument.title || pdfDocument.filename || 'Educational Document'}

Document Summary: ${pdfDocument.summary}

CONTENT CHUNK TO CREATE QUIZ FROM:
${chunkText}

Create a quiz with exactly 7 questions based ONLY on the content chunk provided above. The quiz should test understanding of the key concepts presented in this specific section. Use the document context to better understand the subject matter, but focus your questions exclusively on the content chunk.`;
    } else {
      // Fallback if no summary is available
      userPrompt = `CONTEXT: This content chunk is part of a larger educational PDF document.

CONTENT CHUNK TO CREATE QUIZ FROM:
${chunkText}

Create a quiz with exactly 7 questions based ONLY on the content chunk provided above. The quiz should test understanding of the key concepts presented in this specific section.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    let quizData: Quiz;

    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate valid quiz data. Please try again.' },
        { status: 500 }
      );
    }

    // Insert the quiz into Supabase with chunk reference
    const { data, error: insertError } = await supabase
      .from('quizzes')
      .insert([
        {
          quizTitle: quizData.quizTitle,
          description: quizData.description,
          approximateTime: quizData.approximateTime,
          heroIconName: quizData.heroIconName,
          questions: quizData.questions,
          chunk_id: chunkId, // Reference to the chunk
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
      chunkId: chunkId,
    });
  } catch (error) {
    console.error('Error generating chunk quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz from chunk' },
      { status: 500 }
    );
  }
}