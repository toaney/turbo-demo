-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  operation VARCHAR(20) NOT NULL,
  operand1 INTEGER NOT NULL,
  operand2 INTEGER NOT NULL,
  answer INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create question_metrics table to track each time a question appears
CREATE TABLE IF NOT EXISTS question_metrics (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  time_spent_ms INTEGER NOT NULL,
  answered_correctly BOOLEAN,
  was_skipped BOOLEAN DEFAULT FALSE,
  was_revealed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_question_metrics_question_id ON question_metrics(question_id);
CREATE INDEX IF NOT EXISTS idx_question_metrics_session_id ON question_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_operation ON questions(operation);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
