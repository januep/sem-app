// models/learning-module.ts
export type LearningModule = {
    id: string;
    title: string;
    description: string;
    source: {
      type: 'pdf' | 'existing';
      documentId?: string;
      documentName?: string;
    };
    content: {
      sections: Section[];
      summary: string;
      keyTerms: { term: string; definition: string }[];
    };
    activities: Activity[];
    createdAt: string;
    updatedAt: string;
  };
  
  export type Section = {
    id: string;
    title: string;
    content: string;
    importance: 1 | 2 | 3; // 1 = essential, 2 = important, 3 = supplementary
  };
  
  export type Activity = {
    id: string;
    type: 'flashcard' | 'quiz' | 'memory' | 'fillblank' | 'dragdrop';
    title: string;
    instructions: string;
    //todo
    // content: FlashcardSet | Quiz | MemoryGame | FillBlankExercise | DragDropExercise;
  };
  
  // Additional types for each activity type
  export type FlashcardSet = {
    cards: Array<{
      front: string;
      back: string;
    }>;
  };
  
  export type Quiz = {
    questions: Array<{
      question: string;
      type: 'multiple-choice' | 'true-false' | 'matching';
      options?: string[];
      correctAnswer: string | number | Array<[string, string]>;
      explanation?: string;
    }>;
  };
  
  // Additional types for other activity types...