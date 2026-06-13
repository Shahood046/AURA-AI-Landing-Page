import React from 'react';
import { motion } from 'motion/react';
import { Globe, RefreshCw, Compass } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function OrbitVisualizationSection() {
  return (
    <SectionWrapper
      id="orbit-visualization"
      title="3D Orbit Visualization"
      subtitle="Interactive spatial awareness of the orbital environment"
      badge="SYSTEM 07"
      description="Gain full situational awareness with our immersive 3D visualization engine. Render constellations, orbital planes, and space debris in real-time to analyze complex spatial relationships."
      align="right"
      features={[
        {
          icon: <Globe className="w-5 h-5 text-cyan-400" />,
          title: 'Full Spatial Context',
          description: 'Visualize satellite positions relative to Earth and each other.'
        },
        {
          icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
          title: 'Time-Lapse Controls',
          description: 'Scrub through time to see past and future orbital states.'
        },
        {
          icon: <Compass className="w-5 h-5 text-cyan-400" />,
          title: 'Debris Mapping',
          description: 'Identify potential hazards with visual proximity warnings.'
        }
      ]}
    >
      <div className="relative w-full aspect-square md:aspect-video rounded-xl border border-white/10 bg-[#000510] overflow-hidden flex items-center justify-center backdrop-blur-sm perspective-[1000px]">
        
        {/* Central Planet (Earth Mockup) */}
        <motion.div 
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border border-cyan-500/30 bg-gradient-to-br from-blue-900 via-black to-black shadow-[inset_0_0_20px_rgba(6,182,212,0.5),0_0_30px_rgba(6,182,212,0.2)] z-10 overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {/* Faux continents/clouds */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-cyan-500/10 blur-md rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-16 h-8 bg-blue-400/10 blur-md rounded-full" />
        </motion.div>

        {/* Orbit Rings & Satellites */}
        {[
          { id: 1, rx: 70, ry: 20, size: '200%', duration: 15, color: '#22D3EE' }, // LEO
          { id: 2, rx: -45, ry: 45, size: '250%', duration: 25, color: '#818CF8' }, // Polar
          { id: 3, rx: 15, ry: 75, size: '350%', duration: 40, color: '#F472B6' }, // MEO
        ].map((orbit) => (
          <motion.div
            key={orbit.id}
            className="absolute border border-white/20 rounded-full"
            style={{
              width: orbit.size,
              height: orbit.size,
              transformStyle: 'preserve-3d',
              rotateX: orbit.rx,
              rotateY: orbit.ry,
            }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
          >
            {/* The Satellite on the ring */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_currentColor]"
              style={{ width: '8px', height: '8px', color: orbit.color, backgroundColor: orbit.color }}
            />
          </motion.div>
        ))}

        {/* UI Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="flex flex-col gap-1 items-end">
            <div className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[10px] font-mono text-cyan-400">ALTITUDE: 400KM</div>
            <div className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[10px] font-mono text-indigo-400">INCLINATION: 97.5°</div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
