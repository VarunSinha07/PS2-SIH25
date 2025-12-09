'use client';
import React from 'react';
import { motion } from 'framer-motion';

const DataCard = ({ title, items, description, color, delay }: { title: string; items: string[]; description: string; color: string; delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ x: 5, y: -5 }}
    className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}
  >
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item) => (
        <span key={item} className="px-2 py-1 text-xs font-mono bg-slate-100 text-slate-600 rounded border border-slate-200 font-semibold">
          {item}
        </span>
      ))}
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const PlanetNode = ({ angle, distance, color, label, icon }: { angle: number; distance: number; color: string; label: string; icon?: React.ReactNode }) => {
    // Convert polar to cartesian
    const rad = (angle * Math.PI) / 180;
    const cx = 250 + distance * Math.cos(rad);
    const cy = 250 + distance * Math.sin(rad);

    return (
        <motion.g 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {/* Connecting Line (Faded) */}
            <line x1="250" y1="250" x2={cx} y2={cy} stroke={color} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />

            {/* Pulsing Aura */}
            <motion.circle 
                cx={cx} cy={cy} r="25" 
                fill={color} 
                initial={{ opacity: 0.1, scale: 1 }}
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Core Node */}
            <circle cx={cx} cy={cy} r="12" fill="white" stroke={color} strokeWidth="2" />
            
            {/* Label (Always Upright) */}
            <foreignObject x={cx - 60} y={cy + 20} width="120" height="40">
                <div className="flex justify-center items-center h-full">
                    <span className="text-[10px] font-bold text-slate-500 bg-white/80 backdrop-blur px-2 py-1 rounded shadow-sm border border-slate-100 uppercase tracking-wider">
                        {label}
                    </span>
                </div>
            </foreignObject>

            {/* Particle flowing to center */}
            <motion.circle 
                r="3" fill={color}
                initial={{ cx: cx, cy: cy, opacity: 0 }}
                animate={{ 
                    cx: [cx, 250], 
                    cy: [cy, 250],
                    opacity: [0, 1, 0]
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    repeatDelay: Math.random() * 2 
                }}
            />
        </motion.g>
    );
};

const OrbitRing = ({ r, duration, delay }: { r: number; duration: number; delay: number }) => (
    <motion.circle 
        cx="250" cy="250" r={r} 
        fill="none" 
        stroke="#E2E8F0" 
        strokeWidth="1" 
        strokeDasharray="8 8"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: delay }}
        style={{ originX: "250px", originY: "250px" }}
    />
);

export const DataInputsSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-slate-50 relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-100 rounded-full border border-teal-200"
          >
            Phase 1: Ingestion
          </motion.div>
          <h2 className="text-4xl font-bold text-slate-900">What Data We Use</h2>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl">A multi-source approach combining atmospheric physics, chemistry, and satellite observation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Cards */}
          <div className="grid grid-cols-1 gap-6">
            <DataCard 
              title="Time Features"
              items={['year', 'month', 'day', 'hour']}
              description="Essential for capturing diurnal cycles (rush hour) and seasonal trends (winter vs summer)."
              color="border-l-blue-500"
              delay={0.1}
            />
            <DataCard 
              title="Forecasted Meteorology"
              items={['T_forecast', 'q_forecast', 'u/v/w_wind', 'blh_forecast']}
              description="Short-term weather model outputs. Boundary Layer Height (blh) is crucial for vertical mixing of pollutants."
              color="border-l-teal-500"
              delay={0.2}
            />
            <DataCard 
              title="Satellite Data"
              items={['NO2_sat', 'HCHO_sat', 'Ratio']}
              description="TROPOMI/Sentinel data provides spatial context. The HCHO/NO2 ratio indicates the chemical regime of ozone production."
              color="border-l-purple-500"
              delay={0.3}
            />
            <DataCard 
              title="Targets & Location"
              items={['O3_target', 'NO2_target', 'lat', 'lon']}
              description="Ground truth measurements from monitoring stations used for supervised training and validation."
              color="border-l-orange-500"
              delay={0.4}
            />
          </div>

          {/* Right Column: Enhanced Galaxy Diagram */}
          <div className="relative flex items-center justify-center min-h-[500px]">
             {/* Subtle Grid Background */}
             <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" width="100%" height="100%">
                <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#CBD5E1" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
            </svg>

            <svg viewBox="0 0 500 500" className="w-full max-w-[600px] overflow-visible">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Rotating Orbits */}
              <OrbitRing r={100} duration={60} delay={0} />
              <OrbitRing r={160} duration={90} delay={1} />
              <OrbitRing r={220} duration={120} delay={2} />
              
              {/* Central Core */}
              <motion.g 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                  <circle cx="250" cy="250" r="50" fill="white" className="drop-shadow-xl" />
                  <motion.circle 
                    cx="250" cy="250" r="48" 
                    fill="none" stroke="#0D9488" strokeWidth="3"
                    animate={{ strokeWidth: [3, 5, 3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <text x="250" y="245" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="800" className="uppercase tracking-widest">Model</text>
                  <text x="250" y="260" textAnchor="middle" fill="#0D9488" fontSize="12" fontWeight="800" className="uppercase tracking-widest">Input</text>
              </motion.g>

              {/* Data Nodes (Planets) - Placed at specific angles for composition */}
              <PlanetNode angle={225} distance={220} color="#A855F7" label="Satellite" />
              <PlanetNode angle={315} distance={160} color="#0D9488" label="Forecast" />
              <PlanetNode angle={45} distance={100} color="#3B82F6" label="Time" />
              <PlanetNode angle={135} distance={190} color="#F97316" label="Sensors" />

            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};