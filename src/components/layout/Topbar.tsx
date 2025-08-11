"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/lib/userContext";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Search, LogOut, Settings, User } from 'lucide-react';

export default function Topbar() {
  const [search, setSearch] = useState("");
  const { user, logout, loading } = useUser();
  console.log('User:', user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-white/70 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-10">
      <div className="flex items-center gap-2 md:hidden">
        <button aria-label="Menu" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5">☰</button>
        <span className="font-semibold">AI Content Manager</span>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="text-sm px-3 py-1.5 rounded-md border bg-transparent w-56 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:inline-block">{user.username}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                <div className="px-4 py-2 border-b dark:border-gray-700">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Link href="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login">
            <Button size="sm">Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}


