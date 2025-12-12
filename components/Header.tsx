import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Bell, LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onReset: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, user, onLogout }) => {
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-50 transition-colors duration-300 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 h-[64px] flex items-center justify-between">
        
        {/* Logo Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group min-w-[44px] min-h-[44px]"
          onClick={onReset}
          role="button"
          aria-label="Go to Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-black dark:bg-[#111] border border-gray-200 dark:border-accent-gold/30 flex items-center justify-center shadow-lg group-hover:shadow-accent-gold/20 transition-all duration-300">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-white dark:text-accent-gold logo-glow transition-all duration-500 transform group-hover:scale-110">
               <path 
                 d="M 65 25 C 50 15, 20 30, 30 60 C 35 75, 55 75, 50 50 L 50 85 M 50 50 C 60 40, 85 40, 80 60 C 75 75, 50 50, 85 85" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="8" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
               />
            </svg>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-gold rounded-full shadow-[0_0_8px_#FFD700] animate-pulse"></div>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-accent-gold transition-colors duration-300">
              Clinical<span className="text-gray-400 dark:text-gray-600">RAG</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-bold mt-0.5">Gemini 3 Pro</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 dark:hover:text-accent-gold transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 transition-all duration-300 relative min-w-[44px] min-h-[44px] flex items-center justify-center hidden sm:flex"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-red rounded-full border-2 border-white dark:border-black"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 pl-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all p-1"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black dark:from-accent-gold dark:to-yellow-600 flex items-center justify-center text-white dark:text-black font-bold text-xs shadow-lg border-2 border-white dark:border-[#333]">
                {user ? user.avatar : <UserIcon className="w-4 h-4" />}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#111] rounded-xl shadow-xl border border-gray-200 dark:border-[#333] animate-in slide-in-from-top-2 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-[#222]">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user ? user.name : 'Guest User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user ? user.email : 'guest@clinicalrag.ai'}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] flex items-center">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </button>
                  <div className="border-t border-gray-100 dark:border-[#222] my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
