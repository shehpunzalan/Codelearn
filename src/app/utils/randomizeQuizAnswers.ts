// Utility to randomize quiz answer positions
// This ensures correct answers are not always in the same position

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

/**
 * Shuffles the options array and updates the correctAnswer index
 * Uses Fisher-Yates shuffle algorithm for true randomization
 */
export function randomizeQuestionOptions(question: QuizQuestion): QuizQuestion {
  const options = [...question.options];
  const correctOptionText = options[question.correctAnswer];
  
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Find new index of correct answer
  const newCorrectAnswer = options.indexOf(correctOptionText);
  
  return {
    ...question,
    options,
    correctAnswer: newCorrectAnswer
  };
}

/**
 * Randomizes options for all questions in a quiz
 */
export function randomizeQuizQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map(q => randomizeQuestionOptions(q));
}

/**
 * Strategically distributes correct answers across positions
 * Ensures roughly equal distribution: 25% each for A, B, C, D
 */
export function strategicRandomize(question: QuizQuestion, targetPosition?: number): QuizQuestion {
  const options = [...question.options];
  const correctOptionText = options[question.correctAnswer];
  
  if (targetPosition !== undefined && targetPosition >= 0 && targetPosition < options.length) {
    // Move correct answer to target position
    const currentIndex = question.correctAnswer;
    if (currentIndex !== targetPosition) {
      [options[currentIndex], options[targetPosition]] = [options[targetPosition], options[currentIndex]];
    }
    
    return {
      ...question,
      options,
      correctAnswer: targetPosition
    };
  }
  
  // Otherwise, do random shuffle
  return randomizeQuestionOptions(question);
}

/**
 * Distributes correct answers evenly across all positions
 * For a set of 10 questions: ~2-3 in each position (A, B, C, D)
 */
export function evenDistribution(questions: QuizQuestion[]): QuizQuestion[] {
  const positions = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1]; // Pattern for 10 questions
  const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
  
  return questions.map((q, index) => {
    const targetPosition = shuffledPositions[index % shuffledPositions.length];
    return strategicRandomize(q, targetPosition);
  });
}
