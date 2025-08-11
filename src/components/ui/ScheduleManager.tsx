'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import Button from './Button';
import { GeneratedPost } from '@/lib/api';

type ScheduleManagerProps = {
  posts: GeneratedPost[];
  onSchedulePost: (postId: number, scheduledFor: string) => Promise<void>;
  isLoading?: boolean;
};

export default function ScheduleManager({
  posts,
  onSchedulePost,
  isLoading = false,
}: ScheduleManagerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedTime, setSelectedTime] = useState<string>(getCurrentHour());
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [isScheduling, setIsScheduling] = useState(false);
  
  const readyPosts = posts.filter(post => post.status === 'ready');
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  
  const filteredPosts = readyPosts.filter(post => {
    if (selectedPlatforms.includes('all')) return true;
    return selectedPlatforms.includes(post.platform);
  });

  const handleSchedulePost = async (postId: number) => {
    if (!selectedDate || !selectedTime) return;
    
    setIsScheduling(true);
    try {
      const scheduledDateTime = `${selectedDate}T${selectedTime}:00`;
      await onSchedulePost(postId, scheduledDateTime);
    } catch (error) {
      console.error('Error scheduling post:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleScheduleAll = async () => {
    if (!selectedDate || !selectedTime || filteredPosts.length === 0) return;
    
    setIsScheduling(true);
    try {
      const scheduledDateTime = `${selectedDate}T${selectedTime}:00`;
      const baseTime = new Date(`${scheduledDateTime}`);
      
      // Schedule posts 10 minutes apart
      for (let i = 0; i < filteredPosts.length; i++) {
        const postTime = new Date(baseTime.getTime() + i * 10 * 60 * 1000);
        const formattedTime = postTime.toISOString().slice(0, 19);
        await onSchedulePost(filteredPosts[i].id, formattedTime);
      }
    } catch (error) {
      console.error('Error scheduling posts:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const togglePlatformFilter = (platform: string) => {
    if (platform === 'all') {
      setSelectedPlatforms(['all']);
      return;
    }
    
    const newSelection = selectedPlatforms.includes('all')
      ? [platform]
      : selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter(p => p !== platform)
        : [...selectedPlatforms, platform];
        
    if (newSelection.length === 0) {
      setSelectedPlatforms(['all']);
    } else {
      setSelectedPlatforms(newSelection);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Schedule Content"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={handleScheduleAll}
              disabled={isScheduling || filteredPosts.length === 0}
            >
              {isScheduling ? 'Scheduling...' : `Schedule All (${filteredPosts.length})`}
            </Button>
          }
        />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div>
                <label htmlFor="schedule-date" className="block text-xs font-medium mb-1">
                  Date
                </label>
                <input
                  id="schedule-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTodayString()}
                  className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>
              <div>
                <label htmlFor="schedule-time" className="block text-xs font-medium mb-1">
                  Time
                </label>
                <input
                  id="schedule-time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>
              <div className="flex-grow">
                <label className="block text-xs font-medium mb-1">Platform Filter</label>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    label="All"
                    selected={selectedPlatforms.includes('all')}
                    onClick={() => togglePlatformFilter('all')}
                  />
                  <FilterButton
                    label="Twitter"
                    selected={selectedPlatforms.includes('twitter')}
                    onClick={() => togglePlatformFilter('twitter')}
                  />
                  <FilterButton
                    label="LinkedIn"
                    selected={selectedPlatforms.includes('linkedin')}
                    onClick={() => togglePlatformFilter('linkedin')}
                  />
                  <FilterButton
                    label="Facebook"
                    selected={selectedPlatforms.includes('facebook')}
                    onClick={() => togglePlatformFilter('facebook')}
                  />
                </div>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="space-y-3 mt-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-md bg-white dark:bg-black/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={post.platform} />
                        <span className="text-xs font-medium capitalize">{post.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSchedulePost(post.id)}
                          disabled={isScheduling}
                          className="text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                        >
                          Schedule
                        </button>
                        <button
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No content ready to schedule. Create some content first!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Scheduled Queue" />
        <CardContent>
          {scheduledPosts.length > 0 ? (
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-3 border rounded-md bg-white dark:bg-black/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={post.platform} />
                      <span className="text-xs font-medium capitalize">{post.platform}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatScheduledTime(post.scheduled_for)}
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
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
  );
}

function FilterButton({ 
  label, 
  selected, 
  onClick 
}: { 
  label: string; 
  selected: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs ${selected ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 dark:bg-white/5'}`}
    >
      {label}
    </button>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const className = "w-4 h-4";
  
  switch (platform) {
    case 'twitter':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      );
    default:
      return null;
  }
}

// Helper functions
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getCurrentHour(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function formatScheduledTime(dateTimeString: string | null): string {
  if (!dateTimeString) return 'Not scheduled';
  
  const date = new Date(dateTimeString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}