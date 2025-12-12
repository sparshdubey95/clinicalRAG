import React, { useState, useMemo } from 'react';
import { AnalysisResult, Finding } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  ClipboardList, 
  FileText, 
  Maximize2, 
  Info,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Share2,
  Scan,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Thermometer,
  Wind,
  CheckSquare,
  Square,
  BarChart2
} from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
  uploadedImage?: File | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, uploadedImage }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'detailed' | 'comparative'>('summary');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  const imageUrl = uploadedImage ? URL.createObjectURL(uploadedImage) : 'https://placehold.co/800x800/111111/333333?text=No+Scan+Available';

  return (
    <div className="animate-in fade-in duration-700 w-full max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-card dark:shadow-none">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222] px-4 md:px-6 py-4 bg-gray-50 dark:bg-[#151515]">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide w-full md:w-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-1 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'summary' ? 'text-accent-blue dark:text-accent-gold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Summary
            {activeTab === 'summary' && (
              <div className="absolute -bottom-5 left-0 w-full h-0.5 bg-accent-blue dark:bg-accent-gold shadow-[0_0_10px_rgba(37,99,235,0.5)] dark:shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`pb-1 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'detailed' ? 'text-accent-blue dark:text-accent-gold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Detailed
            {activeTab === 'detailed' && (
              <div className="absolute -bottom-5 left-0 w-full h-0.5 bg-accent-blue dark:bg-accent-gold shadow-[0_0_10px_rgba(37,99,235,0.5)] dark:shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('comparative')}
            className={`pb-1 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'comparative' ? 'text-accent-blue dark:text-accent-gold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Timeline & Trends
            {activeTab === 'comparative' && (
              <div className="absolute -bottom-5 left-0 w-full h-0.5 bg-accent-blue dark:bg-accent-gold shadow-[0_0_10px_rgba(37,99,235,0.5)] dark:shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            )}
          </button>
        </div>
        <div className="hidden sm:flex space-x-2">
           <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
           </button>
           <button 
             onClick={() => window.print()}
             className="p-2 text-gray-400 hover:text-accent-gold hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6 min-h-[500px] bg-white dark:bg-[#111]">
        {activeTab === 'summary' && <SummaryTab data={data} />}
        {activeTab === 'detailed' && <DetailedTab data={data} imageUrl={imageUrl} selectedId={selectedFindingId} onSelect={setSelectedFindingId} />}
        {activeTab === 'comparative' && <ComparativeTab data={data} />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR TABS ---

const SummaryTab: React.FC<{ data: AnalysisResult }> = ({ data }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-accent-green bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30';
      case 'medium': return 'text-accent-gold bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30';
      case 'high': return 'text-accent-red bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Patient Overview Card */}
      <div className="md:col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-gray-50 dark:bg-[#181818] rounded-2xl p-5 border border-gray-200 dark:border-[#252525]">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.patientName}</h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ID: {data.patientId} • Age: {data.age}</p>
             </div>
             <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getRiskColor(data.riskLevel)}`}>
               {data.riskLevel} Risk
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <VitalCard label="BP" value={data.vitals.bp} unit="mmHg" icon={<Activity className="w-4 h-4 text-accent-red" />} />
            <VitalCard label="HR" value={data.vitals.heartRate} unit="bpm" icon={<HeartPulse className="w-4 h-4 text-accent-red" />} />
            <VitalCard label="Temp" value={data.vitals.temperature} unit="°F" icon={<Thermometer className="w-4 h-4 text-accent-orange" />} />
            <VitalCard label="SpO2" value={data.vitals.spo2} unit="%" icon={<Wind className="w-4 h-4 text-accent-blue" />} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#333]">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Health Score</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{100 - data.riskScore}<span className="text-sm text-gray-500 font-normal">/100</span></span>
             </div>
             <div className="w-full bg-gray-200 dark:bg-[#333] rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 shadow-lg ${
                    data.riskScore > 70 ? 'bg-accent-red shadow-red-500/50' : data.riskScore > 30 ? 'bg-accent-gold shadow-yellow-500/50' : 'bg-accent-green shadow-green-500/50'
                  }`}
                  style={{ width: `${100 - data.riskScore}%` }}
                />
             </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 dark:bg-[#181818] rounded-2xl p-5 border border-gray-200 dark:border-[#252525]">
          <h3 className="font-bold text-gray-900 dark:text-accent-gold mb-4 flex items-center text-sm uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 mr-2" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {data.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                <div className="min-w-[6px] h-[6px] rounded-full bg-accent-blue dark:bg-accent-gold mt-2 mr-3 shadow-[0_0_5px_currentColor]"></div>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Findings & Summary */}
      <div className="md:col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-[#252525] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">AI Diagnostic Summary</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {data.summary}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#252525] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#151515] flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white">Clinical Findings</h3>
             <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#222] px-3 py-1 rounded-full border border-gray-200 dark:border-[#333] shadow-sm">{data.findings.length} DETECTED</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#222]">
            {data.findings.map((finding) => (
              <div key={finding.id} className="p-5 hover:bg-gray-50 dark:hover:bg-[#181818] transition-all duration-200 group cursor-default">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center text-sm md:text-base">
                      {finding.title}
                      {finding.severity === 'high' || finding.severity === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-accent-red ml-2 animate-pulse" />
                      ) : null}
                    </h4>
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide
                       ${finding.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 
                         finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                         'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                      {finding.severity}
                    </span>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{finding.description}</p>
                 <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                       <span className="font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider text-[10px]">Sources:</span>
                       {finding.modalitySource.map(s => (
                         <span key={s} className="bg-gray-100 dark:bg-[#252525] px-2 py-0.5 rounded capitalize text-gray-600 dark:text-gray-300 font-medium">{s}</span>
                       ))}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const VitalCard: React.FC<{ label: string; value: string; unit: string; icon: React.ReactNode }> = ({ label, value, unit, icon }) => (
  <div className="bg-white dark:bg-[#202020] p-3 rounded-xl border border-gray-100 dark:border-[#333] hover:border-accent-gold/50 transition-colors group">
    <div className="flex items-center space-x-2 text-gray-400 mb-1.5">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <div className="font-bold text-gray-900 dark:text-white text-base md:text-lg group-hover:text-accent-gold transition-colors truncate">
      {value} <span className="text-xs text-gray-500 font-medium ml-0.5">{unit}</span>
    </div>
  </div>
);


const DetailedTab: React.FC<{ 
  data: AnalysisResult; 
  imageUrl: string; 
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ data, imageUrl, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Image Viewer */}
      <div className="bg-black rounded-2xl overflow-hidden relative group h-[300px] md:h-[400px] lg:h-[600px] flex items-center justify-center border border-gray-200 dark:border-[#333]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 to-transparent pointer-events-none"></div>
         <img 
            src={imageUrl} 
            alt="Medical Scan" 
            className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
         />
         
         {/* Annotations Overlay */}
         <div className="absolute inset-0">
            {data.annotations.map((ann, idx) => {
              if (!ann.box2d) return null;
              // Normalize 0-1000 to percentages
              const [ymin, xmin, ymax, xmax] = ann.box2d;
              const top = ymin / 10;
              const left = xmin / 10;
              const height = (ymax - ymin) / 10;
              const width = (xmax - xmin) / 10;
              
              return (
                <div
                  key={idx}
                  className="absolute border-2 border-accent-gold shadow-[0_0_20px_rgba(255,215,0,0.4)] bg-accent-gold/5 hover:bg-accent-gold/20 cursor-help transition-all duration-200"
                  style={{ 
                    top: `${top}%`, 
                    left: `${left}%`, 
                    height: `${height}%`, 
                    width: `${width}%` 
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-accent-gold text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 transform -translate-x-0">
                    {ann.label}
                  </div>
                </div>
              );
            })}
         </div>
         
         <div className="absolute bottom-4 left-4 right-4 bg-[#111]/90 backdrop-blur-md p-3 md:p-4 rounded-xl border border-[#333] text-white">
            <div className="flex items-center text-xs font-bold text-accent-gold mb-1 uppercase tracking-widest">
              <Maximize2 className="w-3 h-3 mr-2" />
              Vision Analysis Layer
            </div>
            <p className="text-[10px] md:text-[11px] text-gray-400 truncate">
              {data.annotations.length} regions of interest identified.
            </p>
         </div>
      </div>

      {/* Detailed Text */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#252525] flex flex-col h-[400px] lg:h-[600px]">
         <div className="p-4 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#151515]">
            <h3 className="font-bold text-gray-900 dark:text-white">Detailed Findings</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {data.findings.map((finding) => (
              <DetailedFindingCard 
                key={finding.id} 
                finding={finding} 
                isSelected={selectedId === finding.id}
                onSelect={onSelect}
              />
            ))}
         </div>
      </div>
    </div>
  );
};

const DetailedFindingCard: React.FC<{
  finding: Finding;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}> = ({ finding, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = finding.description.length > 120;
  
  return (
    <div 
      onClick={() => onSelect(isSelected ? null : finding.id)}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
        isSelected 
          ? 'border-accent-gold bg-accent-gold/5 shadow-glow-sm' 
          : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] hover:border-accent-gold/30'
      }`}
    >
      <div className="flex justify-between mb-2">
        <h4 className={`font-bold text-sm md:text-base ${isSelected ? 'text-accent-gold' : 'text-gray-800 dark:text-gray-200'}`}>
          {finding.title}
        </h4>
        <div className="flex space-x-1">
          {finding.modalitySource.includes('image') && <Scan className="w-4 h-4 text-gray-400" />}
          {finding.modalitySource.includes('report') && <FileText className="w-4 h-4 text-gray-400" />}
          {finding.modalitySource.includes('video') && <Info className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 transition-all leading-relaxed">
        {isLong && !isExpanded ? `${finding.description.substring(0, 120)}...` : finding.description}
      </p>
      
      {isLong && (
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="mt-2 text-xs text-accent-blue dark:text-accent-gold hover:underline flex items-center font-bold"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
          ) : (
            <>Read More <ChevronDown className="w-3 h-3 ml-1" /></>
          )}
        </button>
      )}
    </div>
  );
};

const CHART_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
];

const ComparativeTab: React.FC<{ data: AnalysisResult }> = ({ data }) => {
  // Initialize with all metrics if count is reasonable, else first 3
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    data.historicalComparison?.map(h => h.metric) || []
  );

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const selectedData = useMemo(() => 
    data.historicalComparison?.filter(h => selectedMetrics.includes(h.metric)) || [],
    [data.historicalComparison, selectedMetrics]
  );

  if (!data.historicalComparison || data.historicalComparison.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-dashed border-gray-300 dark:border-[#333]">
        <TrendingUp className="w-12 h-12 text-gray-300 dark:text-[#333] mb-3" />
        <p className="text-gray-500 font-medium">No historical data available for comparison.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Chart */}
      {selectedMetrics.length > 0 && (
         <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#252525] p-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                 <BarChart2 className="w-5 h-5 mr-2 text-accent-blue dark:text-accent-gold" />
                 Trend Analysis (% Change)
               </h3>
               <div className="text-xs text-gray-400 bg-gray-50 dark:bg-[#222] px-2 py-1 rounded">
                 Baseline: Previous Visit (0%)
               </div>
            </div>
            
            <div className="h-64 w-full">
               <TrendChart data={selectedData} fullData={data.historicalComparison} />
            </div>
         </div>
      )}

      {/* Metric Selection Table */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#252525] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#151515] flex justify-between items-center">
           <h3 className="font-bold text-gray-900 dark:text-white">Comparative Metrics</h3>
           <span className="text-xs text-gray-500">Select metrics to compare in chart</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-[#181818] text-xs uppercase font-bold text-gray-500 dark:text-gray-500 border-b border-gray-200 dark:border-[#252525]">
              <tr>
                <th className="px-6 py-4 w-12">Select</th>
                <th className="px-6 py-4">Metric</th>
                <th className="px-6 py-4">Previous Visit</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Trend</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
              {data.historicalComparison.map((item, idx) => {
                const isImproving = item.trend === 'improving';
                const isWorsening = item.trend === 'worsening';
                const isSelected = selectedMetrics.includes(item.metric);
                const color = CHART_COLORS[idx % CHART_COLORS.length];
                
                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#181818]'}`}
                    onClick={() => toggleMetric(item.metric)}
                  >
                    <td className="px-6 py-4">
                      <div className={`transition-all ${isSelected ? 'text-accent-blue dark:text-accent-gold' : 'text-gray-300'}`}>
                         {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200 flex items-center">
                       {isSelected && (
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                       )}
                       {item.metric}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-500">{item.previous} {item.unit}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.current} {item.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.current > item.previous ? (
                           <ArrowUpRight className="w-4 h-4 mr-1 text-gray-400" />
                        ) : item.current < item.previous ? (
                           <ArrowDownRight className="w-4 h-4 mr-1 text-gray-400" />
                        ) : (
                           <Minus className="w-4 h-4 mr-1 text-gray-400" />
                        )}
                        <span className="text-xs font-mono">{Math.abs(((item.current - item.previous) / item.previous) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${isImproving ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : isWorsening ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-[#252525] dark:text-gray-400'}`}>
                        {item.trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TrendChart: React.FC<{ 
  data: Array<{ metric: string; previous: number; current: number }>;
  fullData: Array<{ metric: string; previous: number; current: number }>;
}> = ({ data, fullData }) => {
  // Simple SVG Chart Implementation for Percentage Change
  // Previous value is baseline (0%). Current is % change.
  
  if (data.length === 0) return (
     <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Select metrics below to visualize comparison
     </div>
  );

  const points = data.map((d, i) => {
    // Determine color based on original index in fullData to maintain consistency
    const originalIndex = fullData.findIndex(fd => fd.metric === d.metric);
    const color = CHART_COLORS[originalIndex % CHART_COLORS.length];
    
    const pctChange = ((d.current - d.previous) / d.previous) * 100;
    return { ...d, pctChange, color };
  });

  // Calculate range for Y-axis scaling
  const maxChange = Math.max(...points.map(p => Math.abs(p.pctChange)), 5); // Minimum 5% range
  const range = maxChange * 1.2; // Add padding
  
  // SVG Dimensions
  const padding = 40;
  const width = 800; // viewBox width
  const height = 300; // viewBox height
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const midY = height / 2;

  // Helper to map % change to Y coordinate
  const getY = (pct: number) => {
     // If pct is positive (up), y should be smaller (higher in SVG)
     // midY is 0%.
     // Max range maps to -chartHeight/2 relative to midY
     const offset = (pct / range) * (chartHeight / 2);
     return midY - offset;
  };

  const x1 = padding;
  const x2 = width - padding;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
       {/* Background Grid */}
       <line x1={x1} y1={midY} x2={x2} y2={midY} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" className="dark:stroke-gray-700" />
       
       {/* Axes Labels */}
       <text x={x1} y={height - 5} textAnchor="start" className="text-xs fill-gray-400 font-bold">Previous Visit</text>
       <text x={x2} y={height - 5} textAnchor="end" className="text-xs fill-gray-400 font-bold">Current Visit</text>
       
       {/* Y-Axis Grid Lines for Reference */}
       <line x1={x1} y1={getY(range/2)} x2={x2} y2={getY(range/2)} stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
       <line x1={x1} y1={getY(-range/2)} x2={x2} y2={getY(-range/2)} stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
       
       <text x={x1 + 10} y={getY(range/2) - 5} className="text-[10px] fill-gray-300">+{Math.round(range/2)}%</text>
       <text x={x1 + 10} y={getY(-range/2) - 5} className="text-[10px] fill-gray-300">-{Math.round(range/2)}%</text>

       {/* Data Lines */}
       {points.map((p, i) => (
          <g key={i} className="animate-in fade-in duration-1000">
             {/* Line */}
             <line 
               x1={x1} y1={midY} 
               x2={x2} y2={getY(p.pctChange)} 
               stroke={p.color} 
               strokeWidth="3" 
               strokeLinecap="round"
               className="hover:stroke-width-4 transition-all opacity-80 hover:opacity-100"
             />
             
             {/* Start Point */}
             <circle cx={x1} cy={midY} r="4" fill={p.color} />
             
             {/* End Point */}
             <circle cx={x2} cy={getY(p.pctChange)} r="4" fill={p.color} />
             
             {/* Label at End */}
             <text 
               x={x2 - 10} 
               y={getY(p.pctChange) - 10} 
               textAnchor="end" 
               fill={p.color} 
               className="text-xs font-bold"
             >
                {p.pctChange > 0 ? '+' : ''}{p.pctChange.toFixed(1)}% ({p.metric})
             </text>
          </g>
       ))}
    </svg>
  );
};
