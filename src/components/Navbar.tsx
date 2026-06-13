import { motion } from 'motion/react';
import { Satellite } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
            <Satellite className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest text-white">
            AURA<span className="text-primary">-AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-slate-400">
          <a href="#platform" className="hover:text-white transition-colors">PLATFORM</a>
          <a href="#capabilities" className="hover:text-white transition-colors">CAPABILITIES</a>
          <a href="#intelligence" className="hover:text-white transition-colors">INTELLIGENCE</a>
        </div>
        
        <button className="hidden md:inline-flex px-6 py-2 border border-white/10 text-white text-xs font-mono tracking-widest hover:border-white/40 hover:bg-white/5 transition-all">
          INITIATE
        </button>
      </div>
    </motion.nav>
  );
}
