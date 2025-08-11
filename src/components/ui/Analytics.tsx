"use client";

import { GeneratedPost } from "@/lib/api";
import { Card, CardContent, CardHeader } from "./Card";

type AnalyticsProps = {
  data: {
    posts: GeneratedPost[];

    postsPerPlatform: { platform: string; count: number }[];
    postsPerStatus: { status: string; count: number }[];
    topPerformingPosts: {
      id: number;
      platform: string;
      content: string;
      engagement: number;
    }[];
    engagementOverTime: Array<{ date: string; value: number }>;
  };
};

export default function Analytics({ data }: AnalyticsProps) {
  if (!data) return null;

  const {
    postsPerPlatform,
    postsPerStatus,
    topPerformingPosts,
    engagementOverTime,
  } = data;

  // Calculate total posts
  const totalPosts = postsPerPlatform.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Calculate platform percentages
  const platformPercentages = postsPerPlatform.map(
    ({ platform, count }) => ({
      platform,
      percentage: totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0,
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          description="All-time posts created"
          trend={+5}
        />
        <StatCard
          title="Posted"
          value={
            postsPerStatus.find((item) => item.status === "posted")?.count || 0
          }
          description="Successfully published"
          trend={+2}
        />
        <StatCard
          title="Scheduled"
          value={postsPerStatus.find((item) => item.status === "scheduled")?.count || 0}
          description="Waiting to be published"
          trend={0}
        />
        <StatCard
          title="Engagement Rate"
          value={`${calculateEngagementRate(engagementOverTime)}%`}
          description="Avg. across platforms"
          trend={+1.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Engagement Over Time" />
          <CardContent>
            <div className="h-64">
              <EngagementChart data={engagementOverTime} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Platform Distribution" />
          <CardContent>
            <div className="space-y-4">
              {platformPercentages?.map(({ platform, percentage }) => (
                <div key={platform} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{platform}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getPlatformColor(
                        platform
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Top Performing Posts" />
        <CardContent>
          {topPerformingPosts.length > 0 ? (
            <div className="space-y-4">
              {topPerformingPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border rounded-md bg-white dark:bg-black/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={post.platform} />
                      <span className="text-xs font-medium capitalize">
                        {post.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                      <span>+{post.engagement}</span>
                      <span className="text-xs">engagements</span>
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No performance data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add this section to display all posts */}
      <Card>
        <CardHeader title="All Posts" />
        <CardContent>
          {data.posts && data.posts.length > 0 ? (
            <div className="space-y-4">
              {data.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border rounded-md bg-white dark:bg-black/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={post.platform} />
                      <span className="text-xs font-medium capitalize">
                        {post.platform}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{post.status}</span>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No posts available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: number | string;
  description: string;
  trend: number;
}) {
  const trendColor =
    trend > 0
      ? "text-green-600 dark:text-green-400"
      : trend < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-600 dark:text-gray-400";

  const trendIcon = trend > 0 ? "↑" : trend < 0 ? "↓" : "→";

  return (
    <div className="rounded-lg border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {trend !== 0 && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trendIcon} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-2 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function EngagementChart({
  data,
}: {
  data: Array<{ date: string; value: number }>;
}) {
  // This is a simplified chart representation
  // In a real app, you would use a charting library like Chart.js or Recharts

  const maxValue = Math.max(...data.map((item) => item.value), 10);

  return (
    <div className="relative h-full flex items-end">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className="w-full max-w-[30px] bg-blue-500 dark:bg-blue-600 rounded-t-sm"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {formatDate(item.date)}
            </span>
          </div>
        );
      })}

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue / 2)}</span>
        <span>0</span>
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const className = "w-4 h-4";

  switch (platform) {
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
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
function calculateEngagementRate(
  data: Array<{ date: string; value: number }>
): number {
  if (data.length === 0) return 0;

  const totalEngagement = data.reduce((sum, item) => sum + item.value, 0);
  return Math.round((totalEngagement / data.length) * 100);
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case "twitter":
      return "bg-blue-400";
    case "linkedin":
      return "bg-blue-600";
    case "facebook":
      return "bg-blue-800";
    case "instagram":
      return "bg-pink-500";
    default:
      return "bg-gray-300";
  }
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
