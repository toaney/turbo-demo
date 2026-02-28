import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/connection.js';
import { questionRoutes } from './routes/questions.js';
import { metricsRoutes } from './routes/metrics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/metrics', metricsRoutes);

// Initialize database
async function init() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

init();
