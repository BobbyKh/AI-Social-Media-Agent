'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import Button from './Button';

type SettingsProps = {
  settings: {
    aiSettings: {
      model: string;
      temperature: number;
      maxTokens: number;
      autoModeration: boolean;
    };
    schedulingSettings: {
      defaultInterval: number;
      preferredTimes: string[];
      timezone: string;
    };
    connectedAccounts: Array<{
      platform: string;
      name: string;
      connected: boolean;
      lastSync?: string;
    }>;
  };
  onSaveSettings: (settings: any) => Promise<void>;
  onConnectAccount: (platform: string) => Promise<void>;
  onDisconnectAccount: (platform: string) => Promise<void>;
};

export default function Settings({
  settings,
  onSaveSettings,
  onConnectAccount,
  onDisconnectAccount,
}: SettingsProps) {
  const [aiSettings, setAiSettings] = useState(settings.aiSettings);
  const [schedulingSettings, setSchedulingSettings] = useState(settings.schedulingSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await onSaveSettings({
        aiSettings,
        schedulingSettings,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <TabButton 
          label="General" 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')} 
        />
        <TabButton 
          label="AI Settings" 
          active={activeTab === 'ai'} 
          onClick={() => setActiveTab('ai')} 
        />
        <TabButton 
          label="Scheduling" 
          active={activeTab === 'scheduling'} 
          onClick={() => setActiveTab('scheduling')} 
        />
        <TabButton 
          label="Connected Accounts" 
          active={activeTab === 'accounts'} 
          onClick={() => setActiveTab('accounts')} 
        />
      </div>

      {activeTab === 'general' && (
        <Card>
          <CardHeader 
            title="General Settings" 
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            }
          />
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  defaultValue="user@example.com"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={schedulingSettings?.timezone || 'UTC'}
                  onChange={(e) => setSchedulingSettings({
                    ...schedulingSettings,
                    timezone: e.target.value  ,
                  })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Email notifications for scheduled posts</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Email notifications for post performance</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card>
          <CardHeader 
            title="AI Content Generation Settings" 
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            }
          />
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="ai-model" className="block text-sm font-medium mb-1">
                  AI Model
                </label>
                <select
                  id="ai-model"
                  value={aiSettings?.model || 'gpt-4o-mini'}
                  onChange={(e) => setAiSettings({
                    ...aiSettings ,  
                    model: e.target.value,
                  })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                  <option value="gpt-4o">GPT-4o (Balanced)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo (Advanced)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium mb-1">
                  Creativity (Temperature): {aiSettings?.temperature || 0}
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiSettings?.temperature || 0}
                  onChange={(e) => setAiSettings({
                    ...aiSettings,
                    temperature: parseFloat(e.target.value),
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="max-tokens" className="block text-sm font-medium mb-1">
                  Maximum Length: {aiSettings?.maxTokens || 200} tokens
                </label>
                <input
                  id="max-tokens"
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={aiSettings?.maxTokens || 200}
                  onChange={(e) => setAiSettings({
                    ...aiSettings,
                    maxTokens: parseInt(e.target.value),
                  })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={aiSettings?.autoModeration || false}
                    onChange={(e) => setAiSettings({
                      ...aiSettings,
                      autoModeration: e.target.checked,
                    })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Auto-moderate generated content</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Automatically check generated content for policy violations before posting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'scheduling' && (
        <Card>
          <CardHeader 
            title="Scheduling Settings" 
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            }
          />
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="default-interval" className="block text-sm font-medium mb-1">
                  Default Time Between Posts (minutes)
                </label>
                <input
                  id="default-interval"
                  type="number"
                  min="10"
                  max="1440"
                  value={schedulingSettings?.defaultInterval}
                  onChange={(e) => setSchedulingSettings({
                    ...schedulingSettings,
                    defaultInterval: parseInt(e.target.value),
                  })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Posting Times
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                    <label key={time} className="flex items-center gap-2 p-2 border rounded-md">
                      <input
                        type="checkbox"
                        defaultChecked={time !== 'Night'}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{time}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The system will prioritize scheduling posts during these times
                </p>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Optimize posting times based on audience activity</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Avoid scheduling similar content too close together</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'accounts' && (
        <Card>
          <CardHeader title="Connected Social Media Accounts" />
          <CardContent>
            <div className="space-y-4">
              {settings.connectedAccounts?.map((account) => (
                <div key={account.platform} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={account.platform} className="w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium capitalize">{account.platform}</p>
                      {account.connected ? (
                        <p className="text-xs text-gray-500">
                          Connected as {account.name}
                          {account.lastSync && ` · Last synced ${formatDate(account.lastSync)}`}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Not connected</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={account.connected ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => account.connected 
                      ? onDisconnectAccount(account.platform)
                      : onConnectAccount(account.platform)
                    }
                  >
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TabButton({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${active 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      {label}
    </button>
  );
}

function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) {
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

// Helper function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}