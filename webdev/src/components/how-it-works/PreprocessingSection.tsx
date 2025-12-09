'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TableRow: React.FC<{ site: string; time: string; value: string; highlight: boolean; index: number }> = ({ site, time, value, highlight, index }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={`grid grid-cols-[1fr_2fr_1fr] gap-2 p-4 rounded-lg mb-2 text-xs md:text-sm font-mono items-center shadow-sm border ${
        highlight 
        ? 'bg-teal-900/30 border-teal-500 text-teal-200' 
        : 'bg-slate-800/50 border-slate-700 text-slate-400'
    }`}
  >
    <span className={`truncate ${highlight ? 'font-bold text-teal-300' : ''}`}>{site}</span>
    <span className="text-slate-500 whitespace-nowrap">{time}</span>
    <span className="text-slate-500 text-right">{value}</span>
  </motion.div>
);

export const PreprocessingSection: React.FC = () => {
  const [isSorted, setIsSorted] = useState(false);

  const jumbledData = [
    { id: 1, site: 'Site_A', time: '2023-10-27 14:00', val: '45.2' },
    { id: 2, site: 'Site_B', time: '2023-10-27 09:00', val: '22.1' },
    { id: 3, site: 'Site_A', time: '2023-10-27 12:00', val: '41.0' },
    { id: 4, site: 'Site_B', time: '2023-10-27 10:00', val: '25.3' },
    { id: 5, site: 'Site_A', time: '2023-10-27 13:00', val: '43.8' },
  ];

  const sortedData = [
    { id: 3, site: 'Site_A', time: '2023-10-27 12:00', val: '41.0' },
    { id: 5, site: 'Site_A', time: '2023-10-27 13:00', val: '43.8' },
    { id: 1, site: 'Site_A', time: '2023-10-27 14:00', val: '45.2' },
    { id: 2, site: 'Site_B', time: '2023-10-27 09:00', val: '22.1' },
    { id: 4, site: 'Site_B', time: '2023-10-27 10:00', val: '25.3' },
  ];

  return (
    <section className="w-full py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-teal-400 font-bold tracking-widest text-sm uppercase mb-2"
          >
            Phase 2: Preprocessing
          </motion.div>
          <h2 className="text-3xl font-bold text-white">From Chaos to Chronology</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Raw sensor data often comes in irregular packets. We strictly sort by <span className="font-semibold text-teal-400">Site</span> and <span className="font-semibold text-teal-400">Time</span> to enable accurate history tracking.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-12 lg:gap-24">
          
          {/* Controls */}
          <div className="flex flex-col items-center md:items-start md:mt-20 space-y-6">
              <div className="text-left max-w-xs">
                <h3 className="text-lg font-bold text-slate-200 mb-2">Sorting Logic</h3>
                <p className="text-sm text-slate-500">
                    The model requires sequential data to understand trends. We group by location, then sort by timestamp.
                </p>
              </div>

              <button 
                  onClick={() => setIsSorted(!isSorted)}
                  className="group relative flex items-center justify-between w-48 bg-slate-800 border-2 border-slate-700 rounded-full p-2 pr-6 shadow-sm hover:border-teal-500 transition-all"
              >
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isSorted ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {isSorted ? '✓' : '⇄'}
                  </span>
                  <span className="font-bold text-slate-300 text-sm group-hover:text-teal-400 transition-colors">
                      {isSorted ? "Reset Data" : "Sort Data"}
                  </span>
              </button>
          </div>

          {/* Visualization */}
          <motion.div 
            layout
            className="w-full max-w-xl bg-slate-950 p-8 rounded-3xl shadow-2xl border border-slate-800 relative min-h-[400px]"
          >
            {/* Header */}
            <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
              <span>Site</span>
              <span>Timestamp</span>
              <span className="text-right">Val (µg/m³)</span>
            </div>

            {/* Rows with Blur Effect */}
            <motion.div 
                className="relative"
                animate={{ filter: isSorted ? "blur(0px)" : "blur(1px)" }}
                transition={{ duration: 0.5 }}
            >
               <AnimatePresence mode='popLayout'>
                  {(isSorted ? sortedData : jumbledData).map((row, idx) => (
                    <TableRow 
                      key={row.id} 
                      site={row.site} 
                      time={row.time} 
                      value={row.val}
                      highlight={isSorted && row.site === 'Site_A'}
                      index={idx}
                    />
                  ))}
               </AnimatePresence>
            </motion.div>
            
            {/* Unsorted Overlay Hint */}
            {!isSorted && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="bg-slate-900/80 backdrop-blur-[2px] px-6 py-3 rounded-full border border-slate-700 text-slate-300 font-mono text-xs">
                        DATA_STATE: UNSORTED
                    </div>
                </motion.div>
            )}

            {/* Overlay Gradient for visual depth */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none rounded-b-3xl"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};