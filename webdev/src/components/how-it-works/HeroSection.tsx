'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PipelineNode = ({ label, x, y, delay }: { label: string; x: number; y: number; delay: number }) => (
  <motion.g
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.1 }}
    className="cursor-pointer"
  >
    <rect x={x} y={y} width="140" height="60" rx="12" fill="white" stroke="#0D9488" strokeWidth="2" className="shadow-sm" />
    <text x={x + 70} y={y + 35} textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="600" className="pointer-events-none">
      {label}
    </text>
  </motion.g>
);

const PipelineArrow = ({ startX, endX, y, delay }: { startX: number; endX: number; y: number; delay: number }) => (
  <motion.path
    d={`M ${startX} ${y} L ${endX} ${y}`}
    stroke="#CBD5E1"
    strokeWidth="2"
    strokeDasharray="4 4"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1, strokeDashoffset: -20 }}
    transition={{ 
      pathLength: { delay, duration: 0.8 },
      strokeDashoffset: { repeat: Infinity, duration: 1, ease: "linear" }
    }}
  />
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 md:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-teal-700 uppercase bg-teal-100 rounded-full">
            Methodology
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            How Our XGBoost Model Predicts <span className="text-teal-600">Urban Air Quality</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            We combine forecasted meteorology, satellite imagery, and historical pollution patterns to generate precise hourly O₃ and NO₂ predictions. 
            Visually follow the journey from raw data to actionable insights.
          </p>
          <div className="text-sm text-slate-400 font-medium animate-pulse">
            ↓ Scroll to explore the pipeline
          </div>
        </motion.div>

        {/* Right: SVG Teaser */}
        <div className="w-full h-[300px] md:h-[400px] relative flex items-center justify-center bg-white/50 rounded-3xl border border-slate-100 shadow-xl overflow-hidden backdrop-blur-sm">
           <svg viewBox="0 0 800 200" className="w-full h-full">
             <PipelineArrow startX={150} endX={210} y={100} delay={0.5} />
             <PipelineArrow startX={350} endX={410} y={100} delay={1.0} />
             <PipelineArrow startX={550} endX={610} y={100} delay={1.5} />

             <PipelineNode label="Raw Data" x={10} y={70} delay={0.2} />
             <PipelineNode label="Processing" x={210} y={70} delay={0.7} />
             <PipelineNode label="XGBoost" x={410} y={70} delay={1.2} />
             <PipelineNode label="Predictions" x={610} y={70} delay={1.7} />
           </svg>
        </div>
      </div>
    </section>
  );
};