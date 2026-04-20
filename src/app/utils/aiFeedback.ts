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

  // Basic code checks
  const hasClass = /class\s+\w+/.test(code);
  const hasMain = /public\s+static\s+void\s+main/.test(code);
  const hasComments = /\/\/|\/\*/.test(code);
  const hasCamelCase = /[a-z]+[A-Z]/.test(code);
  const hasSemicolons = /;/.test(code);
  const hasProperBraces = code.split('{').length === code.split('}').length;
  const hasPackage = /package\s+[\w.]+;/.test(code);
  const hasImports = /import\s+[\w.]+;/.test(code);

  let score = 0;

  // Check for class definition
  if (hasClass) {
    score += 15;
    analysis.strengths.push('✓ Class definition present');
  } else {
    analysis.errors.push('✗ Missing class definition');
  }

  // Check for proper braces
  if (hasProperBraces) {
    score += 10;
    analysis.strengths.push('✓ Balanced braces');
  } else {
    analysis.errors.push('✗ Unbalanced braces - check your code structure');
  }

  // Check for semicolons
  if (hasSemicolons) {
    score += 5;
  } else {
    analysis.warnings.push('⚠ Missing semicolons');
  }

  // Check naming conventions
  if (hasCamelCase) {
    score += 10;
    analysis.strengths.push('✓ Following camelCase naming convention');
  } else {
    analysis.warnings.push('⚠ Consider using camelCase for variable names');
  }

  // Check for comments
  if (hasComments) {
    score += 10;
    analysis.strengths.push('✓ Code documentation present');
  } else {
    analysis.suggestions.push('💡 Add comments to explain your code');
  }

  // Topic-specific analysis
  if (lessonTopic.toLowerCase().includes('encapsulation')) {
    const hasPrivate = /private\s+\w+/.test(code);
    const hasGetters = /get[A-Z]\w+\(/.test(code);
    const hasSetters = /set[A-Z]\w+\(/.test(code);

    if (hasPrivate) {
      score += 15;
      analysis.strengths.push('✓ Using private access modifiers');
      analysis.detectedPatterns.push('Encapsulation: Private fields');
    } else {
      analysis.errors.push('✗ Missing private access modifiers for encapsulation');
    }

    if (hasGetters && hasSetters) {
      score += 15;
      analysis.strengths.push('✓ Getter and setter methods implemented');
      analysis.detectedPatterns.push('Encapsulation: Accessor methods');
    } else {
      analysis.suggestions.push('💡 Implement getter and setter methods');
    }
  }

  if (lessonTopic.toLowerCase().includes('inheritance')) {
    const hasExtends = /extends\s+\w+/.test(code);
    const hasSuper = /super\(/.test(code);
    const hasOverride = /@Override/.test(code);

    if (hasExtends) {
      score += 20;
      analysis.strengths.push('✓ Inheritance implemented with extends');
      analysis.detectedPatterns.push('Inheritance: Class extension');
    } else {
      analysis.errors.push('✗ Missing extends keyword for inheritance');
    }

    if (hasSuper) {
      score += 10;
      analysis.strengths.push('✓ Proper super() constructor call');
    }

    if (hasOverride) {
      score += 10;
      analysis.strengths.push('✓ Using @Override annotation');
      analysis.detectedPatterns.push('Inheritance: Method overriding');
    }
  }

  if (lessonTopic.toLowerCase().includes('polymorphism')) {
    const hasInterface = /interface\s+\w+/.test(code);
    const hasImplements = /implements\s+\w+/.test(code);
    const hasAbstract = /abstract\s+(class|void)/.test(code);
    const hasOverride = /@Override/.test(code);

    if (hasInterface || hasImplements) {
      score += 20;
      analysis.strengths.push('✓ Interface-based polymorphism');
      analysis.detectedPatterns.push('Polymorphism: Interface implementation');
    }

    if (hasAbstract) {
      score += 15;
      analysis.strengths.push('✓ Abstract class/method usage');
      analysis.detectedPatterns.push('Polymorphism: Abstraction');
    }

    if (hasOverride) {
      score += 10;
      analysis.strengths.push('✓ Method overriding for polymorphism');
    }

    if (!hasInterface && !hasImplements && !hasAbstract) {
      analysis.errors.push('✗ Missing polymorphism implementation (interface/abstract)');
    }
  }

  if (lessonTopic.toLowerCase().includes('abstraction')) {
    const hasAbstract = /abstract\s+class/.test(code);
    const hasInterface = /interface\s+\w+/.test(code);

    if (hasAbstract || hasInterface) {
      score += 20;
      analysis.strengths.push('✓ Abstraction properly implemented');
      analysis.detectedPatterns.push('Abstraction: Abstract class/interface');
    } else {
      analysis.errors.push('✗ Missing abstract class or interface');
    }
  }

  // Check for constructors
  const hasConstructor = new RegExp(`class\\s+(\\w+).*?\\1\\s*\\(`).test(code);
  if (hasConstructor) {
    score += 10;
    analysis.strengths.push('✓ Constructor defined');
  }

  // Check for exception handling
  const hasTryCatch = /try\s*\{/.test(code) && /catch\s*\(/.test(code);
  if (hasTryCatch) {
    score += 10;
    analysis.strengths.push('✓ Exception handling implemented');
    analysis.detectedPatterns.push('Exception handling: try-catch blocks');
  }

  // Code quality checks
  const lineCount = code.split('\n').length;
  if (lineCount > 5) {
    score += 5;
  }

  // Ensure score is between 0 and 100
  score = Math.min(100, Math.max(0, score));
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
