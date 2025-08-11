"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  username: string;
  email: string;
  plan: string;
  is_trial_active: boolean;
  is_subscription_active: boolean;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
        }/api/auth/profile/`,
        {
          method: "GET",
          credentials: "include", // send cookies automatically
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          return;
        }
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError(err.message || "Failed to fetch user profile");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
        }/api/token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Login failed (${res.status})`);
      }

      const data = await res.json();

      // Store tokens in cookies (handled by the server)
      document.cookie = `access=${data.access}; path=/; max-age=1800; SameSite=Lax`;
      document.cookie = `refresh=${data.refresh}; path=/; max-age=86400; SameSite=Lax`;

      // Fetch user profile after successful login
      await fetchUserProfile();
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear cookies
      document.cookie = "access=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "refresh=; path=/; max-age=0; SameSite=Lax";

      setUser(null);
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Error during logout:", err);
      setError(err.message || "Logout failed");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, login, logout, fetchUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
