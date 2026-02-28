type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id?: number;
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  difficulty: Difficulty;
  questionText: string;
}

export class QuestionGenerator {
  static generate(
    operations: Operation[],
    difficulty: Difficulty
  ): Question {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let operand1: number, operand2: number, answer: number;
    
    switch (operation) {
      case 'addition':
        ({ operand1, operand2, answer } = this.generateAddition(difficulty));
        break;
      case 'subtraction':
        ({ operand1, operand2, answer } = this.generateSubtraction(difficulty));
        break;
      case 'multiplication':
        ({ operand1, operand2, answer } = this.generateMultiplication(difficulty));
        break;
      case 'division':
        ({ operand1, operand2, answer } = this.generateDivision(difficulty));
        break;
    }
    
    const questionText = this.formatQuestion(operation, operand1, operand2);
    
    return {
      operation,
      operand1,
      operand2,
      answer,
      difficulty,
      questionText,
    };
  }
  
  private static generateAddition(difficulty: Difficulty) {
    let min: number, max: number;
    
    switch (difficulty) {
      case 'easy':
        min = 11;
        max = 50;
        break;
      case 'medium':
        min = 50;
        max = 200;
        break;
      case 'hard':
        min = 200;
        max = 1000;
        break;
    }
    
    const operand1 = this.randomInt(min, max);
    const operand2 = this.randomInt(min, max);
    const answer = operand1 + operand2;
    
    return { operand1, operand2, answer };
  }
  
  private static generateSubtraction(difficulty: Difficulty) {
    let min: number, max: number;
    
    switch (difficulty) {
      case 'easy':
        min = 11;
        max = 50;
        break;
      case 'medium':
        min = 50;
        max = 200;
        break;
      case 'hard':
        min = 200;
        max = 1000;
        break;
    }
    
    const operand1 = this.randomInt(min, max);
    const operand2 = this.randomInt(min, operand1); // Ensure positive result
    const answer = operand1 - operand2;
    
    return { operand1, operand2, answer };
  }
  
  private static generateMultiplication(difficulty: Difficulty) {
    let tables: number[];
    let multiplierRange: [number, number];
    
    switch (difficulty) {
      case 'easy':
        tables = [6, 7, 8];
        multiplierRange = [1, 12];
        break;
      case 'medium':
        tables = [6, 7, 8, 11, 12];
        multiplierRange = [1, 15];
        break;
      case 'hard':
        tables = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        multiplierRange = [1, 20];
        break;
    }
    
    const operand1 = tables[Math.floor(Math.random() * tables.length)];
    const operand2 = this.randomInt(multiplierRange[0], multiplierRange[1]);
    const answer = operand1 * operand2;
    
    return { operand1, operand2, answer };
  }
  
  private static generateDivision(difficulty: Difficulty) {
    let tables: number[];
    let multiplierRange: [number, number];
    
    switch (difficulty) {
      case 'easy':
        tables = [6, 7, 8];
        multiplierRange = [1, 12];
        break;
      case 'medium':
        tables = [6, 7, 8, 11, 12];
        multiplierRange = [1, 15];
        break;
      case 'hard':
        tables = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        multiplierRange = [1, 20];
        break;
    }
    
    const operand1 = tables[Math.floor(Math.random() * tables.length)];
    const operand2 = this.randomInt(multiplierRange[0], multiplierRange[1]);
    const answer = operand1;
    const dividend = operand1 * operand2;
    
    return { operand1: dividend, operand2: operand1, answer: operand2 };
  }
  
  private static formatQuestion(
    operation: Operation,
    operand1: number,
    operand2: number
  ): string {
    const symbols: Record<Operation, string> = {
      addition: '+',
      subtraction: '-',
      multiplication: '×',
      division: '÷',
    };
    
    return `${operand1} ${symbols[operation]} ${operand2} = ?`;
  }
  
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
