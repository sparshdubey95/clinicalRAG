import React, { useState } from 'react';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGuest }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate real OAuth delay and popup feel
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-accent-gold selection:text-black flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
         <div className="flex items-center space-x-3">
             <div className="relative w-10 h-10 rounded-xl bg-black dark:bg-[#111] border border-gray-200 dark:border-accent-gold/30 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-white dark:text-accent-gold logo-glow">
                   <path d="M 65 25 C 50 15, 20 30, 30 60 C 35 75, 55 75, 50 50 L 50 85 M 50 50 C 60 40, 85 40, 80 60 C 75 75, 50 50, 85 85" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <span className="text-xl font-bold tracking-tight">Clinical<span className="text-gray-400">RAG</span></span>
         </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto mb-20">
         
         <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] mb-8 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-accent-gold mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-500">Powered by Gemini 3 Pro Vision</span>
         </div>

         <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            Your Personal <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-600">Medical AI Assistant</span>
         </h1>

         <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Upload medical reports, ask health questions, and find the cheapest medicines online. 
            All your data is encrypted and private.
         </p>

         <div className="flex flex-col items-center space-y-4 animate-slide-up w-full max-w-xs" style={{animationDelay: '0.3s'}}>
            <button 
               onClick={handleGoogleLogin}
               disabled={isLoggingIn}
               className="w-full h-14 rounded-full bg-white text-gray-700 font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center shadow-lg border border-gray-200 relative overflow-hidden group"
            >
               {isLoggingIn ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
               ) : (
                  <>
                     <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 mr-3 relative z-10" />
                     <span className="relative z-10">Sign in with Google</span>
                  </>
               )}
            </button>
            
            <div className="flex items-center w-full">
               <div className="flex-1 border-t border-gray-200 dark:border-[#222]"></div>
               <span className="px-3 text-xs text-gray-400 uppercase">Or</span>
               <div className="flex-1 border-t border-gray-200 dark:border-[#222]"></div>
            </div>

            <button 
              onClick={onGuest}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
            >
               Continue as Guest (Limited Features)
            </button>
         </div>
         
         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {[
               { icon: ShieldCheck, title: "Private & Secure", desc: "Enterprise-grade encryption for all your medical data." },
               { icon: Zap, title: "Instant Analysis", desc: "Get complex reports explained in seconds." },
               { icon: Activity, title: "Health Tracking", desc: "Monitor vitals and lab trends over time." }
            ].map((feature, i) => (
               <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                  <feature.icon className="w-8 h-8 text-accent-gold mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
               </div>
            ))}
         </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-200 dark:border-[#1A1A1A] text-center text-xs text-gray-400">
         <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact Support</a>
         </div>
         <p>© 2025 ClinicalRAG. All rights reserved. Not for emergency use.</p>
      </footer>

    </div>
  );
};
