export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  operations: Operation[];
  timeLimitSeconds: number;
  difficulty: Difficulty;
}

export interface Question {
  id: number;
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  difficulty: Difficulty;
  questionText: string;
}

export interface QuestionState {
  question: Question;
  startTime: number;
  timeSpent: number;
  isRevealed: boolean;
  userAnswer: string;
  isAnswered: boolean;
  wasSkipped: boolean;
}
