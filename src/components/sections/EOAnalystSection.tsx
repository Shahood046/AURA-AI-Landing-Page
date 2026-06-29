import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { X, Terminal, Code, Cpu, BarChart2 } from 'lucide-react';

export function EOAnalystSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [selectedConsoleBand, setSelectedConsoleBand] = useState<'rgb' | 'ndvi' | 'sar' | 'swir'>('rgb');

  // Pause and play video based on viewport visibility to optimize resources
  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      id="eo-analyst"
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between py-20 px-6 md:px-16 lg:px-24 overflow-hidden border-b border-white/5"
    >
      {/* Background glow lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full blur-[130px] opacity-10 bg-teal-500" />
        <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full blur-[130px] opacity-10 bg-emerald-500" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col flex-1 justify-between">
        
        {/* Top Header & Section Info */}
        <div className="w-full flex flex-col items-center text-center mb-6">
          <span className="text-[10px] font-mono tracking-[0.3em] text-teal-400/80 uppercase mb-2">
            Analytics Sandbox
          </span>
          <h3 className="text-xl md:text-3xl font-heading italic text-white/95 leading-tight tracking-wide">
            Satellite Spectral Analysis
          </h3>
        </div>

        {/* Viewport Frame Container (occupies 85% width/height ratio) */}
        <div className="relative w-full aspect-[16/9] md:h-[60vh] max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-neutral-950 select-none">
          
          {/* NDVI Video Background Loop */}
          <video
            ref={videoRef}
            src="/NDVI.mp4"
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

        </div>

        {/* Divider line */}
        <div className="w-full my-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Controls Board */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="max-w-2xl text-left">
            <h2 className="text-4xl md:text-5xl font-heading italic text-white leading-tight tracking-tight mb-4">
              AI Earth Observation Analyst
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-body font-light leading-relaxed">
              Transform satellite imagery into actionable intelligence using AI-powered analysis for disaster response, environmental monitoring, and operational decision-making.
            </p>
          </div>

          <div className="flex flex-shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsConsoleOpen(true)}
              className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-teal-400 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
            >
              <span>Explore Analysis</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

      </div>

      {/* --- Glassmorphic Interactive Console Modal --- */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-lg"
          >
            {/* Console Frame */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 170 }}
              className="relative w-full max-w-5xl bg-neutral-950/95 border border-teal-500/20 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[75vh] shadow-[0_0_100px_rgba(45,212,191,0.12)]"
            >
              {/* Header Tab Bar */}
              <div className="absolute top-4 left-6 flex items-center gap-2 pointer-events-none select-none z-30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] font-mono text-white/40 uppercase ml-3 tracking-widest flex items-center gap-1.5">
                  <Terminal size={11} className="text-teal-400" />
                  AURA-AI // Sentinel-2 GEE Sandbox
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsConsoleOpen(false)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 border border-white/10 hover:border-teal-400 text-white/80 hover:text-teal-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Side: Spectral Band Inspector */}
              <div className="w-full md:w-[55%] h-[45%] md:h-full bg-black relative flex flex-col justify-end p-6 border-b md:border-b-0 md:border-r border-white/10">
                {/* Visualizer Display */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {selectedConsoleBand === 'rgb' && (
                    <video src="/NDVI.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  )}
                  {selectedConsoleBand === 'ndvi' && (
                    <div className="relative w-full h-full">
                      <video src="/NDVI.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover grayscale" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/35 via-yellow-100/10 to-green-600/50 mix-blend-color" />
                    </div>
                  )}
                  {selectedConsoleBand === 'sar' && (
                    <div className="relative w-full h-full">
                      <video src="/NDVI.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover invert hue-rotate-[180deg] brightness-[0.7]" />
                    </div>
                  )}
                  {selectedConsoleBand === 'swir' && (
                    <div className="relative w-full h-full">
                      <video src="/NDVI.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover sepia hue-rotate-[90deg]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Spectral Band Selector */}
                <div className="relative z-10 w-full bg-neutral-950/80 border border-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/50 tracking-wider">Band Inspector</span>
                    <span className="text-[9px] font-mono text-teal-400 border border-teal-400/20 rounded px-1.5 py-0.5">Sentinel-2A</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'rgb', label: 'RGB (B4,B3,B2)', desc: 'Natural Color' },
                      { id: 'ndvi', label: 'NDVI (B8,B4)', desc: 'Vegetation' },
                      { id: 'sar', label: 'SAR (VV,VH)', desc: 'Sentinel-1 Inundation' },
                      { id: 'swir', label: 'SWIR (B11,B8)', desc: 'Burn Scars' }
                    ].map((band) => (
                      <button
                        key={band.id}
                        onClick={() => setSelectedConsoleBand(band.id as any)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between h-20 transition-all duration-300 cursor-pointer ${
                          selectedConsoleBand === band.id 
                            ? 'border-teal-400 bg-teal-400/10' 
                            : 'border-white/5 bg-white/[0.01] hover:bg-white/5'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-semibold truncate">{band.label}</span>
                        <span className="text-[8px] text-white/45 tracking-wide leading-normal truncate">{band.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: GEE Code Sandbox & Telemetry */}
              <div className="w-full md:w-[45%] h-[55%] md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-neutral-950/60 pt-16 md:pt-16">
                
                {/* Script editor simulator */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/45 mb-3 border-b border-white/5 pb-2">
                    <Code size={12} className="text-teal-400" />
                    <span>gee_pipeline.js</span>
                  </div>
                  <pre className="text-[9px] sm:text-[10px] font-mono text-slate-300 bg-black/40 border border-white/5 rounded-xl p-4 overflow-x-auto leading-relaxed shadow-inner">
                    <code className="block text-left select-text">
{`// AURA-AI Google Earth Engine Pipeline
var collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(geometry)
  .filterDate('2026-06-01', '2026-06-28')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

var median = collection.median();

// Calculate Normalized Difference Vegetation Index
var ndvi = median.normalizedDifference(['B8', 'B4'])
  .rename('NDVI');

// Generate inundation masks via Sentinel-1 SAR
var sar = ee.Image('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .select('VV');
var flood = sar.lt(-16).rename('flood_mask');`}
                    </code>
                  </pre>

                  {/* Simulator terminal output */}
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-teal-400 tracking-wider flex items-center gap-1">
                      <Terminal size={9} />
                      Console log output:
                    </span>
                    <div className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-950/40 rounded p-2 text-left leading-normal">
                      [SUCCESS] Sentinel-2 multi-spectral image loaded (10 bands).<br/>
                      [SUCCESS] NDVI calculated. Mean vegetation index: 0.724.<br/>
                      [SUCCESS] Sentinel-1 SAR imagery processed. Inundated Area: 14.8 km².
                    </div>
                  </div>
                </div>

                {/* Legend & Stats CTA */}
                <div className="mt-6 flex flex-col gap-4 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
                    <div className="flex items-center gap-1.5">
                      <BarChart2 size={12} className="text-teal-400" />
                      <span>Pipeline Telemetry</span>
                    </div>
                    <span>API Version v4.12</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 text-left">
                      <span className="text-[8px] font-mono text-white/40 block uppercase">Resolution</span>
                      <span className="text-base font-mono font-semibold text-white">10 Meters</span>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 text-left">
                      <span className="text-[8px] font-mono text-white/40 block uppercase">Cloud Masking</span>
                      <span className="text-base font-mono font-semibold text-teal-400">98.8% Clear</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsConsoleOpen(false)}
                    className="w-full py-3 rounded-full text-xs font-semibold text-black bg-teal-400 hover:bg-teal-300 transition-all duration-300 font-mono tracking-wider cursor-pointer shadow-lg shadow-teal-500/10 flex items-center justify-center gap-1.5"
                  >
                    <Cpu size={13} />
                    EXECUTE ANALYSIS PIPELINE
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
