import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft, Video, ExternalLink, Play, BookOpen,
  Lightbulb, Clock, ChevronDown, ChevronUp, GraduationCap, FileText, Code, Award
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface VideoTutorialInlineProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonVideo: any;
  embedUrl: string;
  fullUrl: string;
  onOpenVideoTutorial?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
}

export function VideoTutorialInline({
  moduleId,
  lessonId,
  lessonTitle,
  lessonVideo,
  embedUrl,
  fullUrl,
  onOpenVideoTutorial
}: VideoTutorialInlineProps) {
  const [showAcademicDetails, setShowAcademicDetails] = React.useState(false);
  
  return (
    <div className="space-y-6">
      {/* Main Grid Layout: Video + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Video Player and Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Card */}
          <div>
            <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{lessonVideo.title}</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration: {lessonVideo.duration}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                    toast.success('Opening in YouTube', {
                      description: 'Video will open in a new tab'
                    });
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in YouTube
                </Button>
              </div>
            </div>
            
            <CardContent className="p-0">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={lessonVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
            </Card>
          </div>

          {/* About this Video */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                About this Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{lessonVideo.description}</p>
              
              {/* Academic Reference Details - Collapsible Section */}
              <div className="border border-purple-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowAcademicDetails(!showAcademicDetails)}
                  className="w-full bg-gradient-to-r from-purple-50 to-blue-50 p-4 flex items-center justify-between hover:from-purple-100 hover:to-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Academic Reference & Lecture Details</p>
                      <p className="text-xs text-gray-600">APA 7th Edition Citation & Topics Covered</p>
                    </div>
                  </div>
                  {showAcademicDetails ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </button>
                
                {showAcademicDetails && (
                  <div className="p-4 bg-white space-y-4 border-t border-purple-100">
                    {/* APA Citation */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-3 h-3 text-purple-600" />
                        APA 7th Edition Citation
                      </p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 leading-relaxed">
                        {lessonVideo.citation}
                      </p>
                    </div>

                    {/* Lecture Topics */}
                    {lessonVideo.lectureTopics && lessonVideo.lectureTopics.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          Topics Covered in This Lecture
                        </p>
                        <ul className="space-y-1.5">
                          {lessonVideo.lectureTopics.map((topic: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-purple-600 font-semibold mt-0.5">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Academic Level */}
                    {lessonVideo.academicLevel && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-3 h-3 text-green-600" />
                          Academic Level
                        </p>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          {lessonVideo.academicLevel}
                        </Badge>
                      </div>
                    )}

                    {/* Channel Information */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-1">Channel</p>
                          <p className="text-gray-800 font-medium">{lessonVideo.channel}</p>
                        </div>
                        {lessonVideo.duration && (
                          <div>
                            <p className="text-gray-500 mb-1">Duration</p>
                            <p className="text-gray-800 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lessonVideo.duration}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* References & Learning Resources */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        References & Learning Resources
                      </p>
                      <div className="space-y-3">
                        {/* Textbook Reference */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 mb-1">Required Textbook</p>
                              <p className="text-xs text-gray-800 leading-relaxed">
                                Liang, Y. D. (2020). <em>Introduction to Java Programming and Data Structures</em> (12th ed.). Pearson Education.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Official Java Documentation */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="w-3 h-3 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 mb-1">Official Documentation</p>
                              <p className="text-xs text-gray-800 leading-relaxed">
                                Oracle. (2024). <em>Java Platform, Standard Edition Documentation</em>. Oracle Corporation.
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => window.open('https://docs.oracle.com/en/java/javase/', '_blank')}
                                className="h-auto p-0 text-indigo-600 hover:text-indigo-800 mt-1 text-xs"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Visit Oracle Java Docs
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Supplementary Reading */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-3 h-3 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 mb-1">Supplementary Reading</p>
                              <p className="text-xs text-gray-800 leading-relaxed">
                                Horstmann, C. S. (2019). <em>Core Java Volume I - Fundamentals</em> (11th ed.). Prentice Hall.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Tutorial */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0">
                              <Code className="w-3 h-3 text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 mb-1">Interactive Tutorial</p>
                              <p className="text-xs text-gray-800 leading-relaxed">
                                Oracle. (2024). <em>The Java™ Tutorials</em>. Oracle Corporation.
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => window.open('https://docs.oracle.com/javase/tutorial/', '_blank')}
                                className="h-auto p-0 text-indigo-600 hover:text-indigo-800 mt-1 text-xs"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Access Java Tutorials
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Course Materials */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                              <Award className="w-3 h-3 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 mb-1">Course Materials</p>
                              <p className="text-xs text-gray-800 leading-relaxed">
                                University of Cabuyao. (2024). <em>CCS108 - Object-Oriented Programming with Java: Course Materials and Lecture Notes</em>. Cabuyao, Laguna, Philippines.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Supplementary Videos */}
          {lessonVideo.supplementaryVideos && lessonVideo.supplementaryVideos.length > 0 && (
            <div>
              <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  Supplementary Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {lessonVideo.supplementaryVideos.map((video: any, index: number) => (
                      <Card key={index} className="border border-gray-200 hover:border-purple-300 transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Video className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {video.duration}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                window.open(video.url, '_blank');
                                toast.success('Opening Video', {
                                  description: video.title
                                });
                              }}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-shrink-0"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Watch
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Learning Tips */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Learning Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-gray-700">Watch the video at your own pace, pause when needed</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-gray-700">Take notes of key concepts and examples</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-gray-700">Try the code examples in your own editor</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-gray-700">Review supplementary videos for deeper understanding</p>
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
                onClick={() => {
                  window.open(fullUrl, '_blank');
                  toast.success('Opening in YouTube');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch on YouTube
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}