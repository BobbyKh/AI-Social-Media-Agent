"use client";

import { useState, useEffect } from "react";
import Analytics from "@/components/ui/Analytics";
import { fetchPosts } from "@/lib/api";
import { GeneratedPost } from "@/lib/api";

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Mock analytics data
  const analyticsData = {
    postsPerPlatform: [
      { platform: "twitter", count: 12 },
      { platform: "linkedin", count: 8 },
      { platform: "facebook", count: 5 },
      { platform: "instagram", count: 3 },
    ],
    postsPerStatus: [
      { status: "pending", count: 4 },
      { status: "ready", count: 7 },
      { status: "scheduled", count: 10 },
      { status: "posted", count: 7 },
    ],
    topPerformingPosts: [
      {
        id: 1,
        platform: "twitter",
        content: "AI is revolutionizing content creation!",
        engagement: 245,
      },
      {
        id: 2,
        platform: "linkedin",
        content: "How machine learning is changing the way we work",
        engagement: 187,
      },
      {
        id: 3,
        platform: "facebook",
        content: "5 ways to automate your social media presence",
        engagement: 132,
      },
    ],
    engagementOverTime: [
      { date: "2023-01-01", value: 120 },
      { date: "2023-01-02", value: 145 },
      { date: "2023-01-03", value: 132 },
      { date: "2023-01-04", value: 167 },
      { date: "2023-01-05", value: 189 },
      { date: "2023-01-06", value: 210 },
      { date: "2023-01-07", value: 178 },
    ],
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Analytics
          data={{
            ...analyticsData,
            posts, // Pass the fetched posts to the Analytics component
          }}
        />
      )}
    </div>
  );
}
