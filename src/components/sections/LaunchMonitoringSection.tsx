import React from 'react';
import { motion } from 'motion/react';

const VIDEO_SRC = "/videos/launch-bg.mp4";

export function LaunchMonitoringSection() {
  return (
    <section
      id="launch-monitor"
      className="relative w-full h-screen overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 bg-black"
    >
      {/* Layer 1 — Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Layer 2 — Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10" />

      {/* Layer 3 — Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-4xl flex flex-col items-start text-left"
      >
        <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight tracking-tight mb-6">
          Live Launch Monitor
        </h2>

        <p className="text-lg md:text-xl text-slate-300 font-body font-light leading-relaxed max-w-2xl mb-8">
          Track upcoming and ongoing orbital launches worldwide. Monitor launch vehicles, agencies, mission profiles, and countdown timers in real-time.
        </p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm"
        >
          Explore Launches
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
        </motion.button>
      </motion.div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
    </section>
  );
}
