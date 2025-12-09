'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-component: Lag Timeline ---
const LagTimeline = () => {
  const [hoveredLag, setHoveredLag] = useState<string | null>(null);
  
  // Coordinate system: viewBox 0 0 400 120
  const points = [
    { id: 't-48', label: '-48h', x: 40, hint: '2 Days Ago' },
    { id: 't-24', label: '-24h', x: 160, hint: 'Yesterday' },
    { id: 't-1', label: '-1h', x: 300, hint: 'Last Hour' },
    { id: 't', label: 'Now', x: 360, hint: 'Target' },
  ];

  return (
    <motion.div 
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 h-full relative overflow-hidden group transition-all duration-300"
    >
        {/* Background Pulse */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-colors duration-500"></div>

        <h3 className="text-xl font-bold text-white mb-2 relative z-10">1. Lag Features (Memory)</h3>
        <p className="text-sm text-slate-400 mb-8 relative z-10">Historical values provide context for persistence.</p>
        
        <div className="relative h-32 w-full">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
                {/* Base Line */}
                <path d="M 40 60 L 360 60" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                
                {/* Signal Flow Path */}
                <motion.path 
                    d="M 40 60 L 360 60" 
                    fill="none" 
                    stroke="#2DD4BF" 
                    strokeWidth="2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Traveling Pulse - Using Standard animateMotion with correct path data */}
                <circle r="4" fill="white" className="drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]">
                    <animateMotion 
                       path="M 40 60 L 360 60"
                       dur="2s"
                       repeatCount="indefinite"
                       keyPoints="0;1"
                       keyTimes="0;1"
                       calcMode="linear"
                    />
                </circle>

                {/* Points */}
                {points.map((p) => (
                    <g key={p.id} transform={`translate(${p.x}, 60)`} 
                       onMouseEnter={() => setHoveredLag(p.id)}
                       onMouseLeave={() => setHoveredLag(null)}
                       className="cursor-pointer"
                    >
                        {/* Target Halo */}
                        {p.id === 't' && (
                             <circle r="12" fill="#2DD4BF" opacity="0.2">
                                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                             </circle>
                        )}
                        
                        <circle 
                            r={p.id === 't' ? 6 : 4} 
                            fill={p.id === 't' ? '#2DD4BF' : '#1E293B'} 
                            stroke={p.id === 't' ? '#fff' : '#64748B'} 
                            strokeWidth="2"
                            className="transition-colors duration-300 hover:stroke-teal-400 hover:fill-slate-700"
                        />
                        
                        <text y="25" textAnchor="middle" fill="#94A3B8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                            {p.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Tooltip HTML Overlay (Positioned absolutely over SVG container) */}
            <AnimatePresence>
                {points.map((p) => hoveredLag === p.id && (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, y: -5, scale: 0.8 }} 
                        animate={{ opacity: 1, y: -15, scale: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute bg-teal-900 text-teal-100 border border-teal-700 text-xs font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none"
                        style={{ left: `${(p.x / 400) * 100}%`, top: '30%' }}
                    >
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-900 rotate-45 border-b border-r border-teal-700"></div>
                        {p.hint}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    </motion.div>
  );
};

// --- Sub-component: Rolling Mean Description ---
const RollingMeanDescription = () => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 h-full flex flex-col group transition-all duration-300 relative overflow-hidden"
        >
             {/* Background Scan Line */}
             <motion.div 
                className="absolute inset-0 w-[500%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                animate={{ x: ["-100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
             />

            <h3 className="text-xl font-bold text-white mb-2">2. Rolling Mean (Trend)</h3>
            <p className="text-sm text-slate-400 mb-6">Smoothing out noise to find the signal.</p>

            <div className="flex-grow flex flex-col justify-center gap-4 relative z-10">
                <div className="relative h-24 bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                    {/* Fake Chart */}
                    <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio='none'>
                        {/* Noisy Data */}
                        <path d="M0,40 L10,35 L20,45 L30,20 L40,40 L50,35 L60,10 L70,30 L80,25 L90,40 L100,30 L110,35 L120,20 L130,40 L140,45 L150,30 L160,25 L170,10 L180,30 L190,40 L200,35" 
                              fill="none" stroke="#475569" strokeWidth="1" opacity="0.5" />
                        {/* Smooth Trend */}
                        <motion.path 
                            d="M0,40 Q50,35 100,30 T200,30" 
                            fill="none" stroke="#F43F5E" strokeWidth="3" 
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                        />
                    </svg>
                    
                    {/* Scanning Bar */}
                    <motion.div 
                        className="absolute top-0 bottom-0 w-[2px] bg-teal-400 shadow-[0_0_10px_#2DD4BF]"
                        animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />

                    <div className="absolute top-2 right-2 text-[10px] text-rose-400 font-bold px-2 py-0.5 bg-rose-900/30 rounded border border-rose-900/50">Trend Line</div>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                    <h4 className="text-sm font-semibold text-teal-400 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        Pollution Budget
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Comparing current levels vs 24h average. High current + Low average = <span className="text-white font-semibold">Transient Spike</span>.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Sub-component: Satellite Chemistry ---
const SatelliteChemistry = () => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 h-full overflow-hidden transition-all duration-300 relative"
        >
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">3. Satellite Chemistry</h3>
            <p className="text-sm text-slate-400 mb-6 relative z-10">Ratio of HCHO to NO₂ determines Ozone regime.</p>

            <div className="relative aspect-square bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-inner overflow-hidden">
                {/* Pulsing Gradient Background */}
                <motion.div 
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-transparent to-orange-900/40"
                />

                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 divide-x divide-y divide-slate-800/50 pointer-events-none"></div>
                
                {/* Axis Labels */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600">NO₂ (Satellite)</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-600">HCHO</div>

                {/* Ratio Line */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="w-[150%] h-[1px] bg-slate-600 origin-bottom-left -rotate-45 absolute bottom-0 left-0 border-t border-dashed border-slate-500/50"></div>
                </div>

                {/* Data Points */}
                <motion.div 
                    className="absolute w-5 h-5 bg-teal-400 rounded-full shadow-[0_0_25px_rgba(45,212,191,0.8)] border-2 border-white z-20"
                    initial={{ left: '20%', bottom: '20%' }}
                    animate={{ 
                        left: ['20%', '60%', '35%', '20%'], 
                        bottom: ['20%', '70%', '45%', '20%'],
                        scale: [1, 1.3, 0.9, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                
                {/* Ghost Trails */}
                <motion.div 
                    className="absolute w-5 h-5 bg-teal-500/30 rounded-full blur-sm"
                    initial={{ left: '20%', bottom: '20%' }}
                    animate={{ 
                        left: ['20%', '60%', '35%', '20%'], 
                        bottom: ['20%', '70%', '45%', '20%'],
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.2 }}
                />

                <div className="absolute top-4 right-4 text-[10px] font-bold text-purple-300 bg-purple-900/30 px-2 py-1 rounded border border-purple-500/30 backdrop-blur-sm">
                    VOC Limited
                </div>
                <div className="absolute bottom-4 left-10 text-[10px] font-bold text-orange-300 bg-orange-900/30 px-2 py-1 rounded border border-orange-500/30 backdrop-blur-sm">
                    NOx Limited
                </div>
            </div>
        </motion.div>
    );
};

export const FeatureEngineeringSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase bg-white border border-slate-200 rounded-full shadow-sm"
          >
            Phase 3: Feature Engineering
          </motion.div>
          <h2 className="text-4xl font-bold text-slate-900">Teaching the Model Context</h2>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl">
              We create "Derived Features" to give the AI <span className="text-teal-600 font-semibold">chemical intuition</span> and <span className="text-teal-600 font-semibold">temporal memory</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <LagTimeline />
          <RollingMeanDescription />
          <SatelliteChemistry />
        </div>
      </div>
    </section>
  );
};