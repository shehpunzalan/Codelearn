import React, { useState } from 'react';
import { Module } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, ExternalLink, Download, Filter, Search, Link as LinkIcon } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ReferencesViewProps {
  modules: Module[];
  onBack: () => void;
}

export function ReferencesView({ modules, onBack }: ReferencesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Collect all references from all modules
  const allReferences = modules.flatMap((module, moduleIndex) => 
    (module.references || []).map((ref, refIndex) => ({
      ...ref,
      moduleId: module.id,
      moduleTitle: module.title,
      ieeeIndex: moduleIndex * 10 + refIndex + 1
    }))
  );

  // Filter references
  const filteredReferences = allReferences.filter(ref => {
    const matchesSearch = searchQuery === '' || 
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ref.author && ref.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ref.description && ref.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || ref.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Group by module
  const referencesByModule = modules.map(module => ({
    module,
    references: allReferences.filter(ref => ref.moduleId === module.id)
  })).filter(group => group.references.length > 0);

  // Format IEEE citation
  const formatIEEECitation = (ref: any) => {
    let citation = `[${ref.ieeeIndex}] `;
    
    if (ref.author) {
      citation += `${ref.author}, `;
    }
    
    citation += `"${ref.title},"`;
    
    if (ref.type === 'book') {
      citation += ` Book`;
    } else if (ref.type === 'website' || ref.type === 'documentation') {
      citation += ` Online`;
    } else if (ref.type === 'article') {
      citation += ` Article`;
    } else if (ref.type === 'research') {
      citation += ` Research Paper`;
    }
    
    if (ref.year) {
      citation += `, ${ref.year}`;
    }
    
    if (ref.url) {
      citation += `. Available: ${ref.url}`;
    }
    
    if (ref.description) {
      citation += ` [${ref.description}]`;
    }
    
    return citation;
  };

  // Get reference type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'website': return 'bg-green-100 text-green-800 border-green-300';
      case 'documentation': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'research': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'article': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'video': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Statistics
  const stats = {
    // Count total references
    total: allReferences.length,
    
    // Count references by type
    books: allReferences.filter(reference => reference.type === 'book').length,
    websites: allReferences.filter(reference => reference.type === 'website').length,
    documentation: allReferences.filter(reference => reference.type === 'documentation').length,
    research: allReferences.filter(reference => reference.type === 'research').length,
    articles: allReferences.filter(reference => reference.type === 'article').length,
    
    // Count references with URL links
    withLinks: allReferences.filter(reference => reference.url).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-700">IEEE References</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Module References & Sources</h1>
            <p className="text-gray-600 mt-1">Complete IEEE-formatted bibliography of all course materials</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Bibliography
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800 border-0">Total</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600 mt-1">Total References</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800 border-0">Books</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.books}</p>
            <p className="text-xs text-gray-600 mt-1">Textbooks</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <LinkIcon className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-100 text-green-800 border-0">Online</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.websites + stats.documentation}</p>
            <p className="text-xs text-gray-600 mt-1">Web Resources</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <ExternalLink className="w-5 h-5 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-800 border-0">Research</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.research}</p>
            <p className="text-xs text-gray-600 mt-1">Research Papers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search references by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-purple-600' : ''}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filterType === 'book' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('book')}
                className={filterType === 'book' ? 'bg-blue-600' : ''}
              >
                Books ({stats.books})
              </Button>
              <Button
                variant={filterType === 'documentation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('documentation')}
                className={filterType === 'documentation' ? 'bg-purple-600' : ''}
              >
                Docs ({stats.documentation})
              </Button>
              <Button
                variant={filterType === 'research' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('research')}
                className={filterType === 'research' ? 'bg-orange-600' : ''}
              >
                Research ({stats.research})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IEEE Format Guide */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">IEEE Citation Format</h3>
              <p className="text-sm text-gray-700 mb-2">
                All references follow the IEEE citation standard format for academic integrity and proper attribution.
              </p>
              <p className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-blue-200">
                [Index] Author, "Title," Type, Year. Available: URL [Description]
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* References by Module */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Complete References List
          </CardTitle>
          <CardDescription>
            {filteredReferences.length} references across {referencesByModule.length} modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {referencesByModule.map((group) => (
                <div key={group.module.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  {/* Module Header */}
                  <div className="mb-4 pb-3 border-b-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{group.module.title}</h3>
                      <Badge variant="outline" className="capitalize">
                        {group.module.difficulty}
                      </Badge>
                      {group.module.source?.type && (
                        <Badge className={
                          group.module.source.type === 'neural-network' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                          group.module.source.type === 'instructor' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          group.module.source.type === 'curriculum' ? 'bg-green-100 text-green-800 border-green-300' :
                          'bg-orange-100 text-orange-800 border-orange-300'
                        } variant="outline">
                          {group.module.source.type === 'neural-network' ? 'AI Neural Network' :
                           group.module.source.type === 'instructor' ? 'Instructor' :
                           group.module.source.type === 'curriculum' ? 'Curriculum' :
                           'AI Generated'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{group.references.length} references</p>
                  </div>

                  {/* References List */}
                  <div className="space-y-4">
                    {group.references.map((ref) => (
                      <div 
                        key={`${ref.moduleId}-${ref.ieeeIndex}`}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                      >
                        {/* IEEE Citation */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-900 font-mono leading-relaxed">
                            {formatIEEECitation(ref)}
                          </p>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={getTypeBadgeColor(ref.type)}>
                              {ref.type.charAt(0).toUpperCase() + ref.type.slice(1)}
                            </Badge>
                            {ref.year && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                                {ref.year}
                              </Badge>
                            )}
                            {ref.author && (
                              <span className="text-xs text-gray-600">
                                by {ref.author}
                              </span>
                            )}
                          </div>
                          
                          {ref.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => window.open(ref.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Source
                            </Button>
                          )}
                        </div>

                        {/* Description */}
                        {ref.description && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-700">
                              <strong className="text-gray-900">Description:</strong> {ref.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reference Type Distribution */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Reference Type Distribution</CardTitle>
          <CardDescription>Breakdown of sources by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Books</p>
                  <p className="text-xs text-gray-600">Textbooks and published books</p>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white border-0">{stats.books}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Websites</p>
                  <p className="text-xs text-gray-600">Online tutorials and guides</p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white border-0">{stats.websites}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Documentation</p>
                  <p className="text-xs text-gray-600">Official documentation</p>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white border-0">{stats.documentation}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Research Papers</p>
                  <p className="text-xs text-gray-600">Academic research and studies</p>
                </div>
              </div>
              <Badge className="bg-orange-600 text-white border-0">{stats.research}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Articles</p>
                  <p className="text-xs text-gray-600">Educational articles</p>
                </div>
              </div>
              <Badge className="bg-pink-600 text-white border-0">{stats.articles}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
