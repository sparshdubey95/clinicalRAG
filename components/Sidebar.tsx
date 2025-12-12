import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Pill, 
  Settings, 
  LogOut, 
  X,
  User as UserIcon,
  Sparkles,
  FileText,
  Scan,
  Video
} from 'lucide-react';
import { UserProfile, View, FileAttachment } from '../types';

interface SidebarProps {
  user: UserProfile | null;
  currentView: View;
  uploadedFiles: FileAttachment[];
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  currentView, 
  uploadedFiles,
  onNavigate, 
  onLogout,
  isOpen,
  onClose
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'medicines', label: 'My Medicines', icon: Pill },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#222] transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-[64px] flex items-center px-6 border-b border-gray-200 dark:border-[#222]">
            <div className="flex items-center space-x-2">
               <div className="relative w-8 h-8 rounded-lg bg-black dark:bg-[#111] border border-gray-200 dark:border-accent-gold/30 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-5 h-5 text-white dark:text-accent-gold logo-glow">
                   <path d="M 65 25 C 50 15, 20 30, 30 60 C 35 75, 55 75, 50 50 L 50 85 M 50 50 C 60 40, 85 40, 80 60 C 75 75, 50 50, 85 85" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
               </div>
               <span className="font-bold text-lg tracking-tight">Clinical<span className="text-gray-400">RAG</span></span>
            </div>
            <button onClick={onClose} className="md:hidden ml-auto text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-[#151515] rounded-xl p-3 border border-gray-200 dark:border-[#222] flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.avatar || <UserIcon className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Basic Plan</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as View);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${currentView === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#151515] hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-[#222]">
              <div className="px-3 py-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Uploaded Reports</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {uploadedFiles.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No files uploaded yet</p>
                  ) : (
                    uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer p-1.5 rounded hover:bg-gray-50 dark:hover:bg-[#151515] group">
                         {file.type === 'image' ? (
                           <Scan className="w-3.5 h-3.5 text-purple-500 mr-2 flex-shrink-0" />
                         ) : file.type === 'video' ? (
                           <Video className="w-3.5 h-3.5 text-orange-500 mr-2 flex-shrink-0" />
                         ) : (
                           <FileText className="w-3.5 h-3.5 text-blue-500 mr-2 flex-shrink-0" />
                         )}
                         <span className="truncate">{file.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-[#222]">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};