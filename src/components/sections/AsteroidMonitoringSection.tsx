import React from 'react';
import { motion } from 'motion/react';

export function AsteroidMonitoringSection() {
  return (
    <section
      id="asteroid-monitoring"
      className="relative w-full h-screen overflow-hidden flex items-center bg-black px-8 md:px-16 lg:px-24"
    >
      {/* Background Asteroid Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/asteroid.jpg?v=2"
          alt="Asteroid Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />
        {/* Subtle gradient to ensure text readability on the left without obscuring the Milky Way */}
        <div className="absolute inset-y-0 left-0 w-full md:w-2/5 bg-gradient-to-r from-black via-black/30 to-transparent z-10" />
        {/* Top-to-bottom fade to seamlessly blend with the preceding section */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-xl flex flex-col items-start text-left pointer-events-none"
      >
        <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-purple-400/90 mb-4 block">
          Space Intelligence
        </span>
        
        <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-[1.05] tracking-tight mb-6">
          Near-Earth <br />
          Object Monitor
        </h2>
        
        <p className="text-base md:text-lg text-slate-300 font-body font-light leading-relaxed mb-8 max-w-md">
          Monitor asteroids, comets and other near-Earth objects using real-time orbital predictions and close-approach analysis.
        </p>
        
        <button className="group text-sm font-semibold font-body text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 pointer-events-auto cursor-pointer bg-transparent border-none p-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-purple-500/50 after:scale-x-100 hover:after:scale-x-110 after:transition-transform">
          <span>Explore NEO Dashboard</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Bottom border separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
    </section>
  );
}
