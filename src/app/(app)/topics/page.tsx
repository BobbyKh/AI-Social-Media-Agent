'use client';

import { useState } from 'react';
import TopicsManager from "@/components/ui/TopicsManager";
import Notification from "@/components/ui/Notification";
import WorkflowGuide from "@/components/ui/WorkflowGuide";
import { callApi } from "@/app/actions";

export default function TopicsPage() {
  const [topics, setTopics] = useState([
    { id: 1, name: 'AI and Machine Learning', source: 'manual', created_at: new Date().toISOString() },
    { id: 2, name: 'Digital Marketing', source: 'manual', created_at: new Date().toISOString() },
    { id: 3, name: 'Remote Work', source: 'trending', created_at: new Date().toISOString() },
    { id: 4, name: 'Blockchain', source: 'trending', created_at: new Date().toISOString() },
    { id: 5, name: 'Climate Change', source: 'trending', created_at: new Date().toISOString() },
  ]);
  const [isFetching, setIsFetching] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleCreateTopic = async (topic: { name: string; source: string }) => {
    // In a real implementation, you would call your API
    const newTopic = {
      id: Math.floor(Math.random() * 1000),
      name: topic.name,
      source: topic.source,
      created_at: new Date().toISOString()
    };
    
    setTopics(prev => [...prev, newTopic]);
  };

  const handleDeleteTopic = async (topicId: number) => {
    // In a real implementation, you would call your API
    setTopics(prev => prev.filter(topic => topic.id !== topicId));
  };

  const handleFetchTrendingTopics = async (category: string = 'general') => {
    setIsFetching(true);
    try {
      // Call the real AI trending topics API
      const response = await callApi('/api/content/topics/fetch_trending/', {
        method: 'POST',
        body: JSON.stringify({ 
          count: 5,
          category: category
        }),
      });
      
      if (response.success && response.created_topics) {
        // Add new AI-generated trending topics to the existing list
        const newTopics = response.created_topics.map((topic: any) => ({
          id: topic.id,
          name: topic.name,
          source: 'ai_suggested',
          created_at: new Date().toISOString()
        }));
        
        setTopics(prev => [...prev, ...newTopics]);
        setNotification({
          message: `Successfully fetched ${newTopics.length} trending topics!`,
          type: 'success'
        });
        return newTopics;
      } else {
        // Fallback to mock data if AI generation fails
        const mockTopics = [
          { id: 101, name: 'Sustainable Energy', source: 'trending', created_at: new Date().toISOString() },
          { id: 102, name: 'Mental Health', source: 'trending', created_at: new Date().toISOString() },
          { id: 103, name: 'Future of Work', source: 'trending', created_at: new Date().toISOString() },
        ];
        
        setTopics(prev => {
          const existingNames = new Set(prev.map(t => t.name.toLowerCase()));
          const newTopics = mockTopics.filter(t => !existingNames.has(t.name.toLowerCase()));
          return [...prev, ...newTopics];
        });
        
        setNotification({
          message: `Added ${mockTopics.length} trending topics (fallback mode)`,
          type: 'info'
        });
        return mockTopics;
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      // Fallback to mock data
      const mockTopics = [
        { id: 101, name: 'AI & Technology', source: 'trending', created_at: new Date().toISOString() },
        { id: 102, name: 'Digital Innovation', source: 'trending', created_at: new Date().toISOString() },
        { id: 103, name: 'Online Business', source: 'trending', created_at: new Date().toISOString() },
      ];
      
              setTopics(prev => {
          const existingNames = new Set(prev.map(t => t.name.toLowerCase()));
          const newTopics = mockTopics.filter(t => !existingNames.has(t.name.toLowerCase()));
          return [...prev, ...newTopics];
        });
        
        setNotification({
          message: `Added ${mockTopics.length} trending topics (fallback mode)`,
          type: 'info'
        });
        return mockTopics;
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="p-6">
      <WorkflowGuide />
      
      <TopicsManager
        topics={topics}
        onCreateTopic={handleCreateTopic}
        onDeleteTopic={handleDeleteTopic}
        onFetchTrendingTopics={handleFetchTrendingTopics}
        isFetching={isFetching}
      />
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}


