"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'}/api/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed. Please check your connection and try again.');
    }
  };

  const resendVerification = async () => {
    // This would need the user's email, so we'd need to store it or ask for it
    setMessage('Please contact support to resend verification email.');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verifying your email...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className={`p-6 rounded-lg ${
          status === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className={`text-6xl mb-4 ${
            status === 'success' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {status === 'success' ? '✓' : '✗'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          
          {status === 'success' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can now log in to your account.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you need a new verification link, please contact support.
              </p>
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={resendVerification}
                >
                  Resend Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
