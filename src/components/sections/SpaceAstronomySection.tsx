import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

export const SpaceAstronomySection: React.FC = () => {
  return (
    <SectionWrapper
      id="space-astronomy"
      index={0}
      totalSections={1}
      label="Space Astronomy"
      title="Deep Space Astronomy"
      description="Galactic scanning, exoplanet analysis, and cosmic phenomena detection."
      accentColor="#c084fc"
    >
      <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
        {/* Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Galaxy Swirl */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-dashed border-purple-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Scanner */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </SectionWrapper>
  );
};
