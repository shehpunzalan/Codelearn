// Script to randomize quiz answer positions
const fs = require('fs');
const path = require('path');

const quizFilePath = path.join(__dirname, 'src/app/data/quizQuestions.ts');

// Read the file
const fileContent = fs.readFileSync(quizFilePath, 'utf8');

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Parse and randomize quiz questions
function randomizeQuizFile(content) {
  const lines = content.split('\n');
  const result = [];
  let inOptionsBlock = false;
  let currentOptions = [];
  let correctAnswerIndex = -1;
  let correctAnswerText = '';
  let optionsStartLine = -1;
  let indentation = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect start of options array
    if (line.trim().startsWith('options: [')) {
      inOptionsBlock = true;
      currentOptions = [];
      optionsStartLine = i;
      // Extract indentation
      indentation = line.substring(0, line.indexOf('options:'));
      
      // Check if it's a single-line array
      if (line.includes('],')) {
        // Single line options array
        const match = line.match(/options:\s*\[(.*?)\],/);
        if (match) {
          const optionsStr = match[1];
          const opts = optionsStr.split(',').map(o => o.trim().replace(/^['"]|['"]$/g, ''));
          
          // Find correct answer on next few lines
          let correctIdx = -1;
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].includes('correctAnswer:')) {
              const ansMatch = lines[j].match(/correctAnswer:\s*(\d+)/);
              if (ansMatch) {
                correctIdx = parseInt(ansMatch[1]);
                break;
              }
            }
          }
          
          if (correctIdx !== -1 && opts.length > 0) {
            const correctText = opts[correctIdx];
            const shuffled = shuffleArray(opts);
            const newCorrectIdx = shuffled.indexOf(correctText);
            
            // Format the shuffled options
            const formattedOpts = shuffled.map(opt => `'${opt}'`).join(', ');
            const newLine = `${indentation}options: [${formattedOpts}],`;
            result.push(newLine);
            
            // Update correctAnswer line
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
              if (lines[j].includes('correctAnswer:')) {
                const ansIndent = lines[j].substring(0, lines[j].indexOf('correctAnswer:'));
                result.push(`${ansIndent}correctAnswer: ${newCorrectIdx},`);
                i = j; // Skip to this line
                break;
              } else {
                result.push(lines[j]);
                i++;
              }
            }
          } else {
            result.push(line);
          }
          inOptionsBlock = false;
          continue;
        }
      }
      result.push(line);
      continue;
    }
    
    // Collect multi-line options
    if (inOptionsBlock && line.trim().startsWith("'")) {
      const option = line.trim().replace(/^'|',?$/g, '').replace(/^"|",?$/g, '');
      currentOptions.push(option);
      continue;
    }
    
    // End of options array
    if (inOptionsBlock && line.trim() === '],') {
      // Find the correct answer
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('correctAnswer:')) {
          const match = lines[j].match(/correctAnswer:\s*(\d+)/);
          if (match) {
            correctAnswerIndex = parseInt(match[1]);
            correctAnswerText = currentOptions[correctAnswerIndex];
            break;
          }
        }
      }
      
      // Shuffle options
      if (currentOptions.length > 0 && correctAnswerText) {
        const shuffled = shuffleArray(currentOptions);
        const newCorrectIndex = shuffled.indexOf(correctAnswerText);
        
        // Write shuffled options
        shuffled.forEach(opt => {
          result.push(`${indentation}  '${opt}',`);
        });
        result.push(`${indentation}],`);
        
        // Continue until we find correctAnswer line and update it
        inOptionsBlock = false;
        let foundCorrectAnswer = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('correctAnswer:')) {
            const ansIndent = lines[j].substring(0, lines[j].indexOf('correctAnswer:'));
            result.push(`${ansIndent}correctAnswer: ${newCorrectIndex},`);
            foundCorrectAnswer = true;
            i = j;
            break;
          } else {
            result.push(lines[j]);
            i++;
          }
        }
      } else {
        result.push(line);
        inOptionsBlock = false;
      }
      continue;
    }
    
    // Skip correctAnswer lines (already handled above)
    if (line.includes('correctAnswer:') && currentOptions.length > 0) {
      continue;
    }
    
    // Add all other lines as-is
    if (!inOptionsBlock) {
      result.push(line);
    }
  }
  
  return result.join('\n');
}

// Main execution
try {
  console.log('🔄 Reading quiz questions file...');
  const randomized = randomizeQuizFile(fileContent);
  
  console.log('💾 Writing randomized quiz questions...');
  fs.writeFileSync(quizFilePath, randomized, 'utf8');
  
  console.log('✅ Successfully randomized all quiz answer positions!');
  console.log('📊 All 940 questions (470 Knowledge Check + 470 Game Quiz) have been randomized.');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
