import React, { useRef, useState } from 'react';
import { FileText, UploadCloud, Film, Scan, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (report: File | null, image: File | null, video: File | null) => void;
  onDemo: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalyze, onDemo }) => {
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const reportInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent, setter: (f: File | null) => void) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setter(e.dataTransfer.files[0]);
    }
  };

  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  const isReady = reportFile || imageFile || videoFile;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Multimodal Medical Analysis</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload medical reports, imaging, and specialist video notes. MedVision Pro uses Gemini 3's 
          reasoning capabilities to synthesize a unified diagnostic assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Report Upload */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all h-64 cursor-pointer
            ${reportFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
          onDrop={(e) => handleDrop(e, setReportFile)}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onClick={() => reportInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={reportInputRef} 
            className="hidden" 
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => handleFileChange(e, setReportFile)}
          />
          {reportFile ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <p className="font-semibold text-slate-800 truncate w-full px-2">{reportFile.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setReportFile(null); }} 
                className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </button>
            </>
          ) : (
            <>
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Medical Report</h3>
              <p className="text-sm text-slate-500">Drag PDF or Click to Upload</p>
            </>
          )}
        </div>

        {/* Image Upload */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all h-64 cursor-pointer
            ${imageFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
          onDrop={(e) => handleDrop(e, setImageFile)}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onClick={() => imageInputRef.current?.click()}
        >
           <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileChange(e, setImageFile)}
          />
          {imageFile ? (
            <>
              <div className="relative mb-4">
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg shadow-sm" 
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="font-semibold text-slate-800 truncate w-full px-2">{imageFile.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setImageFile(null); }} 
                className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </button>
            </>
          ) : (
            <>
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Scan className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Medical Scan</h3>
              <p className="text-sm text-slate-500">X-Ray, MRI, or CT Image</p>
            </>
          )}
        </div>

        {/* Video Upload */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all h-64 cursor-pointer
            ${videoFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
          onDrop={(e) => handleDrop(e, setVideoFile)}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onClick={() => videoInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={videoInputRef} 
            className="hidden" 
            accept="video/*"
            onChange={(e) => handleFileChange(e, setVideoFile)}
          />
          {videoFile ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <p className="font-semibold text-slate-800 truncate w-full px-2">{videoFile.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} 
                className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </button>
            </>
          ) : (
            <>
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Film className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Doctor's Note (Video)</h3>
              <p className="text-sm text-slate-500">Optional Video Context</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => onAnalyze(reportFile, imageFile, videoFile)}
          disabled={!isReady}
          className={`group flex items-center px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg
            ${isReady 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-blue-200' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          Analyze Clinical Data
          <ArrowRight className={`ml-2 w-5 h-5 transition-transform ${isReady ? 'group-hover:translate-x-1' : ''}`} />
        </button>
        
        <button 
          onClick={onDemo}
          className="text-sm text-slate-500 hover:text-blue-600 underline underline-offset-4"
        >
          Try with Demo Data (No upload required)
        </button>
      </div>
    </div>
  );
};