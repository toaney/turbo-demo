'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameConfig, Question, QuestionState } from '../types';
import styles from './GamePage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface GamePageProps {
  config: GameConfig;
  onBack: () => void;
}

export default function GamePage({ config, onBack }: GamePageProps) {
  const [questionQueue, setQuestionQueue] = useState<QuestionState[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimitSeconds);
  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const generateQuestion = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/questions/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operations: config.operations,
          difficulty: config.difficulty,
        }),
      });
      const question: Question = await response.json();
      return question;
    } catch (error) {
      console.error('Error generating question:', error);
      return null;
    }
  }, [config]);

  const recordMetric = useCallback(async (
    questionId: number,
    timeSpentMs: number,
    answeredCorrectly: boolean | null,
    wasSkipped: boolean,
    wasRevealed: boolean
  ) => {
    try {
      await fetch(`${API_URL}/api/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          sessionId,
          timeSpentMs,
          answeredCorrectly,
          wasSkipped,
          wasRevealed,
        }),
      });
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  }, [sessionId]);

  const loadNextQuestion = useCallback(async () => {
    if (questionQueue.length > 0) {
      setQuestionQueue(prev => {
        const [next, ...rest] = prev;
        if (!next) return prev;
        setCurrentQuestion(next);
        return rest;
      });
      setIsRevealed(false);
      setTimeRemaining(config.timeLimitSeconds);
      startTimeRef.current = Date.now();
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      return;
    }

    const question = await generateQuestion();
    if (question) {
      const state: QuestionState = {
        question,
        startTime: Date.now(),
        timeSpent: 0,
        isRevealed: false,
        userAnswer: '',
        isAnswered: false,
        wasSkipped: false,
      };
      setCurrentQuestion(state);
      setIsRevealed(false);
      setTimeRemaining(config.timeLimitSeconds);
      startTimeRef.current = Date.now();
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  }, [questionQueue, generateQuestion, config.timeLimitSeconds]);

  useEffect(() => {
    loadNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReveal = useCallback(() => {
    if (!currentQuestion || isRevealed) return;
    setIsRevealed(true);
    const timeSpent = Date.now() - startTimeRef.current;
    recordMetric(
      currentQuestion.question.id,
      timeSpent,
      null,
      false,
      true
    );
  }, [currentQuestion, isRevealed, recordMetric]);

  useEffect(() => {
    if (!currentQuestion || isRevealed) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleReveal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, isRevealed, handleReveal]);

  const handleSkip = useCallback(() => {
    if (!currentQuestion) return;
    const timeSpent = Date.now() - startTimeRef.current;
    recordMetric(
      currentQuestion.question.id,
      timeSpent,
      null,
      true,
      false
    );
    
    // Add skipped question back to queue
    const skippedState: QuestionState = {
      ...currentQuestion,
      wasSkipped: true,
    };
    setQuestionQueue(prev => [...prev, skippedState]);
    
    loadNextQuestion();
  }, [currentQuestion, recordMetric, loadNextQuestion]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || isRevealed || !inputRef.current) return;
    
    const userAnswer = parseInt(inputRef.current.value);
    if (isNaN(userAnswer)) return;
    
    const isCorrect = userAnswer === currentQuestion.question.answer;
    const timeSpent = Date.now() - startTimeRef.current;
    
    recordMetric(
      currentQuestion.question.id,
      timeSpent,
      isCorrect,
      false,
      false
    );
    
    setIsRevealed(true);
    setCurrentQuestion(prev => prev ? {
      ...prev,
      userAnswer: inputRef.current!.value,
      isAnswered: true,
    } : null);
  }, [currentQuestion, isRevealed, recordMetric]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleSkip();
    }
  }, [handleSubmit, handleSkip]);

  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading question...</div>
      </div>
    );
  }

  const isCorrect = currentQuestion.isAnswered && 
    parseInt(currentQuestion.userAnswer) === currentQuestion.question.answer;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Settings
        </button>
        <div className={styles.timer}>
          Time: {timeRemaining}s
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.question}>
          <h1 className={styles.questionText}>
            {currentQuestion.question.questionText}
          </h1>
        </div>

        {isRevealed && (
          <div className={styles.answer}>
            <div className={styles.answerText}>
              Answer: <strong>{currentQuestion.question.answer}</strong>
            </div>
            {currentQuestion.isAnswered && (
              <div className={isCorrect ? styles.correct : styles.incorrect}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
            )}
          </div>
        )}

        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="number"
            placeholder="Enter your answer"
            className={styles.answerInput}
            onKeyDown={handleKeyDown}
            disabled={isRevealed}
            autoFocus
          />
          <div className={styles.buttonGroup}>
            <button
              onClick={handleReveal}
              disabled={isRevealed}
              className={styles.button}
            >
              Reveal Answer
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRevealed}
              className={styles.button}
            >
              Submit (Enter)
            </button>
            <button
              onClick={handleSkip}
              className={styles.button}
            >
              Skip (Tab/→)
            </button>
            <button
              onClick={loadNextQuestion}
              disabled={!isRevealed}
              className={styles.button}
            >
              Next Question
            </button>
          </div>
        </div>

        {questionQueue.length > 0 && (
          <div className={styles.queueInfo}>
            {questionQueue.length} question{questionQueue.length !== 1 ? 's' : ''} in queue
          </div>
        )}
      </div>
    </div>
  );
}
