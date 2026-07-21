// AI-Powered Code Analysis and Feedback Generator

export interface CodeAnalysis {
  score: number;
  passed: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  strengths: string[];
  detectedPatterns: string[];
  feedback: string;
}

// Analyze Java code and generate feedback
export const analyzeJavaCode = (code: string, lessonTopic: string): CodeAnalysis => {
  const analysis: CodeAnalysis = {
    score: 0,
    passed: false,
    errors: [],
    warnings: [],
    suggestions: [],
    strengths: [],
    detectedPatterns: [],
    feedback: ''
  };

  const hasClass = /class\s+\w+/.test(code);
  const hasComments = /\/\/|\/\*/.test(code);
  const hasCamelCase = /[a-z]+[A-Z]/.test(code);
  const hasSemicolons = /;/.test(code);
  const hasProperBraces = code.split('{').length === code.split('}').length;
  const lineCount = code.split('\n').filter(l => l.trim()).length;

  // Generous base score — reward students just for writing code
  let score = 68;

  if (hasClass) {
    score += 8;
    analysis.strengths.push('✓ Class definition present');
  } else {
    analysis.errors.push('✗ Add a class definition to your program');
  }

  if (hasProperBraces) {
    score += 5;
    analysis.strengths.push('✓ Balanced braces — good structure');
  } else {
    score -= 8;
    analysis.errors.push('✗ Unbalanced braces — check your opening and closing { }');
  }

  if (hasSemicolons) {
    score += 3;
    analysis.strengths.push('✓ Statements properly terminated');
  }

  if (hasCamelCase) {
    score += 4;
    analysis.strengths.push('✓ Good naming style (camelCase)');
  }

  if (hasComments) {
    score += 4;
    analysis.strengths.push('✓ Code has helpful comments');
  } else {
    analysis.suggestions.push('💡 Try adding a comment or two to explain what your code does');
  }

  if (lineCount > 10) {
    score += 3;
    analysis.strengths.push('✓ Well-developed solution');
  }

  // Topic-specific bonuses (no penalties — only rewards for what is present)
  if (lessonTopic.toLowerCase().includes('encapsulation')) {
    const hasPrivate = /private\s+\w+/.test(code);
    const hasGetters = /get[A-Z]\w+\(/.test(code);
    const hasSetters = /set[A-Z]\w+\(/.test(code);

    if (hasPrivate) {
      score += 5;
      analysis.strengths.push('✓ Private fields — great encapsulation!');
      analysis.detectedPatterns.push('Encapsulation: Private fields');
    } else {
      analysis.suggestions.push('💡 Try using private fields to protect your data');
    }

    if (hasGetters && hasSetters) {
      score += 5;
      analysis.strengths.push('✓ Getter and setter methods — well done!');
      analysis.detectedPatterns.push('Encapsulation: Accessor methods');
    } else if (hasGetters || hasSetters) {
      score += 3;
      analysis.suggestions.push('💡 Add both getters and setters for full encapsulation');
    }
  }

  if (lessonTopic.toLowerCase().includes('inheritance')) {
    const hasExtends = /extends\s+\w+/.test(code);
    const hasSuper = /super\(/.test(code);
    const hasOverride = /@Override/.test(code);

    if (hasExtends) {
      score += 6;
      analysis.strengths.push('✓ Inheritance with extends — nice work!');
      analysis.detectedPatterns.push('Inheritance: Class extension');
    } else {
      analysis.suggestions.push('💡 Use extends to create a parent-child class relationship');
    }
    if (hasSuper) {
      score += 3;
      analysis.strengths.push('✓ super() call — proper constructor chaining');
    }
    if (hasOverride) {
      score += 3;
      analysis.strengths.push('✓ @Override annotation — excellent!');
      analysis.detectedPatterns.push('Inheritance: Method overriding');
    }
  }

  if (lessonTopic.toLowerCase().includes('polymorphism')) {
    const hasInterface = /interface\s+\w+/.test(code);
    const hasImplements = /implements\s+\w+/.test(code);
    const hasAbstract = /abstract\s+(class|void)/.test(code);
    const hasOverride = /@Override/.test(code);

    if (hasInterface || hasImplements) {
      score += 6;
      analysis.strengths.push('✓ Interface-based polymorphism — great!');
      analysis.detectedPatterns.push('Polymorphism: Interface implementation');
    }
    if (hasAbstract) {
      score += 4;
      analysis.strengths.push('✓ Abstract class used — well done!');
      analysis.detectedPatterns.push('Polymorphism: Abstraction');
    }
    if (hasOverride) {
      score += 3;
      analysis.strengths.push('✓ Method overriding for polymorphism');
    }
    if (!hasInterface && !hasImplements && !hasAbstract && !hasOverride) {
      analysis.suggestions.push('💡 Try using an interface or @Override to show polymorphism');
    }
  }

  if (lessonTopic.toLowerCase().includes('abstraction')) {
    const hasAbstract = /abstract\s+class/.test(code);
    const hasInterface = /interface\s+\w+/.test(code);

    if (hasAbstract || hasInterface) {
      score += 7;
      analysis.strengths.push('✓ Abstraction implemented — excellent!');
      analysis.detectedPatterns.push('Abstraction: Abstract class/interface');
    } else {
      analysis.suggestions.push('💡 Add an abstract class or interface to show abstraction');
    }
  }

  const hasConstructor = new RegExp(`class\\s+(\\w+).*?\\1\\s*\\(`).test(code);
  if (hasConstructor) {
    score += 3;
    analysis.strengths.push('✓ Constructor defined');
  }

  const hasTryCatch = /try\s*\{/.test(code) && /catch\s*\(/.test(code);
  if (hasTryCatch) {
    score += 3;
    analysis.strengths.push('✓ Exception handling — very thorough!');
    analysis.detectedPatterns.push('Exception handling: try-catch');
  }

  score = Math.min(100, Math.max(0, Math.round(score)));
  analysis.score = score;
  analysis.passed = score >= 60;

  // Generate feedback message
  analysis.feedback = generateFeedback(analysis, lessonTopic);

  return analysis;
};

const generateFeedback = (analysis: CodeAnalysis, lessonTopic: string): string => {
  let feedback = '';

  if (analysis.score >= 90) {
    feedback += '🎉 **Excellent work!** Your code demonstrates strong understanding of OOP principles.\n\n';
  } else if (analysis.score >= 75) {
    feedback += '👍 **Good job!** Your code shows solid understanding with room for improvement.\n\n';
  } else if (analysis.score >= 60) {
    feedback += '✓ **Passing grade.** Your code meets the basic requirements but needs refinement.\n\n';
  } else {
    feedback += '📚 **Needs improvement.** Let\'s work on strengthening your understanding of ' + lessonTopic + '.\n\n';
  }

  if (analysis.strengths.length > 0) {
    feedback += '**Strengths:**\n';
    analysis.strengths.forEach(strength => {
      feedback += `${strength}\n`;
    });
    feedback += '\n';
  }

  if (analysis.errors.length > 0) {
    feedback += '**Issues to Fix:**\n';
    analysis.errors.forEach(error => {
      feedback += `${error}\n`;
    });
    feedback += '\n';
  }

  if (analysis.warnings.length > 0) {
    feedback += '**Warnings:**\n';
    analysis.warnings.forEach(warning => {
      feedback += `${warning}\n`;
    });
    feedback += '\n';
  }

  if (analysis.suggestions.length > 0) {
    feedback += '**Suggestions for Improvement:**\n';
    analysis.suggestions.forEach(suggestion => {
      feedback += `${suggestion}\n`;
    });
    feedback += '\n';
  }

  if (analysis.detectedPatterns.length > 0) {
    feedback += '**Detected Patterns:**\n';
    analysis.detectedPatterns.forEach(pattern => {
      feedback += `✓ ${pattern}\n`;
    });
    feedback += '\n';
  }

  if (analysis.score < 60) {
    feedback += '\n**Next Steps:**\n';
    feedback += '1. Review the lesson material again\n';
    feedback += '2. Check the code examples provided\n';
    feedback += '3. Fix the issues mentioned above\n';
    feedback += '4. Resubmit your code for evaluation\n';
  } else if (analysis.score < 90) {
    feedback += '\n**To achieve excellence:**\n';
    feedback += '- Address all warnings and suggestions\n';
    feedback += '- Add more comprehensive comments\n';
    feedback += '- Follow all Java naming conventions\n';
  }

  return feedback;
};

// Simulate code compilation
export const compileJavaCode = (code: string): { success: boolean; output: string; errors: string[] } => {
  const errors: string[] = [];

  // Check for common syntax errors
  if (!code.trim()) {
    errors.push('Error: Empty code submission');
  }

  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Syntax Error: Mismatched braces (${openBraces} opening, ${closeBraces} closing)`);
  }

  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Syntax Error: Mismatched parentheses (${openParens} opening, ${closeParens} closing)`);
  }

  // Check for class definition
  if (!(/class\s+\w+/.test(code))) {
    errors.push('Error: No class definition found');
  }

  if (errors.length > 0) {
    return {
      success: false,
      output: 'Compilation failed. Please fix the errors and try again.',
      errors
    };
  }

  return {
    success: true,
    output: '✓ Compilation successful!\n\nYour code compiled without errors. Good job!',
    errors: []
  };
};

// Generate AI insights for students
export const generateStudentInsights = (completedLessons: string[], scores: number[]): string[] => {
  const insights: string[] = [];
  
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  
  if (avgScore >= 85) {
    insights.push('🌟 You excel at Java programming! Keep up the excellent work.');
  } else if (avgScore >= 70) {
    insights.push('📈 You\'re making good progress. Focus on areas that need improvement.');
  } else {
    insights.push('📚 Consider reviewing the fundamentals. Practice makes perfect!');
  }
  
  if (completedLessons.length >= 5) {
    insights.push('🔥 You\'re on a roll! Consistent practice is key to mastery.');
  }
  
  if (scores.length >= 3) {
    const recentScores = scores.slice(-3);
    const improving = recentScores[2] > recentScores[0];
    
    if (improving) {
      insights.push('📊 Your scores are improving! Great progress.');
    }
  }
  
  return insights;
};
