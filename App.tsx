import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  ArrowUp, 
  X, 
  AlertTriangle,
  Sparkles,
  ArrowRight,
  WifiOff,
  AlertCircle,
  Menu
} from 'lucide-react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { HistoryView, MedicinesView, SettingsView } from './components/Views';
import { ChatMessage as ChatMessageType, FileAttachment, DemoScenario, UserProfile, AppState, View, SavedMedicine, ChatSession, AnalysisResult } from './types';
import { DEMO_SCENARIOS } from './constants';
import { analyzeMedicalCase, chatWithMedicalContext } from './services/geminiService';

// Simple Toast Notification Component
const Toast: React.FC<{ message: string; type: 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 animate-slide-up border ${
      type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'
    }`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-50 hover:opacity-100" /></button>
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Data State
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [savedMedicines, setSavedMedicines] = useState<SavedMedicine[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Real Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  
  // UI State
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'info'} | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New: Track uploaded files for sidebar
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([
    { name: 'sample1.pdf', type: 'report', isDemo: true },
    { name: 'sample2.pdf', type: 'report', isDemo: true },
    { name: 'sample3.pdf', type: 'image', isDemo: true },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- PERSISTENCE & INIT ---

  // 1. Load User on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('clinical_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAppState(AppState.DASHBOARD);
    }
  }, []);

  // 2. Load User Data when User Changes
  useEffect(() => {
    if (user) {
      // Load specific data for this user ID
      const userMeds = localStorage.getItem(`clinical_medicines_${user.id}`);
      if (userMeds) setSavedMedicines(JSON.parse(userMeds));
      else setSavedMedicines([]);

      const userSessions = localStorage.getItem(`clinical_sessions_${user.id}`);
      if (userSessions) setSessions(JSON.parse(userSessions));
      else setSessions([]);
    } else {
      // Clear data if guest or logged out to prevent leaking
      setSavedMedicines([]);
      setSessions([]);
    }
  }, [user]);

  // 3. Save Data when it changes (Scoped to User)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`clinical_medicines_${user.id}`, JSON.stringify(savedMedicines));
    }
  }, [savedMedicines, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`clinical_sessions_${user.id}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  // Network Monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, currentView]);


  // --- HANDLERS ---

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    setToast({ message, type });
  };

  const handleLogin = () => {
    // Check for saved display name or use default
    const savedName = localStorage.getItem('userDisplayName') || 'Alex Mercer';
    
    const mockUser: UserProfile = {
      id: 'u123',
      name: savedName,
      email: 'alex.mercer@gmail.com',
      avatar: savedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };
    setUser(mockUser);
    localStorage.setItem('clinical_user', JSON.stringify(mockUser));
    setAppState(AppState.DASHBOARD);
    setCurrentView('dashboard');
  };

  const updateUserProfile = (name: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() };
    setUser(updatedUser);
    localStorage.setItem('clinical_user', JSON.stringify(updatedUser));
    localStorage.setItem('userDisplayName', name);
    showToast("Profile updated successfully.", "info");
  };

  const handleGuest = () => {
    setUser(null);
    setAppState(AppState.DASHBOARD);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('clinical_user');
    // Clear in-memory state
    setUser(null);
    setMessages([]);
    setSessions([]);
    setSavedMedicines([]);
    setCurrentAnalysis(null);
    setAppState(AppState.LANDING);
  };

  const handleDeleteAccount = () => {
    if (user) {
      localStorage.removeItem(`clinical_medicines_${user.id}`);
      localStorage.removeItem(`clinical_sessions_${user.id}`);
      localStorage.removeItem('userDisplayName');
    }
    handleLogout();
    showToast("Account and data deleted successfully.", "info");
  };

  // Session Management
  const saveCurrentSession = () => {
    if (messages.length === 0) return;
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: messages[0].text?.substring(0, 40) + '...' || 'Medical Analysis',
      date: new Date(),
      preview: messages[messages.length - 1].text?.substring(0, 60) + '...' || 'No preview',
      messages: [...messages]
    };
    setSessions(prev => [newSession, ...prev]);
    setMessages([]); // Clear current chat
    setActiveScenario(null);
    setCurrentAnalysis(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       
       if (file.size > 50 * 1024 * 1024) {
         showToast(`File "${file.name}" is too large. Limit is 50MB.`);
         return;
       }

       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
       if (!allowedTypes.some(t => file.type.includes(t.split('/')[1]))) { 
          if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf') {
             showToast("Unsupported file type.", 'error');
             return;
          }
       }

       let type: 'report' | 'image' | 'video' = 'report';
       if (file.type.startsWith('image/')) type = 'image';
       else if (file.type.startsWith('video/')) type = 'video';

       const newAtt: FileAttachment = {
         file,
         name: file.name,
         type,
         previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined
       };
       setAttachments(prev => [...prev, newAtt]);
       
       // Add to sidebar list
       setUploadedFiles(prev => [newAtt, ...prev]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setCurrentAnalysis(scenario.mockAnalysis);
    setInputValue(scenario.prompt);
    
    // Add demo attachment if applicable
    if (scenario.mockAttachment) {
      setAttachments([scenario.mockAttachment]);
    }

    // Focus text area for editing
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSubmit = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isProcessing) return;
    
    if (isOffline) {
      showToast("You are offline.", "error");
      return;
    }

    const lowerInput = inputValue.toLowerCase();
    
    if (lowerInput.includes('suicide') || lowerInput.includes('kill myself') || lowerInput.includes('chest pain') || lowerInput.includes('severe bleeding')) {
       showToast("🚑 EMERGENCY DETECTED: Calling emergency services is recommended.", "error");
    }

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      text: inputValue,
      attachments: [...attachments],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]); // Clear attachments from input after sending
    setIsProcessing(true);

    try {
        // STRICT CHECK: Is this a demo attachment?
        const isDemoAttachment = attachments.some(a => a.isDemo);

        // 1. DEMO MODE HANDLER
        if (activeScenario && isDemoAttachment) {
             await new Promise(resolve => setTimeout(resolve, 1500));
      
             const aiMsg: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                type: 'analysis',
                text: '',
                simpleExplanation: activeScenario.mockResponse.simple,
                actionItems: activeScenario.mockResponse.actions,
                technicalDetails: activeScenario.mockResponse.technical,
                visualData: activeScenario.mockAnalysis,
                medicineData: activeScenario.id === 'medicine' ? activeScenario.mockAnalysis.findings[0] as any : undefined,
                timestamp: new Date()
              };
              
              if (activeScenario.id === 'medicine') {
                const { MEDICINE_DETAILS_MOCK } = await import('./constants');
                aiMsg.medicineData = MEDICINE_DETAILS_MOCK;
                
                // Auto-save medicine if not duplicate
                const newMed: SavedMedicine = {
                  ...MEDICINE_DETAILS_MOCK,
                  id: Date.now().toString(),
                  dateAdded: new Date(),
                  isFavorite: false
                };
                if (!savedMedicines.find(m => m.name === newMed.name)) {
                   setSavedMedicines(prev => [newMed, ...prev]);
                }
              }

              setMessages(prev => [...prev, aiMsg]);
        } 
        // 2. REAL ANALYSIS MODE
        else {
             let analysisContext = currentAnalysis;
             let isNewAnalysis = false;
             
             // If files are attached, perform analysis first
             if (attachments.length > 0) {
                 const report = attachments.find(a => a.type === 'report')?.file || null;
                 const image = attachments.find(a => a.type === 'image')?.file || null;
                 const video = attachments.find(a => a.type === 'video')?.file || null;
                 
                 // Only run full analysis if there is actual content
                 if (report || image || video) {
                    try {
                        analysisContext = await analyzeMedicalCase(report, image, video);
                        setCurrentAnalysis(analysisContext);
                        isNewAnalysis = true;
                    } catch (err: any) {
                        showToast(err.message || "Failed to analyze files", "error");
                        setIsProcessing(false);
                        return;
                    }
                 }
             }

             // Safe Fallback: Empty context if nothing exists yet
             // This GUARANTEES no "fake diabetes" data from constants.ts is used
             const safeContext = analysisContext || {
                patientName: "Guest",
                patientId: "N/A",
                age: 0,
                vitals: { bp: "-", heartRate: "-", temperature: "-", spo2: "-" },
                riskLevel: "low",
                riskScore: 0,
                summary: "No medical data has been uploaded yet.",
                findings: [],
                annotations: [],
                recommendations: [],
             } as AnalysisResult;

             // Generate Chat Response
             // If we just analyzed a file, prompt AI to explain it naturally
             const query = (isNewAnalysis && (!userMessage.text || userMessage.text.length < 5)) 
                ? "Please analyze these documents and explain the findings simply." 
                : userMessage.text || "";

             const responseText = await chatWithMedicalContext(
                messages, 
                query, 
                safeContext
              );
              
              const aiMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                type: 'analysis', // Use analysis type to trigger dashboard
                text: responseText, // The rich text response from chatWithMedicalContext
                visualData: isNewAnalysis ? safeContext : undefined, // Only update dashboard on new analysis
                timestamp: new Date()
              };
              setMessages(prev => [...prev, aiMessage]);
        }

    } catch (error: any) {
       console.error(error);
       showToast(error.message || "Failed to generate response.", 'error');
    } finally {
      setIsProcessing(false);
      // Do not clear activeScenario here immediately to allow conversation continuation
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --- RENDER ---
  
  if (appState === AppState.LANDING) {
    return <LandingPage onLogin={handleLogin} onGuest={handleGuest} />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#000000] text-gray-900 dark:text-white font-sans transition-colors duration-500 overflow-hidden">
      
      <Sidebar 
        user={user} 
        currentView={currentView}
        uploadedFiles={uploadedFiles}
        onNavigate={(view) => {
          if (view !== 'dashboard' && messages.length > 0) saveCurrentSession();
          setCurrentView(view);
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#0A0A0A]">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2">
             <Menu className="w-6 h-6" />
           </button>
           <span className="font-bold">ClinicalRAG</span>
           <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-gray-800 text-white text-xs py-1 text-center flex items-center justify-center animate-in slide-in-from-top">
            <WifiOff className="w-3 h-3 mr-2" />
            You are currently offline.
          </div>
        )}

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50/50 dark:bg-black">
          
          {currentView === 'history' && (
            <HistoryView 
              sessions={sessions} 
              onSelectSession={(s) => {
                setMessages(s.messages);
                setCurrentView('dashboard');
              }}
              onDeleteSession={(id) => setSessions(prev => prev.filter(s => s.id !== id))}
            />
          )}

          {currentView === 'medicines' && (
             <MedicinesView 
               medicines={savedMedicines}
               onToggleFavorite={(id) => setSavedMedicines(prev => prev.map(m => m.id === id ? {...m, isFavorite: !m.isFavorite} : m))}
               onRemove={(id) => setSavedMedicines(prev => prev.filter(m => m.id !== id))}
             />
          )}

          {currentView === 'settings' && (
            <SettingsView 
              user={user} 
              onLogout={handleLogout} 
              onDeleteAccount={handleDeleteAccount}
              onUpdateProfile={updateUserProfile}
            />
          )}

          {currentView === 'dashboard' && (
            <div className="max-w-4xl mx-auto min-h-full flex flex-col pt-4 md:pt-8 px-4 pb-4">
              {messages.length === 0 ? (
                // EMPTY DASHBOARD STATE
                <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-8 animate-in fade-in zoom-in duration-700">
                  <div className="text-center space-y-4 max-w-2xl px-4">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                       <div className="absolute inset-0 bg-accent-gold rounded-full blur-xl opacity-30 animate-pulse"></div>
                       {/* CR LOGO */}
                       <svg viewBox="0 0 100 100" className="w-16 h-16 text-accent-gold relative z-10 mx-auto logo-glow">
                          <path d="M 65 25 C 50 15, 20 30, 30 60 C 35 75, 55 75, 50 50 L 50 85 M 50 50 C 60 40, 85 40, 80 60 C 75 75, 50 50, 85 85" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Hello, {user ? user.name.split(' ')[0] : 'Dr.'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                      What would you like to analyze today?
                    </p>
                  </div>

                  {/* Scenarios Grid */}
                  <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {DEMO_SCENARIOS.map((scenario) => (
                        <button 
                          key={scenario.id}
                          onClick={() => handleScenarioSelect(scenario)}
                          disabled={isOffline}
                          className="flex flex-col items-start p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl hover:border-accent-gold transition-all duration-300 group text-left relative overflow-hidden active:scale-95 disabled:opacity-50"
                        >
                           <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-4 h-4 text-accent-gold" />
                           </div>
                           <scenario.icon className="w-6 h-6 text-gray-400 group-hover:text-accent-gold mb-3 transition-colors" />
                           <span className="font-bold text-gray-900 dark:text-white mb-1">{scenario.title}</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">{scenario.description}</span>
                        </button>
                     ))}
                  </div>
                </div>
              ) : (
                // ACTIVE CHAT
                <div className="py-6 space-y-2">
                   {messages.map(msg => (
                     <ChatMessage key={msg.id} message={msg} />
                   ))}
                   
                   {isProcessing && (
                     <div className="flex items-center space-x-3 px-4 animate-pulse pt-4">
                        <div className="w-8 h-8 bg-white dark:bg-[#111] rounded-full flex items-center justify-center border border-gray-200 dark:border-[#333]">
                           <div className="w-2 h-2 bg-accent-gold rounded-full animate-bounce"></div>
                        </div>
                        <div className="text-sm font-medium text-gray-400">ClinicalRAG is thinking...</div>
                     </div>
                   )}
                   <div ref={messagesEndRef} className="h-12" />
                </div>
              )}
            </div>
          )}
        </main>

        {/* INPUT AREA (Only on Dashboard) */}
        {currentView === 'dashboard' && (
          <div className="bg-white dark:bg-[#000] border-t border-gray-200 dark:border-[#1A1A1A] p-3 md:p-6 sticky bottom-0 z-40 safe-area-bottom">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* File Previews */}
              {attachments.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative group flex items-center bg-gray-50 dark:bg-[#111] px-3 py-2 rounded-xl border border-gray-200 dark:border-[#222] min-w-[120px]">
                       <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mr-2 truncate flex-1">{att.name}</span>
                       <button onClick={() => removeAttachment(idx)} className="p-1 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Box */}
              <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl shadow-lg focus-within:ring-2 focus-within:ring-accent-gold/50 transition-all">
                 <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute left-2 bottom-2 md:left-4 md:bottom-3 p-3 text-gray-400 hover:text-accent-gold rounded-xl transition-all"
                 >
                   <Paperclip className="w-5 h-5" />
                 </button>
                 
                 <textarea
                   ref={textareaRef}
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="Ask a health question..."
                   className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 font-medium pl-14 pr-14 py-4 md:px-16 md:py-5 max-h-[120px] resize-none focus:outline-none"
                   rows={1}
                 />

                 <button 
                   onClick={handleSubmit}
                   disabled={(!inputValue.trim() && attachments.length === 0) || isProcessing}
                   className={`absolute right-2 bottom-2 md:right-3 md:bottom-3 p-3 rounded-2xl transition-all
                     ${(!inputValue.trim() && attachments.length === 0) || isProcessing 
                       ? 'bg-gray-100 dark:bg-[#222] text-gray-400 cursor-not-allowed' 
                       : 'bg-accent-gold text-black hover:scale-110'}`}
                 >
                   <ArrowUp className="w-5 h-5 font-bold" />
                 </button>
              </div>

              {/* Compliance Footer */}
              <div className="flex items-center justify-center space-x-2 text-[10px] font-medium text-gray-400 text-center opacity-70 cursor-default px-2">
                 <AlertTriangle className="w-3 h-3 text-accent-orange flex-shrink-0" />
                 <span>
                    ⚠ This AI is for educational purposes only. <strong>Not a substitute for professional medical advice.</strong> Always consult a qualified healthcare provider.
                 </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}