'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import Button from './Button';
import { useRouter } from 'next/navigation';

type Topic = {
  id: number;
  name: string;
  source: string;
  created_at: string;
};

type TopicsManagerProps = {
  topics: Topic[];
  onCreateTopic: (topic: { name: string; source: string }) => Promise<void>;
  onDeleteTopic: (topicId: number) => Promise<void>;
  onFetchTrendingTopics: (category?: string) => Promise<void>;
  isFetching: boolean;
};

const CATEGORIES = [
  { value: 'general', label: 'General', icon: '🌐' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'marketing', label: 'Marketing', icon: '📈' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'science', label: 'Science', icon: '🔬' },
];

const SUGGESTED_TOPICS = [
  { name: 'AI & Machine Learning', category: 'technology' },
  { name: 'Digital Marketing', category: 'marketing' },
  { name: 'Remote Work', category: 'business' },
  { name: 'Blockchain', category: 'technology' },
  { name: 'Climate Change', category: 'science' },
  { name: 'Mental Health', category: 'health' },
];

export default function TopicsManager({
  topics,
  onCreateTopic,
  onDeleteTopic,
  onFetchTrendingTopics,
  isFetching,
}: TopicsManagerProps) {
  const router = useRouter();
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicSource, setNewTopicSource] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const handleCreateTopic = async () => {
    if (!newTopicName) return;
    
    setIsCreating(true);
    try {
      await onCreateTopic({
        name: newTopicName,
        source: newTopicSource || 'manual',
      });
      setNewTopicName('');
      setNewTopicSource('');
    } catch (error) {
      console.error('Error creating topic:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFetchTrending = async () => {
    await onFetchTrendingTopics(selectedCategory);
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'ai_suggested':
        return '🤖';
      case 'trending':
        return '📈';
      case 'manual':
        return '✏️';
      default:
        return '📝';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'ai_suggested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'trending':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'manual':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader
          title={`Content Topics (${topics.length} total)`}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCategorySelector(!showCategorySelector)}
                  className="flex items-center gap-1"
                >
                  <span>{CATEGORIES.find(c => c.value === selectedCategory)?.icon}</span>
                  <span>{CATEGORIES.find(c => c.value === selectedCategory)?.label}</span>
                  <span className="text-xs">▼</span>
                </Button>
                
                {showCategorySelector && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10 min-w-[150px]">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setShowCategorySelector(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${
                          selectedCategory === category.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                variant="primary"
                size="sm"
                onClick={handleFetchTrending}
                disabled={isFetching}
                className="flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Fetch Trending</span>
                  </>
                )}
              </Button>
            </div>
          }
        />
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full px-3 py-2 pl-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>

            {filteredTopics.length > 0 ? (
              <div className="space-y-3">
                {filteredTopics.map((topic, index) => (
                                     <div 
                     key={topic.id} 
                     className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-black/20 hover:shadow-md hover-lift transition-all duration-200 animate-in slide-in-from-top-2"
                     style={{ animationDelay: `${index * 50}ms` }}
                   >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getSourceColor(topic.source)}`}>
                        {getSourceIcon(topic.source)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{topic.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(topic.source)}`}>
                            {topic.source.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(topic.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTopic(topic.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        🗑️
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/posts?topic=${encodeURIComponent(topic.name)}`)}
                        className="flex items-center gap-1"
                      >
                        <span>📝</span>
                        <span>Create Post</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg font-medium mb-2">No topics found</p>
                <p className="text-sm">Create a new topic or fetch trending topics to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Add New Topic" />
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic-name" className="block text-sm font-medium mb-2">
                  Topic Name
                </label>
                <input
                  id="topic-name"
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Enter topic name"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>

              <div>
                <label htmlFor="topic-source" className="block text-sm font-medium mb-2">
                  Source (Optional)
                </label>
                <input
                  id="topic-source"
                  type="text"
                  value={newTopicSource}
                  onChange={(e) => setNewTopicSource(e.target.value)}
                  placeholder="Enter source (e.g., website, RSS feed)"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleCreateTopic}
                disabled={isCreating || !newTopicName}
                className="w-full"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>➕</span>
                    <span>Add Topic</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Quick Add Topics" />
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Suggested Topics</h4>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_TOPICS.map((topic) => (
                    <button
                      key={topic.name}
                      onClick={() => setNewTopicName(topic.name)}
                      className="px-3 py-2 rounded-md text-xs bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-left transition-colors hover-lift"
                    >
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-gray-500">{topic.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Topic Sources" />
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <span className="text-lg">🤖</span>
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-300">AI Suggested</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Generated by AI based on trends</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                <span className="text-lg">📈</span>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-300">Trending</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Currently popular topics</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                <span className="text-lg">✏️</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-300">Manual</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Added manually by you</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}