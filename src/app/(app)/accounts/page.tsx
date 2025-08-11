'use client';

import { useState } from 'react';
import AccountsManager from "@/components/ui/AccountsManager";

export default function AccountsPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  
  const [accounts, setAccounts] = useState([
    {
      platform: 'twitter',
      displayName: 'Twitter',
      description: 'Post tweets to your timeline',
      connected: false,
    },
    {
      platform: 'linkedin',
      displayName: 'LinkedIn',
      description: 'Share professional updates',
      connected: false,
    },
    {
      platform: 'facebook',
      displayName: 'Facebook',
      description: 'Post to your page',
      connected: false,
    },
    {
      platform: 'instagram',
      displayName: 'Instagram',
      description: 'Share photos and updates',
      connected: false,
    },
  ]);

  const handleConnect = async (platform: string) => {
    // In a real implementation, you would handle OAuth flow or token input
    console.log(`Connecting to ${platform}`);
    
    // For demo purposes, we'll simulate a successful connection
    setAccounts(prev => prev.map(account => {
      if (account.platform === platform) {
        return {
          ...account,
          connected: true,
          username: platform === 'twitter' ? '@aicontentpro' : 
                   platform === 'linkedin' ? 'AI Content Pro' : 
                   platform === 'facebook' ? 'AI Content Pro Page' : 
                   'aicontentpro'
        };
      }
      return account;
    }));
  };

  const handleDisconnect = async (platform: string) => {
    // In a real implementation, you would call your API to disconnect
    console.log(`Disconnecting from ${platform}`);
    
    setAccounts(prev => prev.map(account => {
      if (account.platform === platform) {
        return {
          ...account,
          connected: false,
          username: undefined
        };
      }
      return account;
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Social Media Accounts</h1>
      <AccountsManager
        accounts={accounts}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}


