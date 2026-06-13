import React from 'react';
import { motion } from 'motion/react';
import { Clock, Route, Activity } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function PassPredictionSection() {
  return (
    <SectionWrapper
      id="pass-prediction"
      title="Pass Prediction Engine"
      subtitle="Optimize downlink schedules with high-precision forecasting"
      badge="SYSTEM 06"
      description="Anticipate satellite flyovers with granular accuracy. Our prediction engine accounts for atmospheric drag, solar radiation pressure, and precise orbital elements to generate reliable visibility windows."
      align="left"
      features={[
        {
          icon: <Clock className="w-5 h-5 text-indigo-400" />,
          title: 'Automated Scheduling',
          description: 'Conflict-free resource allocation for ground stations.'
        },
        {
          icon: <Route className="w-5 h-5 text-indigo-400" />,
          title: 'Trajectory Modeling',
          description: 'High-fidelity propagation of future orbital paths.'
        },
        {
          icon: <Activity className="w-5 h-5 text-indigo-400" />,
          title: 'Signal Strength Est.',
          description: 'Predictive link margin analysis for every pass.'
        }
      ]}
    >
      <div className="relative w-full aspect-square md:aspect-video rounded-xl border border-white/10 bg-[#050510] overflow-hidden flex flex-col justify-end p-6 backdrop-blur-sm">
        
        {/* Dynamic Graph Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Grid */}
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        {/* Prediction Paths */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* Base Path */}
            <path 
              d="M 0 40 Q 25 10, 50 30 T 100 20" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1" 
            />
            {/* Animated Path */}
            <motion.path 
              d="M 0 40 Q 25 10, 50 30 T 100 20" 
              fill="none" 
              stroke="#818CF8" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Future Path */}
            <path 
              d="M 0 30 Q 30 40, 60 10 T 100 35" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1" 
              strokeDasharray="2 2"
            />
            <motion.path 
              d="M 0 30 Q 30 40, 60 10 T 100 35" 
              fill="none" 
              stroke="#34D399" 
              strokeWidth="2"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
            />
          </svg>
        </div>

        {/* Floating Windows / Data Cards */}
        <div className="relative z-10 w-full flex justify-between gap-4">
          <motion.div 
            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 backdrop-blur-md"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-[10px] text-white/50 uppercase mb-1">AOS (Acquisition)</div>
            <div className="text-sm font-mono text-indigo-400">T-minus 04:12:00</div>
            <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
              <motion.div className="h-full bg-indigo-400" animate={{ width: ['0%', '100%'] }} transition={{ duration: 5, repeat: Infinity }} />
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 backdrop-blur-md"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="text-[10px] text-white/50 uppercase mb-1">Max Elevation</div>
            <div className="text-sm font-mono text-emerald-400">74.2° @ 14:22Z</div>
            <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[74%]" />
            </div>
          </motion.div>
        </div>

      </div>
    </SectionWrapper>
  );
}
