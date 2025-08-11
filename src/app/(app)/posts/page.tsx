'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ContentCreation from "@/components/ui/ContentCreation";
import ScheduleManager from "@/components/ui/ScheduleManager";
import { GeneratedPost } from "@/lib/api";
import { callApi } from "@/app/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get('topic');
  
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [activeTab, setActiveTab] = useState(topicFromUrl ? 'create' : 'create');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await callApi('/api/posts/', { method: 'GET' });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // For demo purposes, show some mock data if API fails
        setPosts([
          {
            id: 1,
            platform: 'twitter',
            content: 'Sample post about AI content generation',
            image_url: '',
            scheduled_for: null,
            status: 'ready',
            external_id: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const handleGenerateContent = async (platform: string, prompt: string): Promise<GeneratedPost> => {
    setIsLoading(true);
    try {
      // Call the real AI content generation API
      const response = await callApi('/api/content/posts/generate/', {
        method: 'POST',
        body: JSON.stringify({ 
          topic: prompt, 
          platform,
          tone: 'professional',
          include_hashtags: true
        }),
      });
      
      if (response.success) {
        // Add to local state
        setPosts(prev => [response.post, ...prev]);
        return response.post;
      } else {
        // Fallback to mock data if AI generation fails
        const mockResponse: GeneratedPost = {
          id: Math.floor(Math.random() * 1000),
          platform,
          content: `AI generation unavailable. Mock content about ${prompt} for ${platform}. Set OPENAI_API_KEY to enable real AI generation.`,
          image_url: '',
          scheduled_for: null,
          status: 'ready',
          external_id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockResponse;
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to mock data
      const mockResponse: GeneratedPost = {
        id: Math.floor(Math.random() * 1000),
        platform,
        content: `Error generating content. Mock content about ${prompt} for ${platform}. Please check your API configuration.`,
        image_url: '',
        scheduled_for: null,
        status: 'ready',
        external_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return mockResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async (post: Partial<GeneratedPost>): Promise<void> => {
    setIsLoading(true);
    try {
      // This would call your backend API to save the content
      // For demo purposes, we're just adding to the local state
      const newPost: GeneratedPost = {
        id: Math.floor(Math.random() * 1000),
        platform: post.platform || 'twitter',
        content: post.content || '',
        image_url: post.image_url || '',
        scheduled_for: null,
        status: post.status || 'ready',
        external_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setPosts(prev => [newPost, ...prev]);
      
      // In a real implementation, you would call your API:
      // await callApi('/api/posts/', {
      //   method: 'POST',
      //   body: JSON.stringify(post),
      // });
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedulePost = async (postId: number, scheduledFor: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Update the post in local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, scheduled_for: scheduledFor, status: 'scheduled' };
        }
        return post;
      }));
      
      // In a real implementation, you would call your API:
      // await callApi(`/api/posts/${postId}/schedule/`, {
      //   method: 'POST',
      //   body: JSON.stringify({ scheduled_for: scheduledFor }),
      // });
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number): Promise<void> => {
    setIsLoading(true);
    try {
      // Remove the post from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      // In a real implementation, you would call your API:
      // await callApi(`/api/posts/${postId}/`, {
      //   method: 'DELETE',
      // });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTrendingTopics = async (): Promise<string[]> => {
    try {
      // This would call your backend API to fetch trending topics
      // For demo purposes, we're returning mock data
      return ['AI and Machine Learning', 'Climate Change', 'Remote Work', 'Digital Marketing', 'Blockchain'];
      
      // In a real implementation, you would call your API:
      // const response = await callApi('/api/topics/trending/', { method: 'GET' });
      // return response.topics;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Create, schedule, and manage your social media content</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Content
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Schedule Posts
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Post History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <ContentCreation
            onGenerateContent={handleGenerateContent}
            onSaveContent={handleSaveContent}
            onFetchTrendingTopics={handleFetchTrendingTopics}
            isLoading={isLoading}
            initialTopic={topicFromUrl || ''}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleManager
            posts={posts.filter(post => post.status === 'ready')}
            onSchedulePost={handleSchedulePost}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Post History</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading posts...</div>
              </div>
                         ) : posts.length === 0 ? (
               <Card>
                 <CardContent>
                   <p className="text-gray-500">No posts found. Create your first post to get started!</p>
                 </CardContent>
               </Card>
             ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                                     <Card key={post.id}>
                     <CardHeader 
                       title={post.platform}
                       action={
                         <div className="flex items-center space-x-2">
                           <span className={`px-2 py-1 text-xs rounded-full ${
                             post.status === 'published' ? 'bg-green-100 text-green-800' :
                             post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                             'bg-gray-100 text-gray-800'
                           }`}>
                             {post.status}
                           </span>
                           <Button
                             onClick={() => handleDeletePost(post.id)}
                             variant="ghost"
                             size="sm"
                             className="text-red-600 hover:text-red-800"
                           >
                             Delete
                           </Button>
                         </div>
                       }
                     />
                    <CardContent>
                      <p className="text-gray-700">{post.content}</p>
                      {post.scheduled_for && (
                        <p className="text-sm text-gray-500 mt-2">
                          Scheduled for: {new Date(post.scheduled_for).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


