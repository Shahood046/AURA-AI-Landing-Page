import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

export function SpaceWeatherSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px" });
  const videoRef = useRef<HTMLVideoElement>(null);

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
      id="space-weather"
      className="relative w-full h-screen overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 bg-black"
    >
      {/* Solar Activity Video Loop (placed at the right of the screen) */}
      <video
        ref={videoRef}
        src="/solar_activity.mp4"
        loop
        muted
        playsInline
        className="absolute top-0 right-0 w-[55%] h-full object-cover opacity-60 z-0 pointer-events-none select-none"
      />

      {/* Soft ambient solar glow (right of center) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 75% at 66% 48%, rgba(251,146,60,0.10) 0%, transparent 70%)' }}
      />
      {/* Left darkening for heading readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 25%, transparent 48%)' }}
      />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-30 w-full max-w-4xl flex flex-col items-start text-left font-body"
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-400/80 font-mono" style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Solar Telemetry
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight tracking-tight mb-6">
          Space Weather Intelligence
        </h2>
        <p className="text-lg md:text-xl text-slate-300 font-body font-light leading-relaxed max-w-2xl mb-8">
          Monitor solar activity, geomagnetic storms, and ionizing radiation events. Track solar flares,
          solar wind velocity, and auroral activity index — powered by NOAA SWPC telemetry.
        </p>
        <button
          className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm"
        >
          Monitor Solar Activity
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </motion.div>
    </section>
  );
}
