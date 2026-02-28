'use client';

import { useState } from 'react';
import { Operation, Difficulty, GameConfig } from '../types';
import styles from './LandingPage.module.css';

interface LandingPageProps {
  onStart: (config: GameConfig) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [operations, setOperations] = useState<Operation[]>(['addition', 'subtraction', 'multiplication', 'division']);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const toggleOperation = (op: Operation) => {
    setOperations(prev =>
      prev.includes(op)
        ? prev.filter(o => o !== op)
        : [...prev, op]
    );
  };

  const handleStart = () => {
    if (operations.length === 0) {
      alert('Please select at least one operation type');
      return;
    }
    onStart({ operations, timeLimitSeconds, difficulty });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Math Game</h1>
        <p className={styles.subtitle}>Practice your mental math skills!</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Select Operations</h2>
          <div className={styles.operations}>
            {(['addition', 'subtraction', 'multiplication', 'division'] as Operation[]).map(op => (
              <label key={op} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={operations.includes(op)}
                  onChange={() => toggleOperation(op)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Time Limit (seconds)</h2>
          <input
            type="number"
            min="5"
            max="300"
            value={timeLimitSeconds}
            onChange={(e) => setTimeLimitSeconds(parseInt(e.target.value) || 30)}
            className={styles.numberInput}
          />
          <p className={styles.hint}>Default: 30 seconds per question</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Difficulty</h2>
          <div className={styles.radioGroup}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <label key={diff} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="difficulty"
                  value={diff}
                  checked={difficulty === diff}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className={styles.radio}
                />
                <span className={styles.radioText}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className={styles.startButton}
          disabled={operations.length === 0}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
