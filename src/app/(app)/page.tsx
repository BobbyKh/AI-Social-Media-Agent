'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import { GeneratedPost, fetchPosts } from '@/lib/api';

// Helper functions for mock data
function getMockPosts(): GeneratedPost[] {
  return [
    {
      id: 1,
      platform: 'twitter',
      content: 'Check out our latest AI-powered features that help you create engaging content in seconds! #AIContentManager #ContentCreation',
      image_url: '',
      scheduled_for: null,
      status: 'posted',
      external_id: 'tweet123',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      platform: 'linkedin',
      content: 'Our team has been working on new AI algorithms to improve content recommendations. Here\'s what we\'ve learned so far...',
      image_url: '',
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      status: 'scheduled',
      external_id: '',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      platform: 'facebook',
      content: 'We\'re excited to announce our new content generation features! Try them out today.',
      image_url: '',
      scheduled_for: null,
      status: 'ready',
      external_id: '',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function getConnectedAccounts() {
  return [
    {
      platform: 'Twitter',
      handle: '@yourhandle',
      connected: true,
      icon: '🐦'
    },
    {
      platform: 'LinkedIn',
      handle: 'Your Company',
      connected: false,
      icon: '💼'
    },
    {
      platform: 'Facebook',
      handle: 'Your Page',
      connected: true,
      icon: '📘'
    },
  ];
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch posts from the API
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts data');
        // Fallback to mock data
        setPosts(getMockPosts());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to AI Content Manager</h1>
          <p className="mb-6">Please log in to access your dashboard and start managing your content.</p>
          <Link href="/auth/login">
            <Button size="lg">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AI Content Manager
          </h1>
          <p className="text-gray-600">
            Manage your social media content with AI-powered automation
          </p>
        </div>

        {/* Plan Status */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Current Plan: {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user.is_trial_active && 'You are currently on a trial period. '}
                {user.is_subscription_active ? 'Your subscription is active.' : 'Your subscription has expired.'}
              </p>
            </div>
            {user.plan === 'free' && (
              <Link href="/pricing">
                <Button>Upgrade Plan</Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Post</h3>
            <p className="text-gray-600 text-sm mb-4">Generate AI-powered content</p>
            <Link href="/posts">
              <Button size="sm" className="w-full">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Schedule Posts</h3>
            <p className="text-gray-600 text-sm mb-4">Plan your content calendar</p>
            <Link href="/posts">
              <Button size="sm" className="w-full">Schedule</Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Connect Accounts</h3>
            <p className="text-gray-600 text-sm mb-4">Link your social media</p>
            <Link href="/accounts">
              <Button size="sm" className="w-full">Connect</Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">Track your performance</p>
            <Link href="/analytics">
              <Button size="sm" className="w-full">View</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Posts</h3>
            <div className="space-y-3">
              {posts.length > 0 ? (
                posts.slice(0, 2).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{post.content}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()} - {post.platform}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      post.status === 'ready' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p>No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
            <Link href="/posts" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-4 inline-block">
              View all posts →
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              {getConnectedAccounts().map((account) => (
                <div key={account.platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{account.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{account.platform}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{account.handle}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    account.connected ? 
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {account.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/accounts" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-4 inline-block">
              Manage accounts →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}