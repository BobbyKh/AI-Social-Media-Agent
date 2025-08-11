"use client";
import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, error, loading } = useUser();

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setSuccessMessage('Registration successful! Please check your email to verify your account before logging in.');
    }
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    const success = await login(username, password);
    if (success) {
      router.push('/accounts');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
      <div className="bg-gray-900/95 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md relative overflow-hidden border border-gray-800">
        {/* Decorative Blobs */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-gradient-to-tr from-blue-800 via-indigo-700 to-purple-700 opacity-20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-gradient-to-br from-indigo-800 via-blue-800 to-cyan-800 opacity-20 rounded-full blur-3xl z-0"></div>
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-blue-700 to-indigo-700 rounded-full p-3 shadow-lg mb-3">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#18181b" />
                <path d="M8 12l2 2 4-4" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-1 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-gray-800 text-gray-100 placeholder-gray-400"
                placeholder="Enter your username"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-gray-800 text-gray-100 placeholder-gray-400"
                placeholder="Enter your password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {successMessage && (
              <div className="text-sm text-green-400 bg-green-900/30 border border-green-700 rounded-md px-3 py-2">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <Button
              className={`w-full py-2.5 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md hover:from-blue-800 hover:to-indigo-800 transition-colors ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-xs text-gray-400">
            <span>Don&apos;t have an account? </span>
            <a href="/auth/register" className="text-blue-400 font-semibold hover:underline">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
