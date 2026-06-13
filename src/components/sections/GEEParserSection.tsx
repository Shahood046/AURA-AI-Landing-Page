import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Map as MapIcon, Database, Activity, RefreshCw } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const GEEParserSection: React.FC = () => {
  const [parsingProgress, setParsingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParsingProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionWrapper
      id="gee-parser"
      title="Google Earth Engine Parser"
      subtitle="Geospatial Intelligence at Scale"
      description="Injest, process, and analyze petabytes of satellite imagery and geospatial datasets in real-time. AURA-AI seamlessly integrates with Google Earth Engine to extract actionable intelligence from global observation data."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <FeatureItem
              icon={<Database className="w-6 h-6 text-blue-400" />}
              title="Petabyte-Scale Ingestion"
              description="Direct pipeline to GEE catalogs for instant access to Landsat, Sentinel, and MODIS data streams."
            />
            <FeatureItem
              icon={<Layers className="w-6 h-6 text-emerald-400" />}
              title="Multi-Spectral Processing"
              description="Automated band math, NDVI calculation, and spectral unmixing using distributed computing."
            />
            <FeatureItem
              icon={<Activity className="w-6 h-6 text-purple-400" />}
              title="Time-Series Analysis"
              description="Track temporal changes in land cover, vegetation health, and urban expansion over decades."
            />
          </div>
          
          {/* Progress Bar */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-mono text-slate-400">Current Task: Sentinel-2 Cloud Masking</span>
              <span className="text-sm font-mono text-blue-400">{parsingProgress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                style={{ width: `${parsingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Simulation */}
        <div className="relative h-[500px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-6 group">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none" />
           
           {/* Map Interface Mock */}
           <div className="relative w-full h-full border border-slate-700/50 rounded-lg overflow-hidden bg-slate-950">
             {/* Grid overlay */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             {/* Scanning effect */}
             <motion.div 
               className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-blue-500/20 to-blue-400/40 border-b border-blue-400/50"
               animate={{ y: ['-100%', '600%'] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             />

             {/* UI Elements */}
             <div className="absolute top-4 left-4 flex gap-2">
               <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-700 flex items-center gap-2">
                 <MapIcon className="w-4 h-4 text-slate-400" />
                 <span className="text-xs font-mono text-slate-300">Lat: 34.0522, Lng: -118.2437</span>
               </div>
             </div>

             <div className="absolute top-4 right-4 flex gap-2">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="bg-blue-500/10 p-1.5 rounded-md border border-blue-500/30"
                 >
                   <RefreshCw className="w-4 h-4 text-blue-400" />
                 </motion.div>
             </div>
             
             {/* Abstract Map Nodes */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                   {[...Array(5)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="absolute inset-0 border border-emerald-500/30 rounded-full"
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ 
                         scale: [0.8, 1.5, 2],
                         opacity: [0, 0.5, 0]
                       }}
                       transition={{
                         duration: 3,
                         delay: i * 0.6,
                         repeat: Infinity,
                         ease: "easeOut"
                       }}
                     />
                   ))}
                   <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
                </div>
             </div>

             {/* Bottom Panel */}
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent p-4 flex items-end">
                <div className="w-full flex gap-2 h-16">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-blue-500/20 rounded-t-sm"
                      animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
             </div>
           </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800"
  >
    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  </motion.div>
);

export default GEEParserSection;
