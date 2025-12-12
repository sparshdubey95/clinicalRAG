import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  Star, 
  ExternalLink,
  Shield,
  Bell,
  Download,
  FileText,
  Clock,
  Save,
  Lock,
  Mail
} from 'lucide-react';
import { SavedMedicine, ChatSession, UserProfile } from '../types';

// --- HISTORY VIEW ---
interface HistoryViewProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ sessions, onSelectSession, onDeleteSession }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h2>
          <p className="text-gray-500 dark:text-gray-400">Your past medical consultations and reports</p>
        </div>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#333] text-sm focus:ring-2 focus:ring-accent-gold focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-[#111] rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No history yet. Start a new analysis!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-[#222] hover:border-accent-gold dark:hover:border-accent-gold transition-colors group cursor-pointer relative">
              <div className="flex items-start justify-between" onClick={() => onSelectSession(session)}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-accent-gold transition-colors">{session.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 max-w-xl">{session.preview}</p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(session.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.messages.length} messages</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent-gold" />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                className="absolute top-4 right-12 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MEDICINES VIEW ---
interface MedicinesViewProps {
  medicines: SavedMedicine[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export const MedicinesView: React.FC<MedicinesViewProps> = ({ medicines, onToggleFavorite, onRemove }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Medicines</h2>
          <p className="text-gray-500 dark:text-gray-400">Track prescribed medications and prices</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-bold text-sm cursor-not-allowed group relative">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export List</span>
           <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">Coming Soon</div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.length === 0 ? (
           <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-[#111] rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
             <div className="w-12 h-12 bg-gray-100 dark:bg-[#222] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💊</span>
             </div>
             <p className="text-gray-500 font-medium">No saved medicines found.</p>
             <p className="text-sm text-gray-400">Ask the AI to "find cheapest medicine" to add one.</p>
           </div>
        ) : (
          medicines.map((med) => (
            <div key={med.id} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-200 dark:border-[#222] hover:shadow-lg transition-shadow relative group">
               <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{med.name}</h3>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mt-1">
                      {med.strength}
                    </span>
                  </div>
                  <button 
                    onClick={() => onToggleFavorite(med.id)}
                    className={`p-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#222] transition-colors ${med.isFavorite ? 'text-accent-gold fill-current' : 'text-gray-300'}`}
                  >
                    <Star className="w-5 h-5" fill={med.isFavorite ? "currentColor" : "none"} />
                  </button>
               </div>
               
               <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-3">{med.quantity}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full mr-3"></span>
                  <span>Added {new Date(med.dateAdded).toLocaleDateString()}</span>
               </div>
               
               <div className="space-y-2">
                 {med.prices.slice(0, 2).map((price, idx) => (
                   <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-[#181818] rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{price.name}</span>
                      <div className="flex items-center">
                        <span className={`font-bold mr-2 ${price.isCheapest ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>₹{price.price}</span>
                        {price.isCheapest && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">BEST</span>}
                      </div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#222] flex justify-between items-center">
                  <button onClick={() => onRemove(med.id)} className="text-xs text-red-400 hover:text-red-500 font-medium">Remove</button>
                  <button className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center">
                    Compare Prices <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- SETTINGS VIEW ---
interface SettingsViewProps {
  user: UserProfile | null;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUpdateProfile: (name: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onLogout, onDeleteAccount, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveName = () => {
    if (displayName.trim()) {
      onUpdateProfile(displayName);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h2>
      
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-[#222]">
           <h3 className="font-bold text-lg mb-4">Profile</h3>
           <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl text-white font-bold">
                 {user?.avatar}
              </div>
              <div className="flex-1">
                 <p className="font-bold text-xl">{user?.name}</p>
                 <p className="text-gray-500">{user?.email}</p>
              </div>
           </div>
        </div>
        
        <div className="p-6 space-y-8">
           {/* Display Name Edit Section */}
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                  className={`flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#151515] border ${isEditing ? 'border-accent-gold' : 'border-gray-200 dark:border-[#333]'} text-gray-900 dark:text-white focus:outline-none`} 
                />
                {isEditing ? (
                  <button 
                    onClick={handleSaveName}
                    className="bg-accent-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
           </div>
           
           {/* Coming Soon Section - Medicine Reminders */}
           <div className="border border-dashed border-gray-200 dark:border-[#333] rounded-xl p-5 bg-gray-50/50 dark:bg-[#151515]/50 relative overflow-hidden">
              <div className="flex items-start space-x-4 opacity-50">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Medicine Reminders</h4>
                    <p className="text-sm text-gray-500 mt-1">Push notifications for medicine doses. Calendar integration.</p>
                 </div>
                 <div className="relative inline-block w-12 align-middle select-none">
                     <div className="block w-6 h-6 rounded-full bg-gray-300 cursor-not-allowed transform translate-x-full"></div>
                 </div>
              </div>
              
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[2px]">
                 <div className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl mb-3">
                    <Lock className="w-3 h-3" />
                    <span>Coming Jan 2026</span>
                 </div>
                 <button className="flex items-center space-x-2 text-xs font-bold text-gray-800 dark:text-white hover:underline">
                    <Mail className="w-3 h-3" />
                    <span>Notify me when ready</span>
                 </button>
              </div>
           </div>
           
           <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                    <Shield className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="font-medium text-gray-900 dark:text-white">Data Privacy</p>
                    <p className="text-xs text-gray-500">Allow anonymous analytics for research</p>
                 </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle2" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked/>
                  <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-green-400 cursor-pointer"></label>
              </div>
           </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-[#151515] border-t border-gray-200 dark:border-[#222] flex justify-between items-center">
           <button 
             onClick={() => {
               if(window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                 onDeleteAccount();
               }
             }}
             className="text-sm text-red-500 hover:text-red-600 font-medium"
           >
             Delete My Account & Data
           </button>
           <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold">Sign Out</button>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-8">
         ClinicalRAG Version 2.4.0 • Gemini 3 Pro Vision Integration
      </p>
    </div>
  );
};