export interface Quiz {
    quizTitle: string;
    questions: QuizQuestion[];
  }
  
  export type QuizQuestion =
    | MAMCQQuestion
    | SAMCQQuestion
    | FillBlanksQuestion
    | TrueFalseQuestion
    | MatchingQuestion;
  
  interface BaseQuestion {
    id: number;
    prompt: string;
  }
  
  export interface MAMCQQuestion extends BaseQuestion {
    type: "MAMCQ";
    options: string[];
    correctAnswers: string[];
  }
  
  export interface SAMCQQuestion extends BaseQuestion {
    type: "SAMCQ";
    options: string[];
    correctAnswer: string;
  }
  
  export interface FillBlanksQuestion extends BaseQuestion {
    type: "FillBlanks";
    blanks: number;
    answers: string[];
  }
  
  export interface TrueFalseQuestion extends BaseQuestion {
    type: "TrueFalse";
    correctAnswer: boolean;
  }
  
  export interface MatchingPair {
    term: string;
    definition: string;
  }
  
  export interface MatchingQuestion extends BaseQuestion {
    type: "Matching";
    pairs: MatchingPair[];
  }
  