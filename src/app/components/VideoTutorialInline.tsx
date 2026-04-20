import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Video, ExternalLink, Play, BookOpen, 
  Code, Lightbulb, Clock, Target, Trophy, CheckCircle 
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
  return (
    <div className="space-y-6">
      {/* Main Grid Layout: Video + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Video Player and Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Card */}
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
              
              {/* Video Source Citation */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Video Source</p>
                    <p className="text-sm text-gray-600">{lessonVideo.citation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Visual demonstration of concepts</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <Code className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Step-by-step code examples</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-gray-700">Expert tips and best practices</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Real-world applications</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplementary Videos */}
          {lessonVideo.supplementaryVideos && lessonVideo.supplementaryVideos.length > 0 && (
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
          )}
        </div>

        {/* Right Column: Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Video Resources */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="text-lg">Video Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-4 rounded-lg border-2 border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Main Tutorial</h4>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive video explanation</p>
                    <Badge variant="outline" className="text-xs border-purple-600 text-purple-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {lessonVideo.duration}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 bg-white transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Supplementary Videos</h4>
                    <p className="text-sm text-gray-600 mb-2">Additional learning resources</p>
                    <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Various
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
