import React from 'react';
import { MedicineDetails } from '../types';
import { ExternalLink, ShoppingCart, TrendingDown, ShieldCheck, CalendarPlus } from 'lucide-react';

interface MedicineCardProps {
  data: MedicineDetails;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ data }) => {
  const generateCalendarLink = (medName: string) => {
    const text = encodeURIComponent(`Take ${medName}`);
    const details = encodeURIComponent(`Time to take your ${medName} dosage. Prescription reminder from ClinicalRAG.`);
    const dates = new Date().toISOString().replace(/-|:|\.\d\d\d/g, ""); // Basic ISO cleanup for Google Calendar format
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-card dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
         <div className="flex justify-between items-start relative z-10">
            <div>
               <h3 className="text-xl font-bold">{data.name}</h3>
               <p className="text-blue-100 font-medium text-sm">{data.strength} • {data.quantity}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-xs font-bold flex items-center">
               <ShieldCheck className="w-3.5 h-3.5 mr-1" />
               Rx Verified
            </div>
         </div>
      </div>

      {/* Savings Banner */}
      {data.savings > 0 && (
         <div className="bg-green-50 dark:bg-green-900/20 px-5 py-2 flex items-center justify-between border-b border-green-100 dark:border-green-900/30">
            <span className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center uppercase tracking-wide">
               <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
               Potential Savings
            </span>
            <span className="text-sm font-bold text-green-700 dark:text-green-400">Save ₹{data.savings}</span>
         </div>
      )}

      {/* Pharmacy List */}
      <div className="divide-y divide-gray-100 dark:divide-[#222]">
         {data.prices.map((pharmacy, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors group">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#222] flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#333]">
                     {pharmacy.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                     <div className="flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">{pharmacy.name}</span>
                        {pharmacy.isCheapest && (
                           <span className="ml-2 bg-accent-gold text-black text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide flex items-center">
                              ⭐ CHEAPEST
                           </span>
                        )}
                     </div>
                     <span className="text-xs text-gray-500 dark:text-gray-500">In stock • 2-3 days</span>
                  </div>
               </div>
               
               <div className="flex items-center space-x-3">
                  <span className={`font-bold ${pharmacy.isCheapest ? 'text-green-600 dark:text-green-400 text-lg' : 'text-gray-900 dark:text-white'}`}>₹{pharmacy.price}</span>
                  <a 
                     href={pharmacy.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center shadow-sm
                        ${pharmacy.isCheapest 
                           ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                           : 'bg-gray-100 dark:bg-[#222] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'}`}
                  >
                     Buy Now <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                  </a>
               </div>
            </div>
         ))}
      </div>

      <div className="p-3 bg-gray-50 dark:bg-[#151515] border-t border-gray-200 dark:border-[#222] flex items-center justify-between">
         <a 
            href={generateCalendarLink(data.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-blue-500 hover:text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg transition-colors"
         >
            <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
            Set Daily Reminder
         </a>
         <p className="text-[10px] text-gray-400">
            Verify Rx requirements. Affiliate links may apply.
         </p>
      </div>
    </div>
  );
};