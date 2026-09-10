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

// Validate brace closure for each class/interface in a multi-class program.
const detectClassStructureErrors = (code: string): string[] => {
  const issues: string[] = [];

  const classPattern = /(?:(?:public|private|protected|abstract|final|static)\s+)*(?:class|interface|enum|record)\s+(\w+)/g;
  let match = classPattern.exec(code);
  while (match !== null) {
    const className = match[1];
    const keyword = (match[0].match(/\b(class|interface|enum|record)\b/) || ['class'])[0];
    const lineNum = code.slice(0, match.index).split('\n').length;
    const openIdx = code.indexOf('{', match.index + match[0].length);
    if (openIdx === -1) {
      issues.push(`Line ${lineNum}: ${keyword} "${className}" is missing its opening brace {`);
    } else {
      let depth = 1;
      let pos = openIdx + 1;
      let closed = false;
      while (pos < code.length && depth > 0) {
        if (code[pos] === '{') depth++;
        else if (code[pos] === '}') { depth--; if (depth === 0) { closed = true; break; } }
        pos++;
      }
      if (!closed) {
        issues.push(`Line ${lineNum}: ${keyword} "${className}" is missing its closing brace }`);
      }
    }
    match = classPattern.exec(code);
  }

  return issues;
};

// Detect semantic errors: assignment used as boolean condition (= vs ==),
// String compared with == instead of .equals(), division by literal zero.
const detectSemanticErrors = (code: string): string[] => {
  const lines = code.split('\n');
  const issues: string[] = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!inBlockComment && (trimmed.startsWith('/*') || trimmed.startsWith('/**'))) inBlockComment = true;
    if (inBlockComment) { if (trimmed.includes('*/')) inBlockComment = false; continue; }
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('@')) continue;

    const stripped = trimmed.replace(/\/\/.*$/, '').trim();
    const ln = i + 1;
    const preview = stripped.length > 65 ? stripped.slice(0, 65) + '…' : stripped;

    // Assignment inside boolean condition: if (x = 10) / while (x = y)
    const condMatch = stripped.match(/^(?:if|while)\s*\((.+)\)\s*(?:\{|$)/);
    if (condMatch) {
      const cond = condMatch[1];
      // Lone = not preceded/followed by =, !, <, >, +, -, *, /, &, |
      if (/(?<![=!<>+\-*\/&|])=(?!=)/.test(cond)) {
        issues.push(
          `Line ${ln}: Semantic error — assignment operator (=) used inside boolean condition; ` +
          `did you mean equality (==)? → "${preview}"`
        );
      }
      // String compared with == or !=
      if (/(?:"[^"]*"\s*(?:==|!=)|(?:==|!=)\s*"[^"]*")/.test(cond)) {
        issues.push(
          `Line ${ln}: Semantic error — String compared with == or != (compares references, not values); ` +
          `use .equals() instead → "${preview}"`
        );
      }
    }

    // String == comparison outside explicit condition (e.g. boolean b = a == "foo")
    if (!condMatch && /(?:"[^"]*"\s*==|==\s*"[^"]*")/.test(stripped) && !/\.equals\(/.test(stripped)) {
      issues.push(
        `Line ${ln}: Semantic error — String compared with == instead of .equals() → "${preview}"`
      );
    }

    // Division by literal zero: expr / 0 (not in a comment, not 0.0 or 0L)
    if (/[^/]\/\s*0(?![.\dLlFf])/.test(stripped)) {
      issues.push(
        `Line ${ln}: Semantic error — division by literal zero (/ 0) will throw ArithmeticException at runtime → "${preview}"`
      );
    }
  }

  return issues;
};

// Detect logical errors: off-by-one in array iteration (i <= array.length),
// and unreachable code immediately after return / throw in the same scope.
const detectLogicalErrors = (code: string): string[] => {
  const lines = code.split('\n');
  const issues: string[] = [];
  let inBlockComment = false;
  let braceDepth = 0;
  let returnedOrThrown = false;
  let returnedDepth = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!inBlockComment && (trimmed.startsWith('/*') || trimmed.startsWith('/**'))) inBlockComment = true;
    if (inBlockComment) { if (trimmed.includes('*/')) inBlockComment = false; continue; }
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('@')) continue;

    const stripped = trimmed.replace(/\/\/.*$/, '').trim();
    const ln = i + 1;
    const preview = stripped.length > 70 ? stripped.slice(0, 70) + '…' : stripped;

    const opens = (stripped.match(/\{/g) || []).length;
    const closes = (stripped.match(/\}/g) || []).length;

    // Off-by-one: for (int i = 0; i <= someArray.length; i++) — last valid index is length-1
    if (/\bfor\s*\(/.test(stripped)) {
      const forMatch = stripped.match(/for\s*\([^;]*;([^;]+);/);
      if (forMatch) {
        const cond = forMatch[1].trim();
        // <= identifier.length  but NOT <= identifier.length - 1
        if (/<=\s*[\w.[\]]+\.length\b(?!\s*-\s*1)/.test(cond)) {
          issues.push(
            `Line ${ln}: Logical error — off-by-one: loop condition uses <= array.length, ` +
            `but arrays are 0-indexed so the last valid index is array.length - 1. ` +
            `Change <= to < to avoid ArrayIndexOutOfBoundsException → "${preview}"`
          );
        }
      }
    }

    // Unreachable code: statement in same scope right after return/throw
    if (returnedOrThrown && braceDepth === returnedDepth &&
        stripped !== '}' && !stripped.startsWith('}') &&
        !/^(else|catch|finally)\b/.test(stripped)) {
      issues.push(
        `Line ${ln}: Logical error — unreachable code after return/throw statement; ` +
        `this line will never execute → "${preview}"`
      );
      returnedOrThrown = false;
    }

    if (/^(return|throw)\b/.test(stripped)) {
      returnedOrThrown = true;
      returnedDepth = braceDepth;
    } else if (opens > 0) {
      returnedOrThrown = false;
    }

    braceDepth += opens - closes;
    if (braceDepth < returnedDepth) { returnedOrThrown = false; returnedDepth = -1; }
  }

  return issues;
};

// Detect missing semicolons line-by-line with conservative heuristics.
// Skips declarations, control flow, annotations, and comments.
const detectMissingSemicolons = (code: string): string[] => {
  const lines = code.split('\n');
  const issues: string[] = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!inBlockComment && (trimmed.startsWith('/*') || trimmed.startsWith('/**'))) inBlockComment = true;
    if (inBlockComment) { if (trimmed.includes('*/')) inBlockComment = false; continue; }

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('@')) continue;

    const stripped = trimmed.replace(/\/\/.*$/, '').trim();
    if (!stripped) continue;

    const last = stripped[stripped.length - 1];
    if (last === ';' || last === '{' || last === '}' || last === ',') continue;

    if (/^(public\s+|private\s+|protected\s+|abstract\s+|final\s+|static\s+)*(class|interface|enum|record)\s+/.test(stripped)) continue;
    if (/^(if|else|for|while|do|switch|try|catch|finally)\b/.test(stripped)) continue;
    if (/^(public|private|protected|static|abstract|final|synchronized|native|default|\w+)\s+[\w<>\[\]]+\s+\w+\s*\(/.test(stripped) && !stripped.includes('=')) continue;

    const isStatement =
      /^(int|long|double|float|char|boolean|byte|short|String|var|Integer|Long|Double|Float|Boolean)\s+\w+/.test(stripped) ||
      /^\w[\w<>\[\]]*\s+\w+\s*=/.test(stripped) ||
      /^\w[\w.]*\s*[\+\-\*\/&|^]?=(?!=)/.test(stripped) ||
      /^\w[\w.]*\s*\(/.test(stripped) ||
      /^(return|throw|break|continue)\b/.test(stripped) ||
      /^(import|package)\s+/.test(stripped);

    if (isStatement) {
      issues.push(`Line ${i + 1}: Missing semicolon → "${stripped.length > 55 ? stripped.slice(0, 55) + '…' : stripped}"`);
    }
  }

  return issues;
};

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

  // Parenthesis check
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    score -= 6;
    analysis.errors.push(`✗ Unmatched parentheses — ${openParens} opening ( but ${closeParens} closing )`);
  }

  if (hasSemicolons) {
    score += 3;
    analysis.strengths.push('✓ Statements properly terminated');
  }

  // Missing semicolon check
  const semiErrors = detectMissingSemicolons(code);
  if (semiErrors.length > 0) {
    score -= Math.min(10, semiErrors.length * 3);
    semiErrors.forEach(msg => analysis.errors.push(`✗ ${msg}`));
  }

  // Semantic error check (= vs ==, String ==, / 0)
  const semanticErrors = detectSemanticErrors(code);
  if (semanticErrors.length > 0) {
    score -= Math.min(15, semanticErrors.length * 5);
    semanticErrors.forEach(msg => analysis.errors.push(`✗ ${msg}`));
  } else if (code.trim().length > 30) {
    analysis.strengths.push('✓ No semantic errors detected (correct operator usage)');
  }

  // Logical error check (off-by-one, unreachable code)
  const logicalErrors = detectLogicalErrors(code);
  if (logicalErrors.length > 0) {
    score -= Math.min(15, logicalErrors.length * 5);
    logicalErrors.forEach(msg => analysis.errors.push(`✗ ${msg}`));
  } else if (/\b(for|while)\b/.test(code)) {
    analysis.strengths.push('✓ No off-by-one or unreachable-code errors detected');
  }

  // Class structure analysis (especially for multi-class programs)
  const classStructureErrors = detectClassStructureErrors(code);
  if (classStructureErrors.length > 0) {
    score -= Math.min(20, classStructureErrors.length * 7);
    classStructureErrors.forEach(msg => analysis.errors.push(`✗ ${msg}`));
  } else {
    const classCount = (code.match(/\bclass\s+\w+/g) || []).length;
    if (classCount > 1) {
      analysis.strengths.push(`✓ ${classCount} classes all properly structured`);
    }
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

  if (!code.trim()) {
    errors.push('Error: Empty code submission');
    return { success: false, output: 'Compilation failed. Please fix the errors and try again.', errors };
  }

  // Structural checks
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Syntax Error: Mismatched braces — ${openBraces} opening { but ${closeBraces} closing }`);
  }

  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Syntax Error: Mismatched parentheses — ${openParens} opening ( but ${closeParens} closing )`);
  }

  if (!/class\s+\w+/.test(code)) {
    errors.push('Error: No class definition found — every Java program needs at least one class');
  }

  // Semicolon check
  const semiIssues = detectMissingSemicolons(code);
  semiIssues.forEach(msg => errors.push(`Syntax Error: ${msg}`));

  // Semantic errors
  const semanticIssues = detectSemanticErrors(code);
  semanticIssues.forEach(msg => errors.push(`Semantic Error: ${msg}`));

  // Logical errors
  const logicalIssues = detectLogicalErrors(code);
  logicalIssues.forEach(msg => errors.push(`Logical Error: ${msg}`));

  if (errors.length > 0) {
    return { success: false, output: 'Analysis found issues in your code. Please review and fix the errors above.', errors };
  }

  return {
    success: true,
    output: '✓ Code analysis passed!\n\nNo syntax, semantic, or logical errors detected. Good job!',
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
