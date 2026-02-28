import { Router } from 'express';
import { pool } from '../db/connection.js';

export const metricsRoutes = Router();

// Record a question metric
metricsRoutes.post('/', async (req, res) => {
  try {
    const {
      questionId,
      sessionId,
      timeSpentMs,
      answeredCorrectly,
      wasSkipped,
      wasRevealed,
    } = req.body;
    
    if (!questionId || timeSpentMs === undefined) {
      return res.status(400).json({ error: 'questionId and timeSpentMs are required' });
    }
    
    const result = await pool.query(
      `INSERT INTO question_metrics 
       (question_id, session_id, time_spent_ms, answered_correctly, was_skipped, was_revealed)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [questionId, sessionId || null, timeSpentMs, answeredCorrectly ?? null, wasSkipped || false, wasRevealed || false]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error recording metric:', error);
    res.status(500).json({ error: 'Failed to record metric' });
  }
});

// Get metrics for a question
metricsRoutes.get('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_appearances,
        COUNT(CASE WHEN answered_correctly = true THEN 1 END) as correct_count,
        COUNT(CASE WHEN answered_correctly = false THEN 1 END) as incorrect_count,
        COUNT(CASE WHEN was_skipped = true THEN 1 END) as skipped_count,
        COUNT(CASE WHEN was_revealed = true THEN 1 END) as revealed_count,
        AVG(time_spent_ms) as avg_time_spent_ms
       FROM question_metrics
       WHERE question_id = $1`,
      [questionId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get all metrics summary
metricsRoutes.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT question_id) as total_questions,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN answered_correctly = true THEN 1 END) as total_correct,
        COUNT(CASE WHEN answered_correctly = false THEN 1 END) as total_incorrect,
        COUNT(CASE WHEN was_skipped = true THEN 1 END) as total_skipped,
        AVG(time_spent_ms) as avg_time_spent_ms
       FROM question_metrics`
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});
