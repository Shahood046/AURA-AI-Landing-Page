import React from 'react';
import { motion } from 'motion/react';
import { Scan, Layers, ImageIcon } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function EarthObservationSection() {
  return (
    <SectionWrapper
      id="earth-observation"
      title="Earth Observation & Analysis"
      subtitle="Transform raw imagery into actionable intelligence"
      badge="SYSTEM 08"
      description="Harness the power of multi-spectral and SAR imaging. Our platform automatically ingests, calibrates, and analyzes satellite imagery to detect changes, monitor environments, and provide strategic insights."
      align="left"
      features={[
        {
          icon: <Scan className="w-5 h-5 text-rose-400" />,
          title: 'Automated Ingestion',
          description: 'Direct pipeline from satellite downlinks to processing nodes.'
        },
        {
          icon: <Layers className="w-5 h-5 text-rose-400" />,
          title: 'Multi-Sensor Fusion',
          description: 'Combine optical, SAR, and thermal data for deeper context.'
        },
        {
          icon: <ImageIcon className="w-5 h-5 text-rose-400" />,
          title: 'Change Detection',
          description: 'AI-driven algorithms to highlight structural or ecological shifts.'
        }
      ]}
    >
      <div className="relative w-full aspect-square md:aspect-video rounded-xl border border-white/10 bg-[#100505] overflow-hidden flex items-center justify-center p-4 backdrop-blur-sm">
        
        {/* Image Mockup */}
        <div className="relative w-full h-full rounded-lg border border-white/5 overflow-hidden bg-zinc-900">
          
          {/* Faux Landscape Map */}
          <div className="absolute inset-0 opacity-40">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-zinc-700">
              <path d="M 0,50 Q 25,30 50,60 T 100,40 L 100,100 L 0,100 Z" fill="currentColor" opacity="0.3" />
              <path d="M 0,70 Q 30,50 60,80 T 100,60 L 100,100 L 0,100 Z" fill="currentColor" opacity="0.5" />
            </svg>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>

          {/* Scanning Bar Animation */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] z-20"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            {/* Scan gradient trail */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-t from-rose-500/20 to-transparent -translate-y-full" />
          </motion.div>

          {/* Detected Objects (Appearing after scan) */}
          <div className="absolute inset-0 z-10">
            {[
              { id: 1, x: '25%', y: '45%', delay: 1 },
              { id: 2, x: '75%', y: '30%', delay: 2 },
              { id: 3, x: '60%', y: '80%', delay: 4 },
            ].map((target) => (
              <motion.div
                key={target.id}
                className="absolute w-8 h-8 border border-rose-500 bg-rose-500/10"
                style={{ left: target.x, top: target.y }}
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [1.5, 1, 1, 1] }}
                transition={{ duration: 6, repeat: Infinity, delay: target.delay, times: [0, 0.1, 0.8, 1] }}
              >
                {/* Crosshairs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-2 bg-rose-500" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1px] h-2 bg-rose-500" />
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-[1px] bg-rose-500" />
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-[1px] bg-rose-500" />
              </motion.div>
            ))}
          </div>

        </div>

        {/* Floating Info Panels */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-30">
          <motion.div 
            className="px-3 py-1.5 bg-black/70 border border-white/10 rounded text-xs font-mono text-white/80 backdrop-blur-md flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Layers className="w-3 h-3 text-rose-400" />
            PROCESSING MULTI-SPECTRAL
          </motion.div>
          <div className="px-3 py-1.5 bg-black/70 border border-white/10 rounded text-xs font-mono text-rose-400 backdrop-blur-md">
            ANOMALIES DETECTED: 3
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
