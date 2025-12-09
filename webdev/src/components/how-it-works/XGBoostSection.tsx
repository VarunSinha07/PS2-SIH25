'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const XGBoostSection: React.FC = () => {
  // 0: Idle, 1: Sending, 2: Processing, 3: Output
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStage(1); // Start Sending
        setTimeout(() => setStage(2), 1000); // Hit Model -> Process
        setTimeout(() => setStage(3), 1800); // Show Output
        setTimeout(() => setStage(0), 4500); // Reset
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-32 bg-slate-950 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-20">
                <motion.div 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    className="text-teal-500 font-bold tracking-widest text-sm uppercase mb-2"
                >
                    Phase 4: The Engine
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">XGBoost Prediction Engine</h2>
                <p className="text-slate-400 mt-4 text-lg">Gradient Boosting at Work</p>
            </div>

            {/* Animation Stage */}
            <div className="relative h-[400px] flex items-center justify-center">
                
                {/* --- Left: Inputs --- */}
                <div className="absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
                    {['Engineered Features', 'Meteorology', 'Satellite Data'].map((label, idx) => (
                        <div key={idx} className="relative group">
                            <motion.div 
                                animate={{ 
                                    scale: stage === 1 ? 1.05 : 1,
                                    borderColor: stage === 1 ? 'rgba(45,212,191,1)' : 'rgba(51,65,85,0.5)',
                                    backgroundColor: stage === 1 ? 'rgba(30,41,59,1)' : 'rgba(15,23,42,0.5)',
                                    x: stage === 1 ? 10 : 0
                                }}
                                className="w-40 md:w-56 p-4 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs md:text-sm font-mono text-center shadow-lg transition-colors duration-300"
                            >
                                {label}
                            </motion.div>
                            
                            {/* The Signal Particles */}
                            {stage >= 1 && stage < 3 && (
                                <motion.div 
                                    className="absolute top-1/2 right-0 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_20px_#2DD4BF] z-50"
                                    initial={{ x: 0, opacity: 1, scale: 1 }}
                                    animate={{ x: 200, opacity: 0, scale: 0.5 }} // Distance to center
                                    transition={{ duration: 0.6, ease: "easeIn", delay: idx * 0.1 }}
                                >
                                    {/* Particle Trail */}
                                    <motion.div 
                                        className="absolute top-1/2 right-0 h-[2px] bg-teal-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: 50, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- Center: The Model --- */}
                <div className="relative z-30">
                    {/* Shockwave Ring */}
                    <AnimatePresence>
                    {stage === 2 && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-teal-400/50"
                            initial={{ width: 150, height: 150, opacity: 1, borderWidth: 10 }}
                            animate={{ width: 600, height: 600, opacity: 0, borderWidth: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    )}
                    </AnimatePresence>

                    {/* Connecting Lines (Visual only) */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none -z-10 opacity-30">
                        <path d="M 50 80 L 300 150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                        <path d="M 50 150 L 300 150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                        <path d="M 50 220 L 300 150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                        
                        <path d="M 300 150 L 550 100" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                        <path d="M 300 150 L 550 200" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>

                    {/* The Block */}
                    <motion.div 
                        animate={{ 
                            scale: stage === 2 ? [1, 1.2, 0.9, 1.1, 1] : 1,
                            rotate: stage === 2 ? [0, -2, 2, -2, 0] : 0,
                            boxShadow: stage === 2 
                                ? "0 0 100px rgba(45,212,191,0.6)" 
                                : "0 0 30px rgba(0,0,0,0.5)"
                        }}
                        transition={{ duration: 0.6 }}
                        className="w-48 h-48 md:w-64 md:h-64 bg-slate-900 border-2 border-slate-600 rounded-3xl flex flex-col items-center justify-center relative shadow-2xl z-20 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950"></div>
                        
                        {/* Internal Animated Grid */}
                        <motion.div 
                            animate={{ opacity: stage === 2 ? 0.8 : 0.1 }}
                            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"
                        ></motion.div>

                        {/* Icon */}
                        <motion.div 
                            animate={{ 
                                rotate: stage === 2 ? 360 : 0, 
                                scale: stage === 2 ? 1.5 : 1
                            }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            className="relative z-10 mb-4"
                        >
                             <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={stage === 2 ? "#fff" : "#2DD4BF"} strokeWidth="2"><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="5" /></svg>
                        </motion.div>
                        
                        <h3 className="relative z-10 text-white font-bold text-2xl tracking-tight">XGBoost</h3>
                        <p className="relative z-10 text-teal-400 text-xs font-mono mt-2 font-bold tracking-wider">
                            {stage === 2 ? "CRUNCHING DATA..." : "MODEL READY"}
                        </p>
                    </motion.div>
                </div>

                {/* --- Right: Outputs --- */}
                <div className="absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
                     <AnimatePresence>
                        {stage === 3 && (
                            <>
                                <motion.div 
                                    initial={{ x: -100, opacity: 0, scale: 0.2 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    className="p-5 bg-white border-l-8 border-blue-500 rounded-r-2xl shadow-2xl w-48 md:w-56"
                                >
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ozone (O₃)</div>
                                    <div className="text-3xl font-bold text-slate-800 flex items-baseline gap-1">42 <span className="text-sm font-normal text-slate-400">µg/m³</span></div>
                                </motion.div>

                                <motion.div 
                                    initial={{ x: -100, opacity: 0, scale: 0.2 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ delay: 0.1 }}
                                    className="p-5 bg-white border-l-8 border-orange-500 rounded-r-2xl shadow-2xl w-48 md:w-56"
                                >
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nitrogen (NO₂)</div>
                                    <div className="text-3xl font-bold text-slate-800 flex items-baseline gap-1">18 <span className="text-sm font-normal text-slate-400">µg/m³</span></div>
                                </motion.div>
                            </>
                        )}
                     </AnimatePresence>
                </div>

            </div>
        </div>
    </section>
  );
};