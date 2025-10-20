
export enum QuestionType {
  ShortAnswer = 'short_answer',
  MultipleChoice = 'multiple_choice',
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Question {
  id: string;
  category_id: string;
  type: QuestionType;
  question_text: string;
  image_url?: string | null;
  correct_answer: string;
  options?: string[]; // For multiple choice
  created_at: string;
}

export interface LearningLog {
    id: string;
    user_id: string; // for simplicity, we'll use a constant user id
    question_id: string;
    is_correct: boolean;
    answered_at: string;
}

export interface QuizAnswer {
    questionId: string;
    answer: string;
    isCorrect: boolean;
}

export interface QuizResult {
    score: number;
    total: number;
    answers: QuizAnswer[];
}

// Supabase generated types (simplified for this example)
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Category>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at'>;
        Update: Partial<Question>;
      };
      learning_log: {
        Row: LearningLog;
        Insert: Omit<LearningLog, 'id' | 'answered_at'>;
        Update: Partial<LearningLog>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}