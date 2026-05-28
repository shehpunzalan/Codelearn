import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Database, Download, Trash2, RefreshCw, Eye, EyeOff, FileJson, FileCode, FileSpreadsheet } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { downloadAsJSON, downloadAsSQL, downloadAsCSV, getStorageStats } from '../utils/dataMigration';
import { toast } from 'sonner';

interface DataViewerProps {
  onBack: () => void;
}

interface StorageItem {
  key: string;
  value: any;
  size: string;
  type: string;
}

export function DataViewer({ onBack }: DataViewerProps) {
  const [storageData, setStorageData] = useState<StorageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  // Load all localStorage data
  const loadStorageData = () => {
    const items: StorageItem[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const rawValue = localStorage.getItem(key);
        if (rawValue) {
          try {
            const parsedValue = JSON.parse(rawValue);
            const sizeInBytes = new Blob([rawValue]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            // Determine type based on key
            let type = 'other';
            if (key.startsWith('progress_')) type = 'progress';
            else if (key.startsWith('submissions_')) type = 'submissions';
            else if (key.startsWith('stats_')) type = 'stats';
            else if (key.startsWith('quiz_')) type = 'quiz';
            else if (key.startsWith('notifications_')) type = 'notifications';
            else if (key === 'currentUser') type = 'auth';
            else if (key === 'registeredUsers') type = 'users';
            else if (key === 'allSubmissions') type = 'submissions';

            items.push({
              key,
              value: parsedValue,
              size: `${sizeInKB} KB`,
              type
            });
          } catch (error) {
            // If not JSON, store as string
            items.push({
              key,
              value: rawValue,
              size: `${(new Blob([rawValue]).size / 1024).toFixed(2)} KB`,
              type: 'string'
            });
          }
        }
      }
    }

    setStorageData(items);
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  // Filter data
  const filteredData = storageData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Export handlers
  const handleExportJSON = () => {
    downloadAsJSON();
    toast.success('Data exported as JSON');
  };

  const handleExportSQL = () => {
    downloadAsSQL();
    toast.success('Data exported as SQL');
  };

  const handleExportCSV = () => {
    downloadAsCSV();
    toast.success('Data exported as CSV files');
  };

  // Clear specific item
  const handleDeleteItem = (key: string) => {
    if (confirm(`Are you sure you want to delete "${key}"?`)) {
      localStorage.removeItem(key);
      loadStorageData();
      if (selectedItem?.key === key) {
        setSelectedItem(null);
      }
    }
  };

  // Calculate total storage size
  const totalSize = storageData.reduce((total, item) => {
    return total + parseFloat(item.size);
  }, 0).toFixed(2);

  // Get data type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'bg-blue-100 text-blue-700';
      case 'submissions': return 'bg-purple-100 text-purple-700';
      case 'stats': return 'bg-green-100 text-green-700';
      case 'quiz': return 'bg-yellow-100 text-yellow-700';
      case 'notifications': return 'bg-orange-100 text-orange-700';
      case 'auth': return 'bg-red-100 text-red-700';
      case 'users': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Data Viewer</h1>
            </div>
            <p className="text-gray-600">View and manage localStorage data</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Storage</p>
            <p className="text-2xl font-bold text-blue-600">{totalSize} KB</p>
            <p className="text-xs text-gray-500">{storageData.length} items</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={loadStorageData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>

        {/* Export Options */}
        <Button onClick={handleExportJSON} variant="outline" size="sm" className="text-blue-600 border-blue-300">
          <FileJson className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={handleExportSQL} variant="outline" size="sm" className="text-purple-600 border-purple-300">
          <FileCode className="w-4 h-4 mr-2" />
          Export SQL
        </Button>
        <Button onClick={handleExportCSV} variant="outline" size="sm" className="text-green-600 border-green-300">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export CSV
        </Button>

        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
          >
            All ({storageData.length})
          </Button>
          <Button
            onClick={() => setFilter('progress')}
            variant={filter === 'progress' ? 'default' : 'outline'}
            size="sm"
          >
            Progress
          </Button>
          <Button
            onClick={() => setFilter('submissions')}
            variant={filter === 'submissions' ? 'default' : 'outline'}
            size="sm"
          >
            Submissions
          </Button>
          <Button
            onClick={() => setFilter('quiz')}
            variant={filter === 'quiz' ? 'default' : 'outline'}
            size="sm"
          >
            Quizzes
          </Button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data List */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Storage Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-6 pt-0">
                  {filteredData.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedItem?.key === item.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.size}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.key}
                      </p>
                    </button>
                  ))}

                  {filteredData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No data found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Data Details */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getTypeColor(selectedItem.type)}`}>
                        {selectedItem.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{selectedItem.size}</span>
                    </div>
                    <CardTitle className="text-lg break-all">{selectedItem.key}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowRawJson(!showRawJson)}
                      variant="outline"
                      size="sm"
                    >
                      {showRawJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => handleDeleteItem(selectedItem.key)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[540px]">
                  {showRawJson ? (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(selectedItem.value, null, 2)}
                    </pre>
                  ) : (
                    <div className="space-y-4">
                      {typeof selectedItem.value === 'object' && selectedItem.value !== null ? (
                        <div className="space-y-3">
                          {Object.entries(selectedItem.value).map(([key, value]) => (
                            <div key={key} className="border-b pb-3">
                              <p className="text-sm font-semibold text-gray-700 mb-1">{key}</p>
                              <div className="bg-gray-50 p-3 rounded text-sm">
                                {typeof value === 'object' && value !== null ? (
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                ) : (
                                  <p className="text-gray-900">
                                    {String(value)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded">
                          <p className="text-sm text-gray-900">{String(selectedItem.value)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md h-[680px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select an item to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
