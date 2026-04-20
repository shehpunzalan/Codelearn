// Audio lecture data for all lessons
// Actual audio files uploaded for comprehensive lesson coverage

export const lessonAudioData: Record<string, {
  audioUrl: string;
  duration: number; // in seconds
  transcript: string;
}> = {
  // Module 1: Java Fundamentals
  'mod1-lesson1-1': {
    audioUrl: '/src/imports/Introduction_to_Java_Audio_(1).mp3',
    duration: 0, // Will be determined when audio loads
    transcript: `Welcome to Introduction to Java Programming. 

Java is a powerful, versatile, and widely-used programming language that has shaped the world of software development since its creation in 1995 by Sun Microsystems. Today, Java runs on billions of devices worldwide, from smartphones and tablets to enterprise servers and embedded systems.

What makes Java special? First, Java is platform-independent, meaning you can write your code once and run it anywhere. This is made possible by the Java Virtual Machine, or JVM, which acts as an intermediary between your code and the underlying operating system. When you compile Java code, it's converted into bytecode that can run on any system with a JVM installed.

Java is an object-oriented programming language, which means it organizes code around objects and data rather than actions and logic. This approach makes code more modular, reusable, and easier to maintain. You'll learn about classes, objects, inheritance, polymorphism, and encapsulation as you progress through this course.

One of Java's greatest strengths is its rich ecosystem. The Java Development Kit, or JDK, provides all the tools you need to write, compile, and run Java programs. The Java Standard Library includes thousands of pre-built classes for common tasks like file handling, networking, and data structures, saving you countless hours of development time.

Java is also known for its robustness and security features. The language includes built-in memory management through garbage collection, strong type checking at compile-time, and exception handling mechanisms that help you write more reliable code.

In the professional world, Java powers some of the largest applications and systems. Major companies like Google, Netflix, Amazon, and LinkedIn rely on Java for their backend services. Android, the world's most popular mobile operating system, uses Java as one of its primary development languages.

As you begin your Java journey, you'll start with the basics: understanding syntax, variables, data types, and control structures. From there, you'll progress to object-oriented concepts, exception handling, collections, and file operations. Each lesson builds upon the previous one, gradually developing your skills and confidence.

Remember, learning to program takes practice and patience. Don't be discouraged if concepts don't click immediately. Programming is a skill that improves with repetition and hands-on experience. Make sure to practice the code examples, complete the exercises, and experiment on your own.

Thank you for choosing CodeLearn AI for your Java programming education. Let's begin this exciting journey into the world of Java development!`
  },
  
  // For now, other lessons will use text-to-speech synthesis
  // Each lesson will generate audio on-the-fly using the Web Speech API
};

// Function to generate speech from text
export function synthesizeSpeech(text: string, onEnd?: () => void): void {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for educational content
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a high-quality voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

// Generate audio lecture text from lesson content
export function generateAudioLectureText(lessonContent: any): string {
  let text = `Welcome to ${lessonContent.title || 'this lesson'}. `;
  
  if (lessonContent.introduction) {
    text += lessonContent.introduction + ' ';
  }
  
  if (lessonContent.keyConcepts && lessonContent.keyConcepts.length > 0) {
    text += 'The key concepts we will cover are: ';
    lessonContent.keyConcepts.forEach((concept: string, idx: number) => {
      text += `Concept ${idx + 1}: ${concept}. `;
    });
  }
  
  text += 'Thank you for learning with CodeLearn AI. Practice these concepts to master object-oriented programming in Java.';
  
  return text;
}