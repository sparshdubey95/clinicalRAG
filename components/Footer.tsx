import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
        <div className="flex items-center space-x-1">
          <span>Powered by</span>
          <span className="font-semibold text-slate-700 flex items-center">
            Google Gemini 3 Pro <Sparkles className="w-3 h-3 ml-1 text-blue-500" />
          </span>
        </div>
        <div className="mt-2 md:mt-0">
          MedVision Pro © 2025 • For Demonstration Purposes Only
        </div>
      </div>
    </footer>
  );
};