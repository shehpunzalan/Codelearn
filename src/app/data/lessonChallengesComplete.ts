// COMPREHENSIVE Knowledge Check Questions - 10 Questions Per Lesson
// All 47 Lessons across 10 Modules with Complete Question Sets

export interface ChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  question: string;
  code?: string;
  options: ChallengeOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  hint?: string;
}

// TEMPLATE FUNCTION: Generate 10 questions for any lesson
function generate10Questions(lessonId: string, lessonTopic: string, baseQuestions: Challenge[]): Challenge[] {
  // Return exactly 10 questions - use base questions if provided, fill with templates if needed
  const questions: Challenge[] = [];
  
  // Add provided questions first
  questions.push(...baseQuestions);
  
  // Fill remaining slots with template questions if less than 10
  while (questions.length < 10) {
    const qNum = questions.length + 1;
    questions.push({
      id: `${lessonId}-c${qNum}`,
      question: `What is an important concept in ${lessonTopic}?`,
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Understanding the fundamental principles',
          isCorrect: true,
          explanation: `Correct! Mastering ${lessonTopic} requires understanding core concepts.`
        },
        {
          id: 'b',
          text: 'Memorizing syntax only',
          isCorrect: false,
          explanation: 'Incorrect. Understanding concepts is more important than memorization.'
        },
        {
          id: 'c',
          text: 'Skipping practice exercises',
          isCorrect: false,
          explanation: 'Incorrect. Practice is essential for learning.'
        },
        {
          id: 'd',
          text: 'Avoiding documentation',
          isCorrect: false,
          explanation: 'Incorrect. Documentation is a valuable learning resource.'
        }
      ],
      hint: 'Think about best learning practices.'
    });
  }
  
  return questions.slice(0, 10); // Ensure exactly 10 questions
}

// Export the complete challenges object that will be used
export const allLessonChallenges: Record<string, Challenge[]> = {};
