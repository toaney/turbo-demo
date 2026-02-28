import { Router } from 'express';
import { pool } from '../db/connection.js';
import { QuestionGenerator, Question } from '../services/questionGenerator.js';

export const questionRoutes = Router();

// Generate a new question
questionRoutes.post('/generate', async (req, res) => {
  try {
    const { operations, difficulty } = req.body;
    
    if (!operations || !Array.isArray(operations) || operations.length === 0) {
      return res.status(400).json({ error: 'Operations array is required' });
    }
    
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Valid difficulty is required' });
    }
    
    const question = QuestionGenerator.generate(operations, difficulty);
    
    // Save question to database
    const result = await pool.query(
      `INSERT INTO questions (operation, operand1, operand2, answer, difficulty)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [question.operation, question.operand1, question.operand2, question.answer, question.difficulty]
    );
    
    question.id = result.rows[0].id;
    
    res.json(question);
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Get question by ID
questionRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM questions WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const question = result.rows[0];
    const questionText = formatQuestion(
      question.operation,
      question.operand1,
      question.operand2
    );
    
    res.json({ ...question, questionText });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

function formatQuestion(operation: string, operand1: number, operand2: number): string {
  const symbols: Record<string, string> = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  };
  
  return `${operand1} ${symbols[operation]} ${operand2} = ?`;
}
