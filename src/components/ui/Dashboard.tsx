import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "./Card";
import Button from "./Button";
import { GeneratedPost, fetchPosts } from "@/lib/api";
import { useUser } from '@/lib/userContext';

type DashboardProps = {
  posts?: GeneratedPost[];
  onGenerateContent: (platform: string) => void;
  onScheduleAll: () => void;
  isGenerating: boolean;
  isScheduling: boolean;
};

export default function Dashboard({
  posts: initialPosts,
  onGenerateContent,
  onScheduleAll,
  isGenerating,
  isScheduling,
}: DashboardProps) {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState<GeneratedPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  
  
  useEffect(() => {
    if (!initialPosts) {
      const loadPosts = async () => {
        try {
          setLoading(true);
          const fetchedPosts = await fetchPosts();
          setPosts(fetchedPosts);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadPosts();
    }
  }, [initialPosts]);
  const pendingPosts = posts.filter((post) => post.status === "pending");
  const readyPosts = posts.filter((post) => post.status === "ready");
  const scheduledPosts = posts.filter((post) => post.status === "scheduled");
  const postedPosts = posts.filter((post) => post.status === "posted");

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.username}!</h2>
          <p className="text-sm text-gray-600">Current plan: <span className="font-medium">{user.plan || 'Free'}</span></p>
        </div>
      )}    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={pendingPosts.length} color="bg-yellow-100" />
        <StatCard title="Ready" value={readyPosts.length} color="bg-blue-100" />
        <StatCard title="Scheduled" value={scheduledPosts.length} color="bg-purple-100" />
        <StatCard title="Posted" value={postedPosts.length} color="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Content Generation"
            action={
              <div className="flex gap-2">
                <Button
                  variant="primary" 
                  size="sm"
                  onClick={() => onGenerateContent("twitter")}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onScheduleAll}
                  disabled={isScheduling || readyPosts.length === 0}
                >
                  {isScheduling ? "Scheduling..." : "Schedule All"}
                </Button>
              </div>
            }
          />
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerateContent("twitter")}
                  className="flex items-center gap-2"
                >
                  <TwitterIcon className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerateContent("linkedin")}
                  className="flex items-center gap-2"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerateContent("facebook")}
                  className="flex items-center gap-2"
                >
                  <FacebookIcon className="w-4 h-4" />
                  Facebook
                </Button>
              </div>
              
              {readyPosts.length > 0 ? (
                <div className="space-y-3">
                  {readyPosts.slice(0, 3).map((post) => (
                    <ContentCard key={post.id} post={post} />
                  ))}
                  {readyPosts.length > 3 && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm">
                        View All ({readyPosts.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No content ready. Generate some content to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Upcoming Schedule" />
          <CardContent>
            {scheduledPosts.length > 0 ? (
              <div className="space-y-3">
                {scheduledPosts.slice(0, 5).map((post) => (
                  <ScheduleItem key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No scheduled posts. Schedule some content!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg p-4 ${color} dark:bg-opacity-20`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ContentCard({ post }: { post: GeneratedPost }) {
  return (
    <div className="p-3 border rounded-md bg-white dark:bg-black/20">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {post.platform === "twitter" && <TwitterIcon className="w-4 h-4" />}
          {post.platform === "linkedin" && <LinkedInIcon className="w-4 h-4" />}
          {post.platform === "facebook" && <FacebookIcon className="w-4 h-4" />}
          <span className="text-xs font-medium capitalize">{post.platform}</span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm">{post.content}</p>
    </div>
  );
}

function ScheduleItem({ post }: { post: GeneratedPost }) {
  return (
    <div className="flex items-center gap-3 p-2 border-b last:border-0">
      <div className="flex-shrink-0">
        {post.platform === "twitter" && <TwitterIcon className="w-4 h-4" />}
        {post.platform === "linkedin" && <LinkedInIcon className="w-4 h-4" />}
        {post.platform === "facebook" && <FacebookIcon className="w-4 h-4" />}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs truncate">{post.content}</p>
      </div>
      <div className="flex-shrink-0 text-xs text-gray-500">
        {post.scheduled_for ? new Date(post.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
      </div>
    </div>
  );
}

// Simple icon components
function TwitterIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}