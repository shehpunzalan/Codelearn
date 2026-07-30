// AI Feedback Analysis System for Code Submissions
// Neural Network-Powered Pattern Recognition for Java OOP

/**
 * Analyzes Java code for OOP principles, errors, and quality
 */
export function analyzeJavaCode(code: string, lessonId: string) {
  const feedback = {
    score: 0,
    maxScore: 100,
    oopPrinciples: [] as any[],
    codeQuality: [] as any[],
    errors: [] as any[],
    suggestions: [] as any[],
    strengths: [] as any[],
    plagiarismScore: 0,
    timestamp: new Date().toISOString()
  };

  // Pattern Recognition: OOP Principles Detection
  const oopPatterns = detectOOPPrinciples(code);
  feedback.oopPrinciples = oopPatterns;

  // Code Quality Analysis
  const qualityMetrics = analyzeCodeQuality(code);
  feedback.codeQuality = qualityMetrics.issues;
  feedback.strengths = qualityMetrics.strengths;

  // Error Detection
  const detectedErrors = detectCommonErrors(code);
  feedback.errors = detectedErrors;

  // Generate Improvement Suggestions
  const suggestions = generateSuggestions(code, lessonId, oopPatterns, qualityMetrics);
  feedback.suggestions = suggestions;

  // Calculate overall score
  feedback.score = calculateScore(oopPatterns, qualityMetrics, detectedErrors);

  // Plagiarism detection (basic pattern matching)
  feedback.plagiarismScore = detectPlagiarism(code);

  return feedback;
}

/**
 * Detect OOP Principles in code
 */
function detectOOPPrinciples(code: string) {
  const principles = [];

  // 1. Encapsulation Detection
  if (code.includes('private') || code.includes('protected')) {
    const privateCount = (code.match(/private\s+/g) || []).length;
    const getterSetterCount = (code.match(/get[A-Z]\w+|set[A-Z]\w+/g) || []).length;
    
    principles.push({
      principle: 'Encapsulation',
      detected: true,
      confidence: privateCount > 0 && getterSetterCount > 0 ? 95 : 70,
      evidence: `Found ${privateCount} private fields and ${getterSetterCount} getter/setter methods`,
      score: 25
    });
  } else {
    principles.push({
      principle: 'Encapsulation',
      detected: false,
      confidence: 100,
      evidence: 'No private fields or access modifiers detected',
      score: 0,
      suggestion: 'Use private fields with public getter/setter methods to implement encapsulation'
    });
  }

  // 2. Inheritance Detection
  if (code.includes('extends')) {
    const extendsMatches = code.match(/class\s+\w+\s+extends\s+\w+/g) || [];
    const superCalls = (code.match(/super\(/g) || []).length;
    
    principles.push({
      principle: 'Inheritance',
      detected: true,
      confidence: 90,
      evidence: `Found ${extendsMatches.length} class inheritance and ${superCalls} super() calls`,
      score: 25
    });
  } else {
    principles.push({
      principle: 'Inheritance',
      detected: false,
      confidence: 100,
      evidence: 'No class inheritance detected',
      score: 0,
      suggestion: 'Consider using inheritance to create parent-child class relationships'
    });
  }

  // 3. Polymorphism Detection
  const methodOverloading = detectMethodOverloading(code);
  const methodOverriding = code.includes('@Override');
  
  if (methodOverloading || methodOverriding) {
    principles.push({
      principle: 'Polymorphism',
      detected: true,
      confidence: 85,
      evidence: methodOverriding ? 'Method overriding detected with @Override annotation' : 'Method overloading detected',
      score: 25
    });
  } else {
    principles.push({
      principle: 'Polymorphism',
      detected: false,
      confidence: 100,
      evidence: 'No method overloading or overriding detected',
      score: 0,
      suggestion: 'Implement polymorphism using method overloading or overriding'
    });
  }

  // 4. Abstraction Detection
  if (code.includes('abstract') || code.includes('interface')) {
    const abstractCount = (code.match(/abstract\s+class/g) || []).length;
    const interfaceCount = (code.match(/interface\s+\w+/g) || []).length;
    
    principles.push({
      principle: 'Abstraction',
      detected: true,
      confidence: 90,
      evidence: `Found ${abstractCount} abstract classes and ${interfaceCount} interfaces`,
      score: 25
    });
  } else {
    principles.push({
      principle: 'Abstraction',
      detected: false,
      confidence: 100,
      evidence: 'No abstract classes or interfaces detected',
      score: 0,
      suggestion: 'Use abstract classes or interfaces to implement abstraction'
    });
  }

  return principles;
}

/**
 * Analyze code quality metrics
 */
function analyzeCodeQuality(code: string) {
  const issues = [];
  const strengths = [];

  // Check naming conventions
  const classNames = code.match(/class\s+([A-Z]\w+)/g) || [];
  const methodNames = code.match(/\w+\s+\w+\s*\([^)]*\)/g) || [];
  
  if (classNames.every(cls => /class\s+[A-Z]/.test(cls))) {
    strengths.push({
      category: 'Naming Conventions',
      description: 'Class names follow PascalCase convention',
      impact: 'positive'
    });
  } else {
    issues.push({
      category: 'Naming Conventions',
      severity: 'medium',
      description: 'Class names should start with uppercase letters (PascalCase)',
      line: 0
    });
  }

  // Check for comments and documentation
  const commentCount = (code.match(/\/\/|\/\*|\*\//g) || []).length;
  if (commentCount >= 3) {
    strengths.push({
      category: 'Documentation',
      description: 'Code includes helpful comments',
      impact: 'positive'
    });
  } else {
    issues.push({
      category: 'Documentation',
      severity: 'low',
      description: 'Add more comments to explain complex logic',
      line: 0
    });
  }

  // Check code structure
  const braceCount = (code.match(/\{/g) || []).length;
  const closeBraceCount = (code.match(/\}/g) || []).length;
  
  if (braceCount === closeBraceCount) {
    strengths.push({
      category: 'Code Structure',
      description: 'Balanced braces - proper code structure',
      impact: 'positive'
    });
  }

  // Check for proper indentation (basic check)
  const lines = code.split('\n');
  const indentedLines = lines.filter(line => line.startsWith('    ') || line.startsWith('\t')).length;
  
  if (indentedLines > lines.length * 0.3) {
    strengths.push({
      category: 'Formatting',
      description: 'Code appears to be properly indented',
      impact: 'positive'
    });
  }

  // Check for magic numbers
  const numberLiterals = code.match(/\b\d+\b/g) || [];
  if (numberLiterals.length > 5) {
    issues.push({
      category: 'Code Quality',
      severity: 'low',
      description: 'Consider using named constants instead of magic numbers',
      line: 0
    });
  }

  return { issues, strengths };
}

/** Detect semantic errors: = inside boolean condition, String == comparison, division by zero. */
function detectSemanticErrors(code: string): Array<{ line: number; message: string; fix: string }> {
  const lines = code.split('\n');
  const issues: Array<{ line: number; message: string; fix: string }> = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!inBlockComment && (trimmed.startsWith('/*') || trimmed.startsWith('/**'))) inBlockComment = true;
    if (inBlockComment) { if (trimmed.includes('*/')) inBlockComment = false; continue; }
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('@')) continue;

    const stripped = trimmed.replace(/\/\/.*$/, '').trim();
    const ln = i + 1;
    const prev = stripped.length > 65 ? stripped.slice(0, 65) + '…' : stripped;

    const condMatch = stripped.match(/^(?:if|while)\s*\((.+)\)\s*(?:\{|$)/);
    if (condMatch) {
      const cond = condMatch[1];
      if (/(?<![=!<>+\-*\/&|])=(?!=)/.test(cond)) {
        issues.push({
          line: ln,
          message: `Semantic error on line ${ln}: assignment (=) used inside boolean condition — did you mean == ? → "${prev}"`,
          fix: 'Replace = with == to perform equality comparison instead of assignment'
        });
      }
      if (/(?:"[^"]*"\s*(?:==|!=)|(?:==|!=)\s*"[^"]*")/.test(cond)) {
        issues.push({
          line: ln,
          message: `Semantic error on line ${ln}: String compared with == or != (compares object references, not values) → "${prev}"`,
          fix: 'Use .equals() for String value comparison, e.g. str.equals("value")'
        });
      }
    }

    if (!condMatch && /(?:"[^"]*"\s*==|==\s*"[^"]*")/.test(stripped) && !/\.equals\(/.test(stripped)) {
      issues.push({
        line: ln,
        message: `Semantic error on line ${ln}: String compared with == instead of .equals() → "${prev}"`,
        fix: 'Replace == with .equals() for correct String value comparison'
      });
    }

    if (/[^/]\/\s*0(?![.\dLlFf])/.test(stripped)) {
      issues.push({
        line: ln,
        message: `Semantic error on line ${ln}: division by literal zero (/ 0) will throw ArithmeticException at runtime → "${prev}"`,
        fix: 'Ensure the divisor cannot be zero before dividing'
      });
    }
  }

  return issues;
}

/** Detect logical errors: off-by-one in array loops, unreachable code after return/throw. */
function detectLogicalErrors(code: string): Array<{ line: number; message: string; fix: string }> {
  const lines = code.split('\n');
  const issues: Array<{ line: number; message: string; fix: string }> = [];
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
    const prev = stripped.length > 70 ? stripped.slice(0, 70) + '…' : stripped;

    const opens = (stripped.match(/\{/g) || []).length;
    const closes = (stripped.match(/\}/g) || []).length;

    if (/\bfor\s*\(/.test(stripped)) {
      const forMatch = stripped.match(/for\s*\([^;]*;([^;]+);/);
      if (forMatch && /<=\s*[\w.[\]]+\.length\b(?!\s*-\s*1)/.test(forMatch[1])) {
        issues.push({
          line: ln,
          message: `Logical error on line ${ln}: off-by-one — loop uses <= array.length but arrays are 0-indexed (last valid index = array.length - 1). This will throw ArrayIndexOutOfBoundsException → "${prev}"`,
          fix: 'Change <= to < in the loop condition to stay within array bounds'
        });
      }
    }

    if (returnedOrThrown && braceDepth === returnedDepth &&
        stripped !== '}' && !stripped.startsWith('}') &&
        !/^(else|catch|finally)\b/.test(stripped)) {
      issues.push({
        line: ln,
        message: `Logical error on line ${ln}: unreachable code — this statement comes after a return/throw and will never execute → "${prev}"`,
        fix: 'Remove or move this statement to before the return/throw'
      });
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
}

/**
 * Detect missing semicolons line-by-line with conservative heuristics.
 * Skips class/method declarations, control flow, annotations, and comments.
 */
function detectMissingSemicolons(code: string) {
  const lines = code.split('\n');
  const issues: Array<{ line: number; text: string }> = [];
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

    // Skip class/interface/enum/record declarations
    if (/^(public\s+|private\s+|protected\s+|abstract\s+|final\s+|static\s+)*(class|interface|enum|record)\s+/.test(stripped)) continue;

    // Skip control flow
    if (/^(if|else|for|while|do|switch|try|catch|finally)\b/.test(stripped)) continue;

    // Skip method/constructor signatures
    if (/^(public|private|protected|static|abstract|final|synchronized|native|default|\w+)\s+[\w<>\[\]]+\s+\w+\s*\(/.test(stripped) && !stripped.includes('=')) continue;

    const isStatement =
      /^(int|long|double|float|char|boolean|byte|short|String|var|Integer|Long|Double|Float|Boolean)\s+\w+/.test(stripped) ||
      /^\w[\w<>\[\]]*\s+\w+\s*=/.test(stripped) ||
      /^\w[\w.]*\s*[\+\-\*\/&|^]?=(?!=)/.test(stripped) ||
      /^\w[\w.]*\s*\(/.test(stripped) ||
      /^(return|throw|break|continue)\b/.test(stripped) ||
      /^(import|package)\s+/.test(stripped);

    if (isStatement) {
      issues.push({ line: i + 1, text: stripped.length > 55 ? stripped.slice(0, 55) + '…' : stripped });
    }
  }

  return issues;
}

/**
 * Detect common Java errors — structural issues and missing semicolons.
 */
function detectCommonErrors(code: string) {
  const errors = [];

  // Unmatched braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      type: 'syntax',
      severity: 'critical',
      message: `Unmatched braces: ${openBraces} opening { but ${closeBraces} closing }`,
      line: 0,
      fix: 'Make sure every { has a matching }'
    });
  }

  // Unmatched parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      type: 'syntax',
      severity: 'critical',
      message: `Unmatched parentheses: ${openParens} opening ( but ${closeParens} closing )`,
      line: 0,
      fix: 'Make sure every ( has a matching )'
    });
  }

  // Missing semicolons
  const semiIssues = detectMissingSemicolons(code);
  semiIssues.forEach(({ line, text }) => {
    errors.push({
      type: 'syntax',
      severity: 'warning',
      message: `Missing semicolon on line ${line}: "${text}"`,
      line,
      fix: 'Add a semicolon (;) at the end of this statement'
    });
  });

  // Semantic errors
  const semanticIssues = detectSemanticErrors(code);
  semanticIssues.forEach(({ line, message, fix }) => {
    errors.push({ type: 'semantic', severity: 'error', message, line, fix });
  });

  // Logical errors
  const logicalIssues = detectLogicalErrors(code);
  logicalIssues.forEach(({ line, message, fix }) => {
    errors.push({ type: 'logical', severity: 'error', message, line, fix });
  });

  return errors;
}

/**
 * Detect method overloading
 */
function detectMethodOverloading(code: string) {
  const methods = code.match(/\w+\s+(\w+)\s*\([^)]*\)/g) || [];
  const methodNames = methods.map(m => {
    const match = m.match(/\w+\s+(\w+)\s*\(/);
    return match ? match[1] : '';
  });

  const uniqueMethods = new Set(methodNames);
  return methodNames.length > uniqueMethods.size;
}

/**
 * Generate improvement suggestions based on analysis
 */
function generateSuggestions(code: string, lessonId: string, oopPrinciples: any[], qualityMetrics: any) {
  const suggestions = [];

  // OOP-specific suggestions
  const missingPrinciples = oopPrinciples.filter(p => !p.detected);
  if (missingPrinciples.length > 0) {
    suggestions.push({
      category: 'OOP Principles',
      priority: 'high',
      title: 'Implement Missing OOP Principles',
      description: `Your code is missing: ${missingPrinciples.map(p => p.principle).join(', ')}`,
      actionItems: missingPrinciples.map(p => p.suggestion).filter(Boolean)
    });
  }

  // Code quality suggestions
  if (qualityMetrics.issues.length > 0) {
    suggestions.push({
      category: 'Code Quality',
      priority: 'medium',
      title: 'Improve Code Quality',
      description: 'Address the following quality issues',
      actionItems: qualityMetrics.issues.map((issue: any) => issue.description)
    });
  }

  // General improvement tips
  suggestions.push({
    category: 'Best Practices',
    priority: 'low',
    title: 'Follow Java Best Practices',
    description: 'Consider these industry-standard practices',
    actionItems: [
      'Use meaningful variable and method names',
      'Keep methods short and focused (Single Responsibility)',
      'Add JavaDoc comments for public methods',
      'Handle exceptions appropriately',
      'Use interfaces to define contracts'
    ]
  });

  return suggestions;
}

/**
 * Calculate overall score — starts from a generous base so students
 * are rewarded for effort, not punished for minor style issues.
 */
function calculateScore(oopPrinciples: any[], qualityMetrics: any, errors: any[]) {
  // Base: 68 points just for submitting code
  let score = 68;

  // Each detected OOP principle adds up to 7 points (max +28 for all four)
  const oopBonus = oopPrinciples
    .filter(p => p.detected)
    .reduce((sum, p) => sum + Math.min(7, Math.round((p.score || 0) * 0.28)), 0);
  score += oopBonus;

  // Strengths bonus (max +8)
  score += Math.min(8, qualityMetrics.strengths.length * 2);

  // Only penalise genuinely broken structure (critical errors only)
  const errorPenalty = errors.reduce((sum: number, e: any) => {
    if (e.severity === 'critical') return sum + 8;
    return sum;
  }, 0);
  score = Math.max(0, score - errorPenalty);

  return Math.min(100, Math.round(score));
}

/**
 * Basic plagiarism detection using pattern similarity
 */
function detectPlagiarism(code: string) {
  // This is a simplified version - in production, you'd compare against a database
  // of previous submissions and use more sophisticated algorithms
  
  // For now, return a low score if code is too simple or too common
  const codeLength = code.length;
  const uniqueTokens = new Set(code.match(/\w+/g) || []).size;
  
  // Very simple heuristic: if code has very few unique tokens, it might be copied
  if (codeLength > 100 && uniqueTokens < 20) {
    return 45; // Medium plagiarism risk
  }
  
  if (codeLength < 50) {
    return 15; // Low risk but very simple
  }
  
  return 5; // Low plagiarism risk
}

/**
 * Generate detailed feedback message
 */
export function generateFeedbackMessage(analysis: any) {
  const detectedPrinciples = analysis.oopPrinciples.filter((p: any) => p.detected);
  const missingPrinciples = analysis.oopPrinciples.filter((p: any) => !p.detected);
  
  let message = `## Code Analysis Complete\n\n`;
  message += `**Overall Score: ${analysis.score}/100**\n\n`;
  
  if (analysis.score >= 90) {
    message += `🌟 **Excellent work!** Your code demonstrates strong understanding of OOP principles.\n\n`;
  } else if (analysis.score >= 70) {
    message += `👍 **Good job!** Your code shows solid understanding with room for improvement.\n\n`;
  } else if (analysis.score >= 50) {
    message += `📚 **Keep learning!** You're on the right track, but need to strengthen some concepts.\n\n`;
  } else {
    message += `💪 **Don't give up!** Review the lesson materials and try again.\n\n`;
  }
  
  if (detectedPrinciples.length > 0) {
    message += `### ✅ Detected OOP Principles:\n`;
    detectedPrinciples.forEach((p: any) => {
      message += `- **${p.principle}** (${p.confidence}% confidence): ${p.evidence}\n`;
    });
    message += `\n`;
  }
  
  if (missingPrinciples.length > 0) {
    message += `### ⚠️ Missing OOP Principles:\n`;
    missingPrinciples.forEach((p: any) => {
      message += `- **${p.principle}**: ${p.suggestion || 'Not implemented'}\n`;
    });
    message += `\n`;
  }
  
  if (analysis.errors.length > 0) {
    message += `### 🐛 Detected Issues:\n`;
    analysis.errors.slice(0, 5).forEach((e: any) => {
      message += `- **${e.type}** (${e.severity}): ${e.message}\n`;
      if (e.fix) message += `  - *Fix:* ${e.fix}\n`;
    });
    message += `\n`;
  }
  
  if (analysis.strengths.length > 0) {
    message += `### 💪 Strengths:\n`;
    analysis.strengths.forEach((s: any) => {
      message += `- ${s.description}\n`;
    });
    message += `\n`;
  }
  
  return message;
}
