// Quiz PDF Generator - Comprehensive quiz questions from all lessons
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getQuizForLessonWithAutoGen } from '../data/quizQuestions';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { toast } from 'sonner';

export interface ModuleInfo {
  id: string;
  name: string;
  lessons: LessonInfo[];
}

export interface LessonInfo {
  id: string;
  title: string;
  moduleId: string;
  lessonKey: string; // Key for quizDatabase (e.g., "1-1")
  comprehensiveKey: string; // Key for lessonChallenges (e.g., "mod1-lesson1")
}

// Get all modules and lessons structure
function getModulesStructure(): ModuleInfo[] {
  const modules: ModuleInfo[] = [
    {
      id: 'mod1',
      name: 'Module 1: Java Fundamentals',
      lessons: [
        { id: 'lesson1-1', title: 'Introduction to Java Programming', moduleId: 'mod1', lessonKey: '1-1', comprehensiveKey: 'mod1-lesson1' },
        { id: 'lesson1-2', title: 'Variables and Data Types', moduleId: 'mod1', lessonKey: '1-2', comprehensiveKey: 'mod1-lesson2' },
        { id: 'lesson1-3', title: 'Operators in Java', moduleId: 'mod1', lessonKey: '1-3', comprehensiveKey: 'mod1-lesson3' },
        { id: 'lesson1-4', title: 'Control Flow: If-Else Statements', moduleId: 'mod1', lessonKey: '1-4', comprehensiveKey: 'mod1-lesson4' },
        { id: 'lesson1-5', title: 'Loops - For and While', moduleId: 'mod1', lessonKey: '1-5', comprehensiveKey: 'mod1-lesson5' },
      ]
    },
    {
      id: 'mod2',
      name: 'Module 2: Classes and Objects',
      lessons: [
        { id: 'lesson2-1', title: 'Introduction to OOP', moduleId: 'mod2', lessonKey: '2-1', comprehensiveKey: 'mod2-lesson1' },
        { id: 'lesson2-2', title: 'Creating Classes', moduleId: 'mod2', lessonKey: '2-2', comprehensiveKey: 'mod2-lesson2' },
        { id: 'lesson2-3', title: 'Creating and Using Objects', moduleId: 'mod2', lessonKey: '2-3', comprehensiveKey: 'mod2-lesson3' },
        { id: 'lesson2-4', title: 'Constructors', moduleId: 'mod2', lessonKey: '2-4', comprehensiveKey: 'mod2-lesson4' },
        { id: 'lesson2-5', title: 'The "this" Keyword', moduleId: 'mod2', lessonKey: '2-5', comprehensiveKey: 'mod2-lesson5' },
      ]
    },
    {
      id: 'mod3',
      name: 'Module 3: Inheritance',
      lessons: [
        { id: 'lesson3-1', title: 'Introduction to Inheritance', moduleId: 'mod3', lessonKey: '3-1', comprehensiveKey: 'mod3-lesson1' },
        { id: 'lesson3-2', title: 'The super Keyword', moduleId: 'mod3', lessonKey: '3-2', comprehensiveKey: 'mod3-lesson2' },
        { id: 'lesson3-3', title: 'Method Overriding', moduleId: 'mod3', lessonKey: '3-3', comprehensiveKey: 'mod3-lesson3' },
        { id: 'lesson3-4', title: 'Multilevel Inheritance', moduleId: 'mod3', lessonKey: '3-4', comprehensiveKey: 'mod3-lesson4' },
      ]
    },
    {
      id: 'mod4',
      name: 'Module 4: Polymorphism',
      lessons: [
        { id: 'lesson4-1', title: 'Introduction to Polymorphism', moduleId: 'mod4', lessonKey: '4-1', comprehensiveKey: 'mod4-lesson1' },
        { id: 'lesson4-2', title: 'Method Overloading', moduleId: 'mod4', lessonKey: '4-2', comprehensiveKey: 'mod4-lesson2' },
        { id: 'lesson4-3', title: 'Dynamic Method Dispatch', moduleId: 'mod4', lessonKey: '4-3', comprehensiveKey: 'mod4-lesson3' },
        { id: 'lesson4-4', title: 'instanceof Operator', moduleId: 'mod4', lessonKey: '4-4', comprehensiveKey: 'mod4-lesson4' },
        { id: 'lesson4-5', title: 'Upcasting and Downcasting', moduleId: 'mod4', lessonKey: '4-5', comprehensiveKey: 'mod4-lesson5' },
      ]
    },
    {
      id: 'mod5',
      name: 'Module 5: Abstraction',
      lessons: [
        { id: 'lesson5-1', title: 'Abstract Classes', moduleId: 'mod5', lessonKey: '5-1', comprehensiveKey: 'mod5-lesson1' },
        { id: 'lesson5-2', title: 'Abstract Methods', moduleId: 'mod5', lessonKey: '5-2', comprehensiveKey: 'mod5-lesson2' },
        { id: 'lesson5-3', title: 'When to Use Abstraction', moduleId: 'mod5', lessonKey: '5-3', comprehensiveKey: 'mod5-lesson3' },
        { id: 'lesson5-4', title: 'Final Classes and Methods', moduleId: 'mod5', lessonKey: '5-4', comprehensiveKey: 'mod5-lesson4' },
      ]
    },
    {
      id: 'mod6',
      name: 'Module 6: Interfaces',
      lessons: [
        { id: 'lesson6-1', title: 'Introduction to Interfaces', moduleId: 'mod6', lessonKey: '6-1', comprehensiveKey: 'mod6-lesson1' },
        { id: 'lesson6-2', title: 'Implementing Interfaces', moduleId: 'mod6', lessonKey: '6-2', comprehensiveKey: 'mod6-lesson2' },
        { id: 'lesson6-3', title: 'Multiple Inheritance with Interfaces', moduleId: 'mod6', lessonKey: '6-3', comprehensiveKey: 'mod6-lesson3' },
        { id: 'lesson6-4', title: 'Interface vs Abstract Class', moduleId: 'mod6', lessonKey: '6-4', comprehensiveKey: 'mod6-lesson4' },
      ]
    },
    {
      id: 'mod7',
      name: 'Module 7: Encapsulation',
      lessons: [
        { id: 'lesson7-1', title: 'Encapsulation Concepts', moduleId: 'mod7', lessonKey: '7-1', comprehensiveKey: 'mod7-lesson1' },
        { id: 'lesson7-2', title: 'Access Modifiers', moduleId: 'mod7', lessonKey: '7-2', comprehensiveKey: 'mod7-lesson2' },
        { id: 'lesson7-3', title: 'Getters and Setters', moduleId: 'mod7', lessonKey: '7-3', comprehensiveKey: 'mod7-lesson3' },
        { id: 'lesson7-4', title: 'Packages', moduleId: 'mod7', lessonKey: '7-4', comprehensiveKey: 'mod7-lesson4' },
      ]
    },
    {
      id: 'mod8',
      name: 'Module 8: Exception Handling',
      lessons: [
        { id: 'lesson8-1', title: 'Introduction to Exceptions', moduleId: 'mod8', lessonKey: '8-1', comprehensiveKey: 'mod8-lesson1' },
        { id: 'lesson8-2', title: 'Try-Catch Blocks', moduleId: 'mod8', lessonKey: '8-2', comprehensiveKey: 'mod8-lesson2' },
        { id: 'lesson8-3', title: 'Finally Block', moduleId: 'mod8', lessonKey: '8-3', comprehensiveKey: 'mod8-lesson3' },
        { id: 'lesson8-4', title: 'Throw and Throws', moduleId: 'mod8', lessonKey: '8-4', comprehensiveKey: 'mod8-lesson4' },
        { id: 'lesson8-5', title: 'Custom Exceptions', moduleId: 'mod8', lessonKey: '8-5', comprehensiveKey: 'mod8-lesson5' },
      ]
    },
    {
      id: 'mod9',
      name: 'Module 9: Collections Framework',
      lessons: [
        { id: 'lesson9-1', title: 'Introduction to Collections', moduleId: 'mod9', lessonKey: '9-1', comprehensiveKey: 'mod9-lesson1' },
        { id: 'lesson9-2', title: 'ArrayList', moduleId: 'mod9', lessonKey: '9-2', comprehensiveKey: 'mod9-lesson2' },
        { id: 'lesson9-3', title: 'LinkedList', moduleId: 'mod9', lessonKey: '9-3', comprehensiveKey: 'mod9-lesson3' },
        { id: 'lesson9-4', title: 'HashSet', moduleId: 'mod9', lessonKey: '9-4', comprehensiveKey: 'mod9-lesson4' },
        { id: 'lesson9-5', title: 'HashMap', moduleId: 'mod9', lessonKey: '9-5', comprehensiveKey: 'mod9-lesson5' },
      ]
    },
    {
      id: 'mod10',
      name: 'Module 10: File I/O',
      lessons: [
        { id: 'lesson10-1', title: 'File Input/Output Basics', moduleId: 'mod10', lessonKey: '10-1', comprehensiveKey: 'mod10-lesson1' },
        { id: 'lesson10-2', title: 'Working with Files', moduleId: 'mod10', lessonKey: '10-2', comprehensiveKey: 'mod10-lesson2' },
        { id: 'lesson10-3', title: 'Try-with-Resources', moduleId: 'mod10', lessonKey: '10-3', comprehensiveKey: 'mod10-lesson3' },
        { id: 'lesson10-4', title: 'Serialization', moduleId: 'mod10', lessonKey: '10-4', comprehensiveKey: 'mod10-lesson4' },
        { id: 'lesson10-5', title: 'NIO Package', moduleId: 'mod10', lessonKey: '10-5', comprehensiveKey: 'mod10-lesson5' },
      ]
    },
  ];

  return modules;
}

// Generate comprehensive quiz questions PDF
export async function generateAllQuizQuestionsPDF(): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Header styling
    const primaryColor: [number, number, number] = [99, 102, 241]; // Indigo-600
    const accentColor: [number, number, number] = [147, 51, 234]; // Purple-600
    const kcColor: [number, number, number] = [59, 130, 246]; // Blue-600
    const gameColor: [number, number, number] = [234, 88, 12]; // Orange-600

    // Title Page
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CodeLearn AI', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text('CCS108 - Object-Oriented Programming', pageWidth / 2, 38, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Quiz Questions Compendium', pageWidth / 2, 50, { align: 'center' });

    // Course information box
    doc.setFillColor(240, 242, 255);
    doc.roundedRect(margin, 70, pageWidth - 2 * margin, 60, 3, 3, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Course Information', margin + 5, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Institution: University of Cabuyao', margin + 5, 88);
    doc.text('Course Code: CCS108', margin + 5, 94);
    doc.text('Total Modules: 10', margin + 5, 100);
    doc.text('Total Lessons: 47', margin + 5, 106);
    doc.text('Questions per Lesson:', margin + 5, 112);
    doc.text('  • Knowledge Check: 10 questions', margin + 5, 118);
    doc.text('  • Interactive Game Quiz: 10 questions', margin + 5, 124);

    // Document information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, pageWidth / 2, 145, { align: 'center' });

    // Footer
    doc.setFontSize(9);
    doc.text('CodeLearn AI - Pattern Recognition System for Integrated Programming Learning', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Get all modules
    const modules = getModulesStructure();
    let totalKnowledgeCheckQuestions = 0;
    let totalGameQuestions = 0;
    let questionNumber = 1;

    // Process each module
    for (const module of modules) {
      doc.addPage();
      yPosition = margin;

      // Module header
      doc.setFillColor(...primaryColor);
      doc.rect(0, yPosition - 5, pageWidth, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(module.name, margin, yPosition + 5);
      
      yPosition += 20;

      // Process each lesson in the module
      for (const lesson of module.lessons) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Lesson header
        doc.setFillColor(237, 233, 254); // Light purple
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
        
        doc.setTextColor(99, 102, 241);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`Lesson ${lesson.lessonKey}: ${lesson.title}`, margin + 3, yPosition + 8);
        
        yPosition += 18;

        // ===== KNOWLEDGE CHECK QUESTIONS (10 questions) =====
        const challenges = getChallengesForLesson(lesson.comprehensiveKey);
        const kcQuestions = challenges ? challenges.slice(0, 10) : [];
        
        if (kcQuestions.length > 0) {
          // Check if we need a new page
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = margin;
          }

          // Knowledge Check Section Header
          doc.setFillColor(...kcColor);
          doc.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 8, 1, 1, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`📝 KNOWLEDGE CHECK QUESTIONS (${kcQuestions.length} Questions)`, margin + 8, yPosition + 5.5);
          
          yPosition += 12;

          for (const challenge of kcQuestions) {
            // Check if we need a new page
            if (yPosition > pageHeight - 70) {
              doc.addPage();
              yPosition = margin;
            }

            // Question number and text
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            
            const questionText = `Q${questionNumber}. ${challenge.question}`;
            const questionLines = doc.splitTextToSize(questionText, pageWidth - 2 * margin - 10);
            doc.text(questionLines, margin + 5, yPosition);
            yPosition += questionLines.length * 5;

            // Difficulty and type badges
            doc.setFontSize(8);
            const difficultyColor = 
              challenge.difficulty === 'easy' ? [34, 197, 94] : 
              challenge.difficulty === 'medium' ? [251, 146, 60] : 
              [239, 68, 68];
            
            doc.setTextColor(...difficultyColor as [number, number, number]);
            doc.text(`[${challenge.difficulty.toUpperCase()}]`, margin + 7, yPosition);
            
            doc.setTextColor(59, 130, 246);
            doc.text('[KNOWLEDGE CHECK]', margin + 25, yPosition);
            
            doc.setTextColor(100, 100, 100);
            doc.text(`[${challenge.xpReward} XP]`, margin + 58, yPosition);
            
            yPosition += 6;

            // Options
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            
            challenge.options.forEach((option, index) => {
              const prefix = String.fromCharCode(65 + index); // A, B, C, D
              
              if (option.isCorrect) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(34, 197, 94); // Green for correct answer
              } else {
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
              }
              
              const optionText = `${prefix}. ${option.text}`;
              const optionLines = doc.splitTextToSize(optionText, pageWidth - 2 * margin - 15);
              doc.text(optionLines, margin + 10, yPosition);
              yPosition += optionLines.length * 4.5;
            });

            yPosition += 2;

            // Correct answer explanation
            const correctOption = challenge.options.find(opt => opt.isCorrect);
            if (correctOption && correctOption.explanation) {
              doc.setFontSize(8);
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(100, 100, 100);
              
              const explanationLines = doc.splitTextToSize(`💡 ${correctOption.explanation}`, pageWidth - 2 * margin - 15);
              doc.text(explanationLines, margin + 10, yPosition);
              yPosition += explanationLines.length * 4;
            }

            // Separator
            doc.setDrawColor(200, 200, 200);
            doc.line(margin + 5, yPosition + 2, pageWidth - margin - 5, yPosition + 2);
            yPosition += 7;

            totalKnowledgeCheckQuestions++;
            questionNumber++;
          }

          yPosition += 5;
        }

        // ===== INTERACTIVE GAME QUIZ QUESTIONS (10 questions) =====
        const gameQuiz = getQuizForLessonWithAutoGen(lesson.moduleId, lesson.id);
        
        if (gameQuiz && gameQuiz.questions && gameQuiz.questions.length > 0) {
          // Check if we need a new page
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = margin;
          }

          // Interactive Game Section Header
          doc.setFillColor(...gameColor);
          doc.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, 8, 1, 1, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`🎮 INTERACTIVE GAME QUIZ QUESTIONS (${Math.min(gameQuiz.questions.length, 10)} Questions)`, margin + 8, yPosition + 5.5);
          
          yPosition += 12;

          // Use all 10 questions for the game
          const gameQuestions = gameQuiz.questions.slice(0, 10);

          for (const question of gameQuestions) {
            // Check if we need a new page
            if (yPosition > pageHeight - 80) {
              doc.addPage();
              yPosition = margin;
            }

            // Question number and text
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            
            const questionText = `Q${questionNumber}. ${question.question}`;
            const questionLines = doc.splitTextToSize(questionText, pageWidth - 2 * margin - 10);
            doc.text(questionLines, margin + 5, yPosition);
            yPosition += questionLines.length * 5;

            // Difficulty, type, and points badges
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            
            const difficultyColor = 
              question.difficulty === 'easy' ? [34, 197, 94] : 
              question.difficulty === 'medium' ? [251, 146, 60] : 
              [239, 68, 68];
            
            doc.setTextColor(...difficultyColor as [number, number, number]);
            doc.text(`[${question.difficulty.toUpperCase()}]`, margin + 7, yPosition);
            
            doc.setTextColor(234, 88, 12);
            doc.text('[GAME QUIZ]', margin + 25, yPosition);
            
            doc.setTextColor(100, 100, 100);
            doc.text(`[${question.points} points]`, margin + 48, yPosition);
            
            yPosition += 6;

            // Options
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            
            question.options.forEach((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const prefix = String.fromCharCode(65 + index); // A, B, C, D
              
              if (isCorrect) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(34, 197, 94); // Green for correct answer
              } else {
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
              }
              
              const optionText = `${prefix}. ${option}`;
              const optionLines = doc.splitTextToSize(optionText, pageWidth - 2 * margin - 15);
              doc.text(optionLines, margin + 10, yPosition);
              yPosition += optionLines.length * 4.5;
            });

            yPosition += 2;

            // Explanation
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            
            const explanationLines = doc.splitTextToSize(`💡 ${question.explanation}`, pageWidth - 2 * margin - 15);
            doc.text(explanationLines, margin + 10, yPosition);
            yPosition += explanationLines.length * 4;

            // Separator
            doc.setDrawColor(200, 200, 200);
            doc.line(margin + 5, yPosition + 2, pageWidth - margin - 5, yPosition + 2);
            yPosition += 7;

            totalGameQuestions++;
            questionNumber++;
          }

          yPosition += 5;
        }

        yPosition += 5; // Extra space between lessons
      }
    }

    // Summary page
    doc.addPage();
    yPosition = margin;

    doc.setFillColor(...accentColor);
    doc.rect(0, yPosition - 5, pageWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', margin, yPosition + 5);
    
    yPosition += 25;

    // Summary statistics
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 95, 3, 3, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Quiz Compendium Overview', margin + 5, yPosition + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`📚 Total Modules: ${modules.length}`, margin + 5, yPosition + 22);
    doc.text(`📖 Total Lessons: ${modules.reduce((sum, m) => sum + m.lessons.length, 0)}`, margin + 5, yPosition + 32);
    doc.text(`❓ Total Questions: ${totalKnowledgeCheckQuestions + totalGameQuestions}`, margin + 5, yPosition + 42);
    doc.text(`   📝 Knowledge Check Questions: ${totalKnowledgeCheckQuestions}`, margin + 10, yPosition + 52);
    doc.text(`   🎮 Interactive Game Quiz Questions: ${totalGameQuestions}`, margin + 10, yPosition + 62);
    doc.text(`🎯 Passing Score Required: 70%`, margin + 5, yPosition + 72);
    doc.text(`⭐ XP Reward per Lesson: Varies by difficulty`, margin + 5, yPosition + 82);

    // Add page numbers to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

    // Save the PDF
    doc.save('CCS108_Complete_Quiz_Questions_CodeLearnAI.pdf');
    toast.success(`📄 Quiz PDF generated! ${totalKnowledgeCheckQuestions + totalGameQuestions} questions from ${modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
  }
}