import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Headphones, Play, Pause, Volume2, VolumeX, 
  Download, BookOpen, Clock, SkipForward, SkipBack, Settings 
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { 
  synthesizeSpeech, 
  stopSpeech, 
  pauseSpeech, 
  resumeSpeech,
  generateAudioLectureText,
  lessonAudioData 
} from '../data/lessonAudioData';
import { toast } from 'sonner';

interface AudioLecturePageProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onBack: () => void;
}

interface TranscriptSegment {
  timestamp: string;
  text: string;
}

export function AudioLecturePage({ 
  moduleId, 
  lessonId, 
  lessonTitle,
  lessonContent,
  onBack 
}: AudioLecturePageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get lesson-specific audio data
  const audioData = lessonAudioData[lessonId];
  const hasAudioFile = audioData && audioData.audioUrl;

  // Generate transcript segments from lesson content or use stored transcript
  const generateTranscript = (): TranscriptSegment[] => {
    // If we have a stored transcript, parse it into segments
    if (hasAudioFile && audioData.transcript) {
      // Split transcript into paragraphs and filter out empty ones
      const paragraphs = audioData.transcript.split('\n\n').filter(paragraph => paragraph.trim());
      return paragraphs.map((text, index) => ({
        timestamp: formatTimestamp(index * 30),
        text: text.trim()
      }));
    }

    // Otherwise, generate from lesson content
    const segments: TranscriptSegment[] = [];
    let timeOffset = 0;

    // Introduction segment
    if (lessonContent.introduction) {
      segments.push({
        timestamp: formatTimestamp(timeOffset),
        text: `Welcome to ${lessonTitle}. ${lessonContent.introduction}`
      });
      timeOffset += 30;
    }

    // Key concepts segments
    if (lessonContent.keyConcepts && lessonContent.keyConcepts.length > 0) {
      segments.push({
        timestamp: formatTimestamp(timeOffset),
        text: "Let's start by understanding the key principles and why they're important in modern software development. This concept is crucial for writing maintainable and scalable code."
      });
      timeOffset += 30;

      lessonContent.keyConcepts.forEach((concept: string, idx: number) => {
        segments.push({
          timestamp: formatTimestamp(timeOffset),
          text: `We'll walk through several real-world examples to demonstrate how these concepts are used in production applications. Pay close attention to the code structure and design patterns.`
        });
        timeOffset += 30;
      });
    }

    // Practical implementation
    segments.push({
      timestamp: formatTimestamp(timeOffset),
      text: "Now let's see some practical implementations. Notice how we're applying the principles we discussed earlier to solve common programming challenges."
    });

    return segments;
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
  };

  const transcriptSegments = generateTranscript();

  const handlePlayPause = () => {
    if (hasAudioFile && audioRef.current) {
      // Use HTML5 audio for actual audio files
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        toast.success('Playing audio lecture');
      }
    } else {
      // Use text-to-speech for lessons without audio files
      if (isPlaying) {
        pauseSpeech();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        const lectureText = generateAudioLectureText(lessonContent);
        synthesizeSpeech(lectureText, () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast.success('Audio lecture completed!');
        });
        setIsPlaying(true);
        
        // Simulate progress
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 1;
            if (newTime >= 180) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              return 180;
            }
            return newTime;
          });
        }, 1000);
      }
    }
  };

  const handleStop = () => {
    if (hasAudioFile && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      stopSpeech();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleSkipForward = () => {
    if (hasAudioFile && audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    } else {
      setCurrentTime(prev => Math.min(prev + 10, duration));
    }
  };

  const handleSkipBackward = () => {
    if (hasAudioFile && audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    } else {
      setCurrentTime(prev => Math.max(prev - 10, 0));
    }
  };

  const toggleMute = () => {
    if (hasAudioFile && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
      if (!isMuted) {
        pauseSpeech();
      } else {
        resumeSpeech();
      }
    }
  };

  const handleDownloadNotes = () => {
    const notesContent = transcriptSegments
      .map(segment => `${segment.timestamp} ${segment.text}`)
      .join('\n\n');
    
    const blob = new Blob([notesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle.replace(/\s+/g, '_')}_audio_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Audio notes downloaded!');
  };

  useEffect(() => {
    // Initialize audio element for lessons with MP3 files
    if (hasAudioFile && audioData.audioUrl) {
      const audio = new Audio(audioData.audioUrl);
      audioRef.current = audio;

      // Update duration when metadata loads
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      // Update current time as audio plays
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      // Handle audio end
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        toast.success('Audio lecture completed!');
      });

      // Handle errors
      audio.addEventListener('error', () => {
        toast.error('Error loading audio file');
        console.error('Audio loading error');
      });

      return () => {
        audio.pause();
        audio.remove();
      };
    } else {
      // Default duration for text-to-speech
      setDuration(180);
    }
    
    return () => {
      stopSpeech();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [lessonId, hasAudioFile, audioData]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lesson
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Audio Lecture
              </h1>
              <p className="text-gray-600 mt-1">{lessonTitle}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <Headphones className="w-3 h-3 mr-1" />
            Enhanced Learning
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Audio Player (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player Card */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                {/* Audio Icon */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Headphones className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Audio Lecture</h2>
                  <p className="text-gray-600 text-center">{lessonTitle}</p>
                </div>

                {/* Play Button */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={handlePlayPause}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-6 h-6 mr-2" />
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-2" />
                        Play Audio
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkipBackward}
                    disabled={!isPlaying}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkipForward}
                    disabled={!isPlaying}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audio Transcript */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <BookOpen className="w-5 h-5" />
                  Audio Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {transcriptSegments.map((segment, index) => (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex gap-3">
                          <Badge 
                            variant="outline" 
                            className="text-green-600 border-green-300 font-mono text-xs flex-shrink-0 h-fit"
                          >
                            {segment.timestamp}
                          </Badge>
                          <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Download Audio Notes */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <Button
                  onClick={handleDownloadNotes}
                  className="w-full bg-white text-green-700 border-2 border-green-300 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Additional Info */}
          <div className="space-y-6">
            {/* Audio Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Audio Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{formatTime(duration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Settings className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quality</p>
                    <p className="text-sm text-gray-600">High Definition</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Format</p>
                    <p className="text-sm text-gray-600">{hasAudioFile ? 'MP3 Audio' : 'Text-to-Speech'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-green-600" />
                  Listening Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700">Find a quiet place to focus on the content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700">Follow along with the transcript</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700">Pause and replay important sections</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    4
                  </div>
                  <p className="text-sm text-gray-700">Download notes for offline review</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleDownloadNotes}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Notes
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}