'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Account = {
  platform: string;
  displayName: string;
  description: string;
  connected: boolean;
  username?: string;
};

type AccountsManagerProps = {
  accounts: Account[];
  onConnect: (platform: string) => Promise<void>;
  onDisconnect: (platform: string) => Promise<void>;
};

export default function AccountsManager({ accounts, onConnect, onDisconnect }: AccountsManagerProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleConnect = async (platform: string) => {
    setIsLoading(prev => ({ ...prev, [platform]: true }));
    try {
      await onConnect(platform);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleDisconnect = async (platform: string) => {
    setIsLoading(prev => ({ ...prev, [platform]: true }));
    try {
      await onDisconnect(platform);
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'facebook': return '👍';
      case 'instagram': return '📸';
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Connected Accounts" />
        <CardContent>
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-sm text-gray-500">No accounts connected yet.</div>
            ) : (
              accounts.map((account) => (
                <div key={account.platform} className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getPlatformIcon(account.platform)}</div>
                    <div>
                      <div className="font-medium capitalize">{account.displayName}</div>
                      <div className="text-xs text-gray-500">{account.description}</div>
                      {account.connected && account.username && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {account.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={account.connected ? "destructive" : "primary"}
                    onClick={() => account.connected ? handleDisconnect(account.platform) : handleConnect(account.platform)}
                    disabled={isLoading[account.platform]}
                  >
                    {isLoading[account.platform] ? 'Loading...' : account.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Account Management Tips" />
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Why connect accounts?</strong> Connecting your social media accounts allows the AI Content Manager to automatically post generated content to your profiles.
            </p>
            <p>
              <strong>Authentication methods:</strong> Different platforms use different authentication methods:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>OAuth:</strong> Securely connect without sharing your password (LinkedIn, Twitter)</li>
              <li><strong>Access Tokens:</strong> Use platform-generated tokens for Facebook Pages and Instagram Business</li>
            </ul>
            <p className="mt-3">
              <strong>Need help?</strong> Check our documentation for detailed instructions on connecting each platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}