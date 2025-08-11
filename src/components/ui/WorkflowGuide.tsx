'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './Card';
import Button from './Button';

export default function WorkflowGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      step: 1,
      title: 'Get Topics',
      description: 'Fetch trending topics or create your own',
      icon: '📝',
      actions: ['Click "Fetch Trending" to get AI-suggested topics', 'Or manually add topics in the sidebar']
    },
    {
      step: 2,
      title: 'Create Post',
      description: 'Navigate to the Posts section',
      icon: '📝',
      actions: ['Click "Create Post" on any topic', 'This will take you to the Posts page with the topic pre-filled']
    },
    {
      step: 3,
      title: 'Generate Content',
      description: 'Use the Posts section to create content',
      icon: '✨',
      actions: ['Choose your platform (Twitter, LinkedIn, etc.)', 'Set tone and options', 'Generate AI-powered content']
    },
    {
      step: 4,
      title: 'Schedule & Publish',
      description: 'Manage your content workflow',
      icon: '📅',
      actions: ['Schedule posts for later', 'Review post history', 'Track performance and engagement']
    }
  ];

  return (
    <Card className="mb-6">
             <CardHeader 
         title="How to Generate Posts from Topics"
         action={
           <Button
             variant="ghost"
             size="sm"
             onClick={() => setIsExpanded(!isExpanded)}
           >
             {isExpanded ? 'Hide' : 'Show'} Guide
           </Button>
         }
       />
      
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-1">
                    {step.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tips</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use trending topics for better engagement</li>
                  <li>• Experiment with different tones for different platforms</li>
                  <li>• Add custom instructions for more specific content</li>
                  <li>• Save successful posts as templates for future use</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
