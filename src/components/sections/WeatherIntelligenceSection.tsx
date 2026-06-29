import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CloudRain, Wind, Thermometer, Radar } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

export default function WeatherIntelligenceSection() {
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setScanAngle(prev => (prev + 2) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <SectionWrapper title="Weather Intelligence" description="Hyper-local, AI-driven meteorological forecasting and atmospheric analysis.">
      <div className="flex flex-col md:flex-row-reverse gap-10 items-center mt-12">
        <div className="flex-1 space-y-6 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            className="p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-colors"
          >
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <CloudRain className="w-8 h-8 text-cyan-400" />
              Atmospheric Analytics
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Tap into advanced meteorological networks. AURA-AI processes satellite imagery, barometric sensors, and historical climate patterns to deliver hyper-accurate weather predictions tailored to specific operational sectors.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-black/40 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                <Wind className="text-cyan-500 w-5 h-5" />
                <div>
                  <div className="text-xs text-gray-500 uppercase">Wind Shear</div>
                  <div className="text-white font-mono">42 knots</div>
                </div>
              </div>
              <div className="bg-black/40 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                <Thermometer className="text-cyan-500 w-5 h-5" />
                <div>
                  <div className="text-xs text-gray-500 uppercase">Surface Temp</div>
                  <div className="text-white font-mono">14.2°C</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 w-full bg-[#050b14] rounded-2xl border border-gray-800 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] relative h-80 flex flex-col">
          <div className="bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-500/70 font-mono tracking-wider uppercase">Live Simulation: Doppler Scan</span>
            </div>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {/* Radar Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-64 h-64 border border-cyan-500 rounded-full" />
              <div className="absolute w-48 h-48 border border-cyan-500 rounded-full" />
              <div className="absolute w-32 h-32 border border-cyan-500 rounded-full" />
              <div className="absolute w-16 h-16 border border-cyan-500 rounded-full" />
              <div className="absolute w-full h-[1px] bg-cyan-500" />
              <div className="absolute h-full w-[1px] bg-cyan-500" />
            </div>

            {/* Radar Sweep */}
            <div 
              className="absolute w-32 h-32 origin-bottom-right bottom-1/2 right-1/2 border-r-2 border-cyan-400 bg-gradient-to-br from-transparent to-cyan-500/30"
              style={{ transform: `rotate(${scanAngle}deg)` }}
            />

            {/* Storm Cells */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-12 h-16 bg-red-500/40 blur-xl rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-yellow-500/30 blur-xl rounded-full"
            />
            
            {/* Blips */}
            <div className="absolute top-[30%] left-[30%] w-2 h-2 bg-red-400 rounded-full shadow-[0_0_10px_red]" />
            <div className="absolute bottom-[40%] right-[35%] w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_10px_yellow]" />
            <div className="absolute top-[60%] left-[60%] w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_10px_green]" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
