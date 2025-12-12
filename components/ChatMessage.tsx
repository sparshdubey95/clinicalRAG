import React, { useState } from 'react';
import { 
  User, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  FileText, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Copy,
  Info,
  Pill
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { Dashboard } from './Dashboard';
import { MedicineCard } from './MedicineCard';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showTechnical, setShowTechnical] = useState(false);

  if (isUser) {
    return (
      <div className="flex w-full justify-end animate-slide-up mb-6">
        <div className="flex max-w-[90%] md:max-w-[80%] flex-row-reverse">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-accent-blue ml-3 md:ml-4 flex items-center justify-center shadow-lg border-2 border-white dark:border-[#222]">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="bg-accent-blue text-white p-4 md:p-5 rounded-3xl rounded-tr-none shadow-md">
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {message.attachments.map((att, idx) => (
                   <div key={idx} className="flex items-center bg-white/20 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                      <FileText className="w-3.5 h-3.5 mr-2" />
                      {att.name}
                   </div>
                ))}
              </div>
            )}
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
            <p className="text-[10px] text-blue-100 mt-2 text-right opacity-80 font-medium tracking-wide">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AI RESPONSE RENDERING
  return (
    <div className="flex w-full justify-start animate-slide-up group mb-6">
      <div className="flex max-w-[98%] md:max-w-[90%] flex-row">
        
        {/* AI Avatar */}
        <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-black dark:bg-[#151515] mr-3 md:mr-4 flex items-center justify-center shadow-card border border-gray-200 dark:border-accent-gold/30 mt-1">
           {/* Mini Logo SVG */}
           <svg viewBox="0 0 100 100" className="w-5 h-5 text-white dark:text-accent-gold">
              <path d="M 65 25 C 50 15, 20 30, 30 60 C 35 75, 55 75, 50 50 L 50 85 M 50 50 C 60 40, 85 40, 80 60 C 75 75, 50 50, 85 85" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>

        {/* Main Content Card */}
        <div className="flex flex-col w-full min-w-0">
           <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-sm font-bold text-gray-900 dark:text-white">ClinicalRAG</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#222] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#333] font-semibold tracking-wide">Gemini 3 Pro</span>
           </div>

           <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl rounded-tl-none shadow-card overflow-hidden relative">
              
              {/* Left Accent Border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold shadow-[0_0_10px_#FFD700]"></div>

              <div className="p-4 md:p-6 space-y-6">
                 
                 {/* Section 1: Simple Explanation */}
                 <div className="prose dark:prose-invert max-w-none">
                    {message.simpleExplanation ? (
                       <div className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {message.simpleExplanation}
                       </div>
                    ) : (
                       // Fallback for standard chat messages
                       <div className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {message.text}
                       </div>
                    )}
                 </div>

                 {/* Section 2: Visual Analysis (Dashboard Injection) */}
                 {message.visualData && (
                    <div className="my-6">
                       <div className="flex items-center mb-3">
                          <Activity className="w-4 h-4 text-accent-gold mr-2" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Visual Analysis</h4>
                       </div>
                       <Dashboard data={message.visualData} />
                    </div>
                 )}

                 {/* Section 2.5: Medicine Price Comparison (New) */}
                 {message.medicineData && (
                    <div className="my-6">
                       <div className="flex items-center mb-3">
                          <Pill className="w-4 h-4 text-accent-gold mr-2" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Medicine Finder</h4>
                       </div>
                       <MedicineCard data={message.medicineData} />
                    </div>
                 )}

                 {/* Section 3: Action Items */}
                 {message.actionItems && message.actionItems.length > 0 && (
                    <div className="bg-gray-50 dark:bg-[#181818] rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-[#252525]">
                       <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-accent-orange mr-2" />
                          Recommended Actions
                       </h4>
                       <ul className="space-y-3">
                          {message.actionItems.map((item, idx) => (
                             <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                <div className="min-w-[6px] h-[6px] rounded-full bg-accent-blue dark:bg-accent-gold mt-2 mr-3 shadow-[0_0_5px_currentColor]"></div>
                                {item}
                             </li>
                          ))}
                       </ul>
                    </div>
                 )}

                 {/* Section 4: Technical Details (Collapsible) */}
                 {message.technicalDetails && (
                    <div className="border-t border-gray-100 dark:border-[#222] pt-4">
                       <button 
                          onClick={() => setShowTechnical(!showTechnical)}
                          className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-accent-gold transition-colors uppercase tracking-wide"
                       >
                          {showTechnical ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                          {showTechnical ? 'Hide Medical Reference' : 'Show Medical Reference (For Doctors)'}
                       </button>
                       
                       {showTechnical && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-[#000] rounded-xl text-xs font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#333] animate-slide-up shadow-inner">
                             {message.technicalDetails}
                          </div>
                       )}
                    </div>
                 )}
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 dark:bg-[#151515] px-4 md:px-5 py-3 flex justify-between items-center border-t border-gray-100 dark:border-[#222]">
                 <div className="flex space-x-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-400 hover:text-accent-blue transition-colors">
                       <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-400 hover:text-accent-red transition-colors">
                       <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-400 hover:text-white transition-colors">
                       <Copy className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="flex items-center text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <Info className="w-3 h-3 mr-1.5" />
                    AI generated • Consult a doctor
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};
