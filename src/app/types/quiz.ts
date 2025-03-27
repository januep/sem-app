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

export interface Quiz {
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

// The QuizQuestion union type represents all supported question types.
export type QuizQuestion =
  | MAMCQQuestion
  | SAMCQQuestion
  | FillBlanksQuestion
  | TrueFalseQuestion
  | MatchingQuestion;

// BaseQuestion includes fields that all questions share.
interface BaseQuestion {
  // A unique numeric identifier for the question.
  id: number;
  // The question prompt or text.
  prompt: string;
}

// Multiple Answer Multiple Choice question.
// - 'options' contains all possible answer choices.
// - 'correctAnswers' contains the list of correct answer choices.
export interface MAMCQQuestion extends BaseQuestion {
  type: "MAMCQ";
  options: string[];
  correctAnswers: string[];
}

// Single Answer Multiple Choice question.
// - 'options' contains all possible answer choices.
// - 'correctAnswer' is the single correct answer.
export interface SAMCQQuestion extends BaseQuestion {
  type: "SAMCQ";
  options: string[];
  correctAnswer: string;
}

// Fill in the Blanks question.
// - 'blanks' indicates the number of blanks to fill.
// - 'answers' contains the correct answer(s) for the blank(s).
export interface FillBlanksQuestion extends BaseQuestion {
  type: "FillBlanks";
  blanks: number;
  answers: string[];
}

// True/False question.
// - 'correctAnswer' is a boolean indicating if the statement is true or false.
export interface TrueFalseQuestion extends BaseQuestion {
  type: "TrueFalse";
  correctAnswer: boolean;
}

// Matching question consists of pairs of terms and definitions.
// 'MatchingPair' defines a single term-definition pair.
export interface MatchingPair {
  term: string;
  definition: string;
}

// Matching question.
// - 'pairs' is an array of MatchingPair objects.
export interface MatchingQuestion extends BaseQuestion {
  type: "Matching";
  pairs: MatchingPair[];
}