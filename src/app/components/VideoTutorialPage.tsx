import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft, Video, ExternalLink, Play, BookOpen,
  Lightbulb, Clock, CheckCircle
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { getLessonVideo, getVideoEmbedUrl, getVideoFullUrl } from '../data/lessonVideos';
import { toast } from 'sonner';

interface VideoTutorialPageProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  onBack: () => void;
}

export function VideoTutorialPage({
  moduleId,
  lessonId,
  lessonTitle,
  onBack
}: VideoTutorialPageProps) {
  const [videoError, setVideoError] = useState(false);

  // Construct the comprehensive lesson content key (format: 'mod1-lesson1-1')
  const comprehensiveLessonKey = `${moduleId}-${lessonId}`;

  // Get lesson-specific video data
  const lessonVideo = getLessonVideo(comprehensiveLessonKey);
  const embedUrl = getVideoEmbedUrl(comprehensiveLessonKey);
  const fullUrl = getVideoFullUrl(comprehensiveLessonKey);

  // Check if it's a local video file
  const isLocalVideo = fullUrl.endsWith('.mp4') || fullUrl.endsWith('.webm') || fullUrl.endsWith('.ogg');

  const handleVideoError = () => {
    setVideoError(true);
    toast.error('Video Load Error', {
      description: 'Unable to load the video. Please check if the file exists.'
    });
  };

  const handleVideoLoad = () => {
    setVideoError(false);
    toast.success('Video Loaded', {
      description: 'Video is ready to play'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Video Tutorial
              </h1>
              <p className="text-gray-600 mt-1">{lessonTitle}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Video className="w-3 h-3 mr-1" />
            {isLocalVideo ? 'CodeLearn AI Original' : 'Enhanced Learning'}
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Video Player (2/3 width) */}
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
                        {lessonVideo.duration ? `Duration: ${lessonVideo.duration}` : 'CodeLearn AI Video'}
                      </p>
                    </div>
                  </div>
                  {!isLocalVideo && (
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
                  )}
                </div>
              </div>
              
              <CardContent className="p-0">
                {isLocalVideo ? (
                  // Local MP4 video player
                  <div className="relative w-full bg-black">
                    {videoError ? (
                      <div className="flex flex-col items-center justify-center p-12 text-white">
                        <Video className="w-16 h-16 mb-4 text-red-400" />
                        <h3 className="text-xl font-semibold mb-2">Video Load Error</h3>
                        <p className="text-gray-300 text-center max-w-md">
                          Unable to load the video file. Please ensure the file exists at: {fullUrl}
                        </p>
                      </div>
                    ) : (
                      <video
                        controls
                        controlsList="nodownload"
                        className="w-full h-auto"
                        style={{ maxHeight: '600px', minHeight: '400px' }}
                        onError={handleVideoError}
                        onLoadedData={handleVideoLoad}
                        preload="metadata"
                      >
                        <source src={fullUrl} type="video/mp4" />
                        <p className="text-white p-8">Your browser does not support the video tag. Please use a modern browser like Chrome, Firefox, or Safari.</p>
                      </video>
                    )}
                  </div>
                ) : (
                  // YouTube iframe embed
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
                )}
              </CardContent>
              </Card>
            </div>

            {/* Video Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  About this Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLocalVideo && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900 mb-1">CodeLearn AI Original Content</p>
                        <p className="text-xs text-green-700">This video is hosted locally for optimal learning experience. All controls are available including play, pause, seek, volume, and fullscreen.</p>
                      </div>
                    </div>
                  </div>
                )}
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
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {lessonVideo.supplementaryVideos.map((video, index) => (
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

          {/* Right Column: Quick Actions & Progress */}
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
                {!isLocalVideo && (
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
                )}
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