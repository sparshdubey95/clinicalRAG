import React, { useEffect, useState } from 'react';
import { Activity, Brain, FileText, Scan, Video } from 'lucide-react';

export const Loader: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Extracting clinical data from reports...",
    "Analyzing imaging for abnormalities...",
    "Processing video insights...",
    "Correlating findings across modalities...",
    "Generating diagnostic summary..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Brain className="w-24 h-24 text-blue-600 animate-bounce" />
      </div>
      
      <div className="flex space-x-8 text-slate-400">
        <FileText className={`w-8 h-8 transition-colors duration-500 ${step >= 0 ? 'text-blue-500' : ''}`} />
        <Scan className={`w-8 h-8 transition-colors duration-500 ${step >= 1 ? 'text-blue-500' : ''}`} />
        <Video className={`w-8 h-8 transition-colors duration-500 ${step >= 2 ? 'text-blue-500' : ''}`} />
        <Activity className={`w-8 h-8 transition-colors duration-500 ${step >= 3 ? 'text-blue-500' : ''}`} />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">Analyzing Patient Data</h3>
        <p className="text-slate-500 w-64 mx-auto h-6 transition-all duration-300">
          {steps[step]}
        </p>
      </div>

      <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};