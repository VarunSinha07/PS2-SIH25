'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sites = [
    { id: 1, name: 'Model Town', x: 54, y: 45, lat: 28.69536, lon: 77.18168 },
    { id: 2, name: 'Dwarka Sec-8', x: 15, y: 79, lat: 28.57180, lon: 77.07125 },
    { id: 3, name: 'JLN Stadium', x: 75, y: 76, lat: 28.58278, lon: 77.23441 },
    { id: 4, name: 'Narela', x: 22, y: 15, lat: 28.82286, lon: 77.10197 },
    { id: 5, name: 'Okhla Phase-2', x: 82, y: 85, lat: 28.53077, lon: 77.27123 },
    { id: 6, name: 'Rohini', x: 20, y: 36, lat: 28.72954, lon: 77.09601 },
    { id: 7, name: 'Sonia Vihar', x: 81, y: 40, lat: 28.71052, lon: 77.24951 },
];

const IndiaIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-300 fill-current">
        <path d="M45,5 L55,10 L60,25 L75,30 L80,45 L70,55 L65,85 L50,95 L35,85 L30,55 L20,45 L25,30 L40,25 Z" />
        <circle cx="45" cy="25" r="3" className="text-teal-600 fill-current" />
    </svg>
);

export const SitesMap: React.FC = () => {
    const [activeSite, setActiveSite] = useState<number | null>(null);

    return (
        <section className="w-full py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                         <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 border border-teal-200 rounded-full">
                            Target Network
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">7 Sites, Hourly Predictions</h2>
                        <p className="text-slate-600 mt-2">Monitoring network across <span className="font-semibold text-teal-600">Delhi, India</span>.</p>
                    </div>
                </div>

                <div className="relative bg-slate-50 rounded-3xl overflow-hidden h-[600px] border border-slate-200 shadow-2xl group">
                    
                    {/* Map Context Layers */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Grid */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
                            <defs>
                                <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#mapGrid)" />
                        </svg>

                        {/* Radar Scan Effect */}
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,rgba(20,184,166,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full scale-[1.5] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        {/* Network Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20">
                            {sites.map((site, i) => (
                                sites.slice(i + 1).map((target, j) => (
                                    <motion.line 
                                        key={`${site.id}-${target.id}`}
                                        x1={`${site.x}%`} y1={`${site.y}%`}
                                        x2={`${target.x}%`} y2={`${target.y}%`}
                                        stroke="#0D9488"
                                        strokeWidth="0.5"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, delay: 0.5 }}
                                    />
                                ))
                            ))}
                        </svg>

                        {/* River */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                            <path 
                                d="M 65 0 Q 60 20 68 40 T 72 70 T 85 100" 
                                fill="none" 
                                stroke="#BFDBFE" 
                                strokeWidth="4" 
                                strokeLinecap="round"
                                className="opacity-80"
                            />
                        </svg>

                        <div className="absolute top-6 left-6 text-slate-300 font-bold text-2xl uppercase tracking-[0.2em] opacity-40">
                            Delhi / NCR
                        </div>

                        <div className="absolute top-6 right-6 w-20 h-20 opacity-80 bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
                            <IndiaIcon />
                        </div>
                    </div>

                    {/* Site Markers */}
                    {sites.map((site) => {
                        const isTopHalf = site.y < 50;
                        return (
                        <div 
                            key={site.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                            style={{ left: `${site.x}%`, top: `${site.y}%` }}
                            onClick={() => setActiveSite(site.id === activeSite ? null : site.id)}
                            onMouseEnter={() => setActiveSite(site.id)}
                        >
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 bg-teal-500 rounded-full"
                            />
                            
                            <motion.div 
                                whileHover={{ scale: 1.2 }}
                                animate={{ 
                                    scale: activeSite === site.id ? 1.3 : 1,
                                    backgroundColor: activeSite === site.id ? '#0F172A' : '#ffffff',
                                    borderColor: activeSite === site.id ? '#2DD4BF' : '#0D9488'
                                }}
                                className="relative w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] shadow-lg transition-colors duration-300"
                            >
                            </motion.div>

                            {/* Floating Label */}
                            <div className={`hidden md:block absolute top-1/2 left-6 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-bold shadow-sm whitespace-nowrap transition-all duration-300 ${activeSite === site.id ? 'bg-slate-900 text-white opacity-100 translate-x-2' : 'bg-white/80 text-slate-600 opacity-0 group-hover:opacity-60'}`}>
                                {site.name}
                            </div>

                            <AnimatePresence>
                            {activeSite === site.id && (
                                 <motion.div 
                                    initial={{ opacity: 0, y: isTopHalf ? -10 : 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-900 p-5 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 w-64 z-50 ${
                                        isTopHalf ? 'top-8' : 'bottom-8'
                                    }`}
                                 >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-lg leading-tight">{site.name}</h4>
                                        <span className="bg-teal-100 text-teal-800 border border-teal-200 text-[10px] px-2 py-0.5 rounded font-bold">ID: {site.id}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-1">
                                            <span>Latitude</span>
                                            <span className="font-mono text-slate-700">{site.lat}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500 pb-1">
                                            <span>Longitude</span>
                                            <span className="font-mono text-slate-700">{site.lon}</span>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2">
                                             <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-teal-400 to-blue-500"></div>
                                             <div className="text-[10px] text-teal-600 font-bold">ACTIVE</div>
                                        </div>
                                    </div>
                                 </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    );
                    })}
                </div>
            </div>
        </section>
    );
};