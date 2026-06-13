import { motion } from 'motion/react';
import { Radar, Globe, BrainCircuit, ShieldAlert, ChevronRight } from 'lucide-react';

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-32 bg-[#020617] overflow-hidden">
      {/* Background glow for the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-primary"></span>
            Unified Ecosystem
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Multi-Domain <br className="hidden md:block"/> Space Intelligence
          </h3>
          <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
            A carefully orchestrated suite of tools designed to merge Earth observation, 
            orbital mechanics, and predictive AI into one seamless canvas.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Orbital Tracking (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group md:col-span-2 relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 p-8 md:p-12 min-h-[400px] flex flex-col justify-end"
          >
            {/* Animated Radar Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full" />
              {/* Radar sweep */}
              <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] origin-top-left animate-[spin_4s_linear_infinite] bg-gradient-to-br from-primary/40 to-transparent backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-primary/50 transition-all duration-500">
                <Radar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-3xl font-display font-medium text-white mb-3">Space Situational Awareness</h4>
              <p className="text-slate-400 font-light max-w-md mb-6 leading-relaxed">
                Monitor orbital debris, track active satellites, and predict conjunctions with high-fidelity propagation models in real-time.
              </p>
              <button className="text-sm font-mono text-primary flex items-center gap-2 group/btn">
                EXPLORE SSA <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: AI Analysis (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500 p-8 flex flex-col justify-end min-h-[400px]"
          >
            {/* AI Nodes Abstract BG */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
               <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
               <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
               <svg className="absolute inset-0 w-full h-full stroke-accent/20" fill="none">
                 <path d="M 50 150 Q 150 200 250 100" strokeWidth="1" strokeDasharray="4 4" />
               </svg>
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-accent/50 transition-all duration-500">
                <BrainCircuit className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-2xl font-display font-medium text-white mb-3">AI-Assisted Analysis</h4>
              <p className="text-slate-400 font-light mb-6 text-sm leading-relaxed">
                Automate feature extraction and anomaly detection across petabytes of telemetry and imagery.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Earth Observation (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 p-8 flex flex-col justify-end min-h-[400px]"
          >
            {/* Earth Map Abstract BG */}
            <div className="absolute inset-0 z-0 opacity-[0.15] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/40 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-emerald-500/50 transition-all duration-500">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-2xl font-display font-medium text-white mb-3">Earth Observation</h4>
              <p className="text-slate-400 font-light mb-6 text-sm leading-relaxed">
                Access fused high-resolution optical, synthetic aperture radar (SAR), and multispectral data streams.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Disaster Monitoring (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group md:col-span-2 relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-500 p-8 md:p-12 min-h-[400px] flex flex-col justify-end"
          >
            {/* Warning Pulse BG */}
            <div className="absolute top-0 right-0 p-12 z-0 opacity-20 pointer-events-none flex justify-end">
              <div className="relative flex items-center justify-center">
                <motion.div animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-32 h-32 bg-orange-500/30 rounded-full" />
                <motion.div animate={{ scale: [1, 3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute w-32 h-32 bg-orange-500/20 rounded-full" />
              </div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
              <div className="w-14 h-14 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-orange-500/50 transition-all duration-500">
                <ShieldAlert className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-3xl font-display font-medium text-white mb-3">Global Hazard Monitoring</h4>
              <p className="text-slate-400 font-light mb-6 leading-relaxed">
                Deploy rapid-response monitoring protocols. AURA-AI automatically tasks assets and fuses sensor data to monitor natural disasters in near real-time.
              </p>
              <button className="text-sm font-mono text-orange-400 flex items-center gap-2 group/btn">
                VIEW ACTIVE PROTOCOLS <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
