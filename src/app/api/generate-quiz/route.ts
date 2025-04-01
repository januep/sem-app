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
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
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
      
      Generate a quiz based on the user's prompt. Respond with ONLY a valid JSON object that matches the Quiz interface. 
      DO NOT include any explanations, comments, or markdown formatting in your response.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
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
      console.error(_error)
      return NextResponse.json(
        { error: 'Failed to generate valid quiz data. Please try again.' },
        { status: 500 }
      );
    }

    // Insert into Supabase and get ID back
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
