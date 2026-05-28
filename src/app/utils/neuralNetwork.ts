import { CodeError, Submission, OOPScores } from '../types';

// Simulated neural network for pattern recognition in Java code
export class NeuralNetworkSimulator {
  private javaPatterns = [
    {
      name: 'Missing access modifier',
      regex: /^[\s]*(class|String|int|double|boolean|void)\s+\w+/m,
      severity: 'warning' as const,
      suggestion: 'Consider adding access modifiers (public/private/protected) to your class members'
    },
    {
      name: 'Not using "this" keyword',
      regex: /(\w+)\s*=\s*(\w+);.*\/\/.*parameter/,
      severity: 'info' as const,
      suggestion: 'Use "this" keyword to distinguish between instance variables and parameters'
    },
    {
      name: 'Missing validation in setter',
      regex: /public\s+void\s+set\w+\([^)]+\)\s*{[^{]*this\.\w+\s*=\s*\w+;[^}]*}/,
      severity: 'warning' as const,
      suggestion: 'Add validation logic in setter methods before assigning values'
    },
    {
      name: 'Public instance variables',
      regex: /public\s+(String|int|double|boolean|float|long)\s+\w+;/,
      severity: 'warning' as const,
      suggestion: 'Make instance variables private and provide getters/setters for encapsulation'
    },
    {
      name: 'Missing constructor',
      regex: /public\s+class\s+\w+\s*{(?![\s\S]*public\s+\w+\s*\()/,
      severity: 'info' as const,
      suggestion: 'Consider adding a constructor to initialize object state'
    },
    {
      name: 'No JavaDoc comments',
      regex: /public\s+(class|void|String|int)\s+(?!\/\*\*)/,
      severity: 'info' as const,
      suggestion: 'Add JavaDoc comments to document your classes and methods'
    },
    {
      name: 'Missing toString() override',
      regex: /public\s+class\s+\w+(?![\s\S]*public\s+String\s+toString)/,
      severity: 'info' as const,
      suggestion: 'Override toString() method to provide meaningful object representation'
    },
    {
      name: 'Hardcoded values',
      regex: /=\s*"[^"]+"|=\s*\d+(?!;)/,
      severity: 'info' as const,
      suggestion: 'Consider using constants or configuration for hardcoded values'
    }
  ];

  analyzeCode(code: string): CodeError[] {
    const errors: CodeError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      this.javaPatterns.forEach(pattern => {
        if (pattern.regex.test(line)) {
          errors.push({
            line: index + 1,
            column: 0,
            message: pattern.suggestion,
            severity: pattern.severity,
            pattern: pattern.name
          });
        }
      });
    });

    return errors;
  }

  evaluateOOPPrinciples(code: string): OOPScores {
    const scores = {
      encapsulation: 50,
      inheritance: 50,
      polymorphism: 50,
      abstraction: 50,
      overall: 50
    };

    // Encapsulation analysis
    const hasPrivateFields = /private\s+(String|int|double|boolean)/.test(code);
    const hasGetters = /public\s+\w+\s+get\w+\(/.test(code);
    const hasSetters = /public\s+void\s+set\w+\(/.test(code);
    const hasPublicFields = /public\s+(String|int|double|boolean)\s+\w+;/.test(code);

    if (hasPrivateFields) scores.encapsulation += 20;
    if (hasGetters) scores.encapsulation += 15;
    if (hasSetters) scores.encapsulation += 15;
    if (hasPublicFields) scores.encapsulation -= 20;

    // Inheritance analysis
    const hasExtends = /extends\s+\w+/.test(code);
    const hasSuper = /super\s*\(/.test(code);
    const hasOverride = /@Override/.test(code);

    if (hasExtends) scores.inheritance += 30;
    if (hasSuper) scores.inheritance += 10;
    if (hasOverride) scores.inheritance += 10;

    // Polymorphism analysis
    const hasOverloading = this.detectMethodOverloading(code);
    const hasOverriding = /@Override/.test(code);

    if (hasOverloading) scores.polymorphism += 25;
    if (hasOverriding) scores.polymorphism += 25;

    // Abstraction analysis
    const hasAbstract = /abstract\s+(class|void|String|int)/.test(code);
    const hasInterface = /implements\s+\w+/.test(code);

    if (hasAbstract) scores.abstraction += 30;
    if (hasInterface) scores.abstraction += 20;

    // Calculate overall
    scores.overall = Math.round(
      (scores.encapsulation + scores.inheritance + scores.polymorphism + scores.abstraction) / 4
    );

    // Cap scores at 100
    Object.keys(scores).forEach(key => {
      scores[key as keyof OOPScores] = Math.min(100, scores[key as keyof OOPScores]);
    });

    return scores;
  }

  private detectMethodOverloading(code: string): boolean {
    const methodPattern = /(\w+)\s*\([^)]*\)/g;
    const methods: { [key: string]: number } = {};
    
    let match;
    while ((match = methodPattern.exec(code)) !== null) {
      const methodName = match[1];
      methods[methodName] = (methods[methodName] || 0) + 1;
    }

    return Object.values(methods).some(count => count > 1);
  }

  generateFeedback(submission: Submission): string {
    const { errors = [], status, oopScores } = submission;
    
    let feedback = '🤖 Neural Network Analysis Complete\n\n';

    // Overall status
    if (status === 'pass') {
      feedback += '✅ Status: Code Compiled Successfully!\n\n';
    } else {
      feedback += '⚠️ Status: Issues Detected\n\n';
    }

    // OOP Principles Evaluation
    if (oopScores) {
      feedback += '📊 OOP Principles Assessment:\n';
      feedback += `• Encapsulation: ${oopScores.encapsulation}/100 ${this.getScoreEmoji(oopScores.encapsulation)}\n`;
      feedback += `• Inheritance: ${oopScores.inheritance}/100 ${this.getScoreEmoji(oopScores.inheritance)}\n`;
      feedback += `• Polymorphism: ${oopScores.polymorphism}/100 ${this.getScoreEmoji(oopScores.polymorphism)}\n`;
      feedback += `• Abstraction: ${oopScores.abstraction}/100 ${this.getScoreEmoji(oopScores.abstraction)}\n`;
      feedback += `• Overall OOP Score: ${oopScores.overall}/100\n\n`;
    }

    // Pattern-based feedback - identify common error patterns
    if (errors.length > 0) {
      // Extract error patterns and remove duplicates
      const errorPatterns = errors.map(error => error.pattern).filter(Boolean);
      const uniquePatterns = [...new Set(errorPatterns)];

      feedback += '🔍 Detected Patterns:\n';
      uniquePatterns.forEach(pattern => {
        feedback += `• ${pattern}\n`;
      });
      feedback += '\n';
    }

    // Personalized recommendations based on detected errors
    feedback += '💡 AI-Powered Recommendations:\n';
    
    // Check for specific error patterns and provide targeted advice
    if (errors.some(error => error.pattern === 'Public instance variables')) {
      feedback += '• Apply encapsulation: Make fields private and add getters/setters\n';
    }
    if (errors.some(error => error.pattern === 'Missing validation in setter')) {
      feedback += '• Add validation logic in setters to ensure data integrity\n';
    }
    if (errors.some(error => error.pattern === 'Not using "this" keyword')) {
      feedback += '• Use "this" keyword to improve code clarity\n';
    }
    if (errors.some(error => error.pattern === 'Missing access modifier')) {
      feedback += '• Specify access modifiers explicitly (public/private/protected)\n';
    }
    if (errors.some(error => error.pattern === 'No JavaDoc comments')) {
      feedback += '• Document your code with JavaDoc comments\n';
    }

    if (oopScores) {
      if (oopScores.encapsulation < 70) {
        feedback += '• Focus on improving encapsulation by hiding implementation details\n';
      }
      if (oopScores.overall >= 80) {
        feedback += '• Excellent OOP implementation! Keep up the good work!\n';
      }
    }

    return feedback;
  }

  private getScoreEmoji(score: number): string {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    return '🔴';
  }

  generateTailoredChallenge(patterns: string[]): string {
    if (patterns.includes('Public instance variables')) {
      return 'Practice: Create an Employee class with private fields and public getters/setters. Include validation in setters.';
    }
    if (patterns.includes('Missing validation in setter')) {
      return 'Practice: Build a BankAccount class with deposit/withdraw methods that validate amounts before processing.';
    }
    if (patterns.includes('Missing constructor')) {
      return 'Practice: Create a Book class with multiple constructors (default and parameterized) demonstrating constructor overloading.';
    }
    return 'Continue to the next module to learn more advanced OOP concepts!';
  }

  /**
   * Predict success probability for code submission
   * Uses error analysis and submission history to predict outcomes
   * @param code - The Java code to analyze
   * @param pastSubmissions - Number of previous submissions
   * @returns Success probability percentage (0-100)
   */
  predictSuccess(code: string, pastSubmissions: number): number {
    // Analyze code for errors and warnings
    const errors = this.analyzeCode(code);
    const criticalErrors = errors.filter(error => error.severity === 'error').length;
    const warnings = errors.filter(error => error.severity === 'warning').length;
    
    const errorWeight = Math.max(0, 100 - (criticalErrors * 20 + warnings * 10));
    const experienceWeight = Math.min(100, 50 + pastSubmissions * 2);
    const codeComplexity = this.analyzeComplexity(code);
    
    return Math.round((errorWeight * 0.5 + experienceWeight * 0.3 + codeComplexity * 0.2));
  }

  private analyzeComplexity(code: string): number {
    let score = 50;
    
    if (code.includes('class')) score += 10;
    if (code.includes('public') || code.includes('private')) score += 10;
    if (code.includes('this')) score += 10;
    if (/\w+\([^)]*\)\s*{/.test(code)) score += 10;
    if (code.split('\n').length > 10) score += 10;
    
    return Math.min(100, score);
  }

  detectCodeSimilarity(code1: string, code2: string): number {
    // Simple similarity detection (in real system, use advanced algorithms)
    const normalize = (str: string) => 
      str.toLowerCase()
         .replace(/\s+/g, '')
         .replace(/\/\/.*/g, '')
         .replace(/\/\*[\s\S]*?\*\//g, '');
    
    const norm1 = normalize(code1);
    const norm2 = normalize(code2);
    
    if (norm1 === norm2) return 100;
    
    let matches = 0;
    const length = Math.min(norm1.length, norm2.length);
    
    for (let i = 0; i < length; i++) {
      if (norm1[i] === norm2[i]) matches++;
    }
    
    return Math.round((matches / Math.max(norm1.length, norm2.length)) * 100);
  }
}

export const neuralNetwork = new NeuralNetworkSimulator();
