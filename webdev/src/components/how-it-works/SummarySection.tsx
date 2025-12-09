'use client';
import React from 'react';

export const SummarySection: React.FC = () => {
  return (
    <section className="bg-slate-950 text-slate-300 py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">From Raw Signals to Actionable Forecasts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-teal-900 transition-colors">
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">1</span>
                        <span className="text-sm leading-relaxed">Data is ingested from satellites and forecast models, then rigorously cleaned and time-aligned.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">2</span>
                        <span className="text-sm leading-relaxed">Lag features and rolling means give the model "memory", distinguishing trends from noise.</span>
                    </li>
                </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-teal-900 transition-colors">
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">3</span>
                        <span className="text-sm leading-relaxed">Satellite ratios (HCHO/NO₂) provide crucial chemical context for Ozone formation regimes.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">4</span>
                        <span className="text-sm leading-relaxed">XGBoost synthesizes these inputs to deliver precise hourly pollutant concentration forecasts.</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="inline-block">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-500 transition-all shadow-lg hover:shadow-teal-500/25">
                <span>View Full Technical Report</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </a>
        </div>
        
        <div className="mt-12 text-slate-600 text-xs">
            © 2024 Air Quality Intelligence Unit. All rights reserved.
        </div>
      </div>
    </section>
  );
};