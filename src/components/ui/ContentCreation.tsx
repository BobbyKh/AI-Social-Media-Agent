'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import Button from './Button';
import { GeneratedPost } from '@/lib/api';

// Typing Animation Component
function TypingAnimation({ 
  text, 
  speed = 50, 
  onComplete 
}: { 
  text: string; 
  speed?: number; 
  onComplete?: () => void; 
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Reset state when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    console.log('TypingAnimation reset with new text:', text, 'length:', text.length);
  }, [text]);

  // Handle typing animation
  useEffect(() => {
    // Only proceed if there's text to type
    if (!text || text.length === 0) return;
    
    console.log('TypingAnimation typing - currentIndex:', currentIndex, 'text.length:', text.length);
    
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      // Call onComplete when typing is finished
      console.log('TypingAnimation complete');
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className="relative">
      <span>{displayedText}</span>
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse"></span>
      )}
    </div>
  );
}

type ContentCreationProps = {
  onGenerateContent: (platform: string, prompt: string) => Promise<GeneratedPost>;
  onSaveContent: (post: Partial<GeneratedPost>) => Promise<void>;
  onFetchTrendingTopics?: () => Promise<string[]>;
  isLoading?: boolean;
  initialTopic?: string;
};

export default function ContentCreation({
  onGenerateContent,
  onSaveContent,
  onFetchTrendingTopics,
  isLoading = false,
  initialTopic = '',
}: ContentCreationProps) {
  const [platform, setPlatform] = useState('twitter');
  const [prompt, setPrompt] = useState(initialTopic);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const [generationKey, setGenerationKey] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setIsTyping(true);
    setTypingContent('');
    setContent('');
    
    try {
      const generatedPost = await onGenerateContent(platform, prompt);
      // Set the content to be typed, which will trigger the animation
      console.log('Setting typing content:', generatedPost.content);
      
      // Important: Set the generation key AFTER we have the content
      // This ensures the TypingAnimation gets the new content with a fresh state
      setGenerationKey(prev => prev + 1); // Force re-render of TypingAnimation
      
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        setTypingContent(generatedPost.content);
        setGeneratedPosts(prev => [generatedPost, ...prev]);
      }, 50);
    } catch (error) {
      console.error('Error generating content:', error);
      setIsTyping(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTypingComplete = () => {
    console.log('Typing animation completed');
    // Ensure we have the final content
    setContent(typingContent);
    // Small delay before changing the UI state to ensure smooth transition
    setTimeout(() => {
      setIsTyping(false);
      console.log('Content generated successfully!');
      // You could add a toast notification here
    }, 100);
  };

  const handleSave = async () => {
    if (!content) return;
    
    setIsSaving(true);
    try {
      await onSaveContent({
        platform,
        content,
        status: 'ready',
      });
      setContent('');
      setPrompt('');
      setTypingContent('');
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Create Content"
          action={
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : 'Generate'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !content}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          }
        />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <PlatformButton
                platform="twitter"
                selected={platform === 'twitter'}
                onClick={() => setPlatform('twitter')}
              />
              <PlatformButton
                platform="linkedin"
                selected={platform === 'linkedin'}
                onClick={() => setPlatform('linkedin')}
              />
              <PlatformButton
                platform="facebook"
                selected={platform === 'facebook'}
                onClick={() => setPlatform('facebook')}
              />
              <PlatformButton
                platform="instagram"
                selected={platform === 'instagram'}
                onClick={() => setPlatform('instagram')}
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Topic or Prompt
              </label>
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a topic or specific prompt for AI generation"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
                {content && !isTyping && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                    ✓ Generated
                  </span>
                )}
              </label>
              <div className="relative">
                {isTyping ? (
                  <div className="w-full px-3 py-2 border rounded-md text-sm bg-blue-50 dark:bg-blue-900/20 min-h-[120px] flex items-start">
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {isGenerating ? 'AI is generating content...' : 'Typing content...'}
                        </span>
                      </div>
                      {typingContent && (
                        <TypingAnimation 
                          key={generationKey}
                          text={typingContent} 
                          speed={30} 
                          onComplete={handleTypingComplete}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your content will appear here after generation, or write your own"
                    rows={5}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  />
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {getCharacterLimit(platform) - (isTyping ? typingContent.length : content.length)} characters remaining
                </span>
                <div className="flex items-center gap-2">
                  {content && !isTyping && (
                    <button
                      onClick={() => {
                        setContent('');
                        setTypingContent('');
                      }}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      Clear
                    </button>
                  )}
                  <span className="text-xs text-gray-500">
                    {platform === 'twitter' ? '280 max' : platform === 'linkedin' ? '3000 max' : '2000 max'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Content Enhancement</h4>
              <div className="flex flex-wrap gap-2">
                <EnhancementButton label="Add Hashtags" onClick={() => enhanceContent('hashtags')} />
                <EnhancementButton label="More Professional" onClick={() => enhanceContent('professional')} />
                <EnhancementButton label="More Casual" onClick={() => enhanceContent('casual')} />
                <EnhancementButton label="Add Call to Action" onClick={() => enhanceContent('cta')} />
                <EnhancementButton label="Shorten" onClick={() => enhanceContent('shorten')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Recent Generations" />
        <CardContent>
          {generatedPosts.length > 0 ? (
            <div className="space-y-3">
              {generatedPosts.slice(0, 5).map((post, index) => (
                <div key={index} className="p-3 border rounded-md bg-white dark:bg-black/20">
                  <div className="flex justify-between items-start mb-2">
                    <PlatformIcon platform={post.platform} />
                    <button 
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                      onClick={() => setContent(post.content)}
                    >
                      Use This
                    </button>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No generated content yet. Try creating some!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // This would be implemented with actual AI enhancement in a real app
  function enhanceContent(type: string) {
    // Placeholder for actual AI enhancement
    switch (type) {
      case 'hashtags':
        setContent(prev => `${prev} #AI #ContentAutomation`);
        break;
      case 'professional':
        // Would call an API in a real implementation
        break;
      case 'casual':
        // Would call an API in a real implementation
        break;
      case 'cta':
        setContent(prev => `${prev} Click the link to learn more!`);
        break;
      case 'shorten':
        // Would call an API in a real implementation
        break;
    }
  }
}

function getCharacterLimit(platform: string): number {
  switch (platform) {
    case 'twitter':
      return 280;
    case 'linkedin':
      return 3000;
    case 'facebook':
      return 2000;
    case 'instagram':
      return 2200;
    default:
      return 1000;
  }
}

function PlatformButton({ 
  platform, 
  selected, 
  onClick 
}: { 
  platform: string; 
  selected: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${selected ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 dark:bg-white/5'}`}
    >
      <PlatformIcon platform={platform} />
      <span className="capitalize">{platform}</span>
    </button>
  );
}

function EnhancementButton({ 
  label, 
  onClick 
}: { 
  label: string; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-md text-xs bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
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