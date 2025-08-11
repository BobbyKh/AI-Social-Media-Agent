'use client';

import { useState } from 'react';
import Settings from "@/components/ui/Settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    ai: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
      autoModeration: true
    },
    scheduling: {
      defaultInterval: 60,
      preferredTimes: ['9:00', '12:00', '15:00', '18:00']
    },
    accounts: {
      twitter: { connected: true, username: '@aicontentpro' },
      linkedin: { connected: true, username: 'AI Content Pro' },
      facebook: { connected: false, username: '' },
      instagram: { connected: false, username: '' }
    }
  });

  const handleUpdateSettings = async (newSettings: any) => {
    // In a real implementation, you would call your API
    console.log('Updating settings:', newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleConnectAccount = async (platform: string) => {
    // In a real implementation, you would redirect to OAuth flow
    console.log(`Connecting to ${platform}`);
    
    // Mock successful connection
    setSettings(prev => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [platform]: { 
          connected: true, 
          username: platform === 'twitter' ? '@aicontentpro' : 
                   platform === 'linkedin' ? 'AI Content Pro' : 
                   platform === 'facebook' ? 'AI Content Pro' : 
                   'aicontentpro'
        }
      }
    }));
  };

  const handleDisconnectAccount = async (platform: string) => {
    // In a real implementation, you would call your API
    console.log(`Disconnecting from ${platform}`);
    
    setSettings(prev => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [platform]: { connected: false, username: '' }
      }
    }));
  };

  return (
    <div className="p-6">
      <Settings
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onConnectAccount={handleConnectAccount}
        onDisconnectAccount={handleDisconnectAccount}
      />
    </div>
  );
}


