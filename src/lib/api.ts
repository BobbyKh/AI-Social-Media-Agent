export type GeneratedPost = {
  id: number;
  platform: string;
  content: string;
  image_url: string;
  scheduled_for: string | null;
  status: string;
  external_id: string;
  created_at: string;
  updated_at: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchPosts(): Promise<GeneratedPost[]> {
  const res = await fetch(`${API_BASE}/api/content/posts/`, {
    method: "GET",
    credentials: "include", // 🔹 important: send cookies
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }

  return res.json();
}

export async function createGeneratedPost(
  postData: Omit<GeneratedPost, "id" | "created_at" | "updated_at">
): Promise<GeneratedPost> {
  const res = await fetch(`${API_BASE}/api/auth/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
    credentials: "include", // 🔹 important: send cookies
  });

  if (!res.ok) {
    throw new Error(`Failed to create post: ${res.status}`);
  }

  return res.json();
}
export async function getUserDashboard(): Promise<GeneratedPost[]> {
  const res = await fetch(`${API_BASE}/api/auth/dashboard/`, {
    method: "GET",
    credentials: "include", // 🔹 important: send cookies
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard posts: ${res.status}`);
  }

  return res.json();
}
