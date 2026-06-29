import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { BlurText } from './BlurText';
import { WovenCanvas } from './ui/woven-light-hero';

// Static import for FooterCTA since it's the bottom and lightweight
import { FooterCTA } from './sections/FooterCTA';

// Lazy loaded components (named exports mapped to default)
const LaunchMonitoringSection = lazy(() => import('./sections/LaunchMonitoringSection').then(m => ({ default: m.LaunchMonitoringSection })));
const DisasterIntelligenceSection = lazy(() => import('./sections/DisasterIntelligenceSection').then(m => ({ default: m.DisasterIntelligenceSection })));
const AirTrafficSection = lazy(() => import('./sections/AirTrafficSection').then(m => ({ default: m.AirTrafficSection })));
const AsteroidMonitoringSection = lazy(() => import('./sections/AsteroidMonitoringSection').then(m => ({ default: m.AsteroidMonitoringSection })));
const SpaceWeatherSection = lazy(() => import('./sections/SpaceWeatherSection').then(m => ({ default: m.SpaceWeatherSection })));
const LunarExplorationSection = lazy(() => import('./sections/LunarExplorationSection').then(m => ({ default: m.LunarExplorationSection })));
const AstronomyGallerySection = lazy(() => import('./sections/AstronomyGallerySection').then(m => ({ default: m.AstronomyGallerySection })));
const EOAnalystSection = lazy(() => import('./sections/EOAnalystSection').then(m => ({ default: m.EOAnalystSection })));

interface LazySectionProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  height: string;
  id?: string;
}

function LazySection({ importFunc, height, id }: LazySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "800px", once: true });
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (isInView && !Component) {
      importFunc().then(mod => {
        setComponent(() => mod.default);
      });
    }
  }, [isInView, Component, importFunc]);

  return (
    <div ref={containerRef} id={id} className={`w-full relative ${height} snap-start snap-always`}>
      {Component ? (
        <Suspense fallback={<div className="absolute inset-0 bg-black flex items-center justify-center text-white/20 text-xs font-mono">LOADING SYSTEM...</div>}>
          <Component />
        </Suspense>
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}

export function ThemeLandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const isHeroInView = useInView(heroRef, { margin: "300px" });

  return (
    <div id="theme-landing-container" className="w-full h-screen overflow-y-auto snap-y snap-mandatory bg-black text-white font-body selection:bg-white/30 selection:text-white relative">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between">
        <div className="w-32 h-12 rounded-full liquid-glass flex items-center justify-center pointer-events-auto cursor-pointer">
          <span className="font-heading italic text-xl tracking-wider mt-1">AURA-AI</span>
        </div>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden flex flex-col bg-black snap-start snap-always">
        {/* Background Visual */}
        {isHeroInView && <WovenCanvas />}
        
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center pt-24 pb-20 px-8 md:px-16 lg:px-24 pointer-events-none max-w-4xl">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center mb-6 w-max"
          >
            <span className="text-sm text-white/90 font-medium">Earth and Space, Unified in Real Time.</span>
          </motion.div>

          <BlurText 
            text="The Operating System for Earth and Space Intelligence"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl tracking-[-4px]"
            delayOffset={0.5}
            justify="flex-start"
          />

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="mt-6 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-left"
          >
            Track over 20,000 active satellites while monitoring launches, disasters, aircraft, space weather, and Earth observation through a unified intelligence platform powered by real-time data and AI.
          </motion.p>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-6 pointer-events-auto"
          >
            <button className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
              Launch AURA-AI
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </button>
            <button className="text-sm font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2">
              Explore Live Globe
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </button>
          </motion.div>

        </div>


        {/* Gradient fade to blend into the next section */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
      </section>

      {/* --- STORY SECTIONS (User's exact order, lazy loaded on scroll) --- */}
      {/* 10. AI Earth Observation Analyst (Moved to second position after Hero) */}
      <LazySection 
        importFunc={() => import('./sections/EOAnalystSection').then(m => ({ default: m.EOAnalystSection }))} 
        height="min-h-screen" 
        id="eo-analyst"
      />

      {/* 3. Live Launch Monitor */}
      <LazySection 
        importFunc={() => import('./sections/LaunchMonitoringSection').then(m => ({ default: m.LaunchMonitoringSection }))} 
        height="h-screen" 
        id="launch-monitor"
      />

      {/* 4. Earth Events & Disaster Intelligence */}
      <LazySection 
        importFunc={() => import('./sections/DisasterIntelligenceSection').then(m => ({ default: m.DisasterIntelligenceSection }))} 
        height="h-screen" 
        id="disaster-intelligence"
      />

      {/* 5. Air Traffic Operations (scroll-driven 300vh) */}
      <LazySection 
        importFunc={() => import('./sections/AirTrafficSection').then(m => ({ default: m.AirTrafficSection }))} 
        height="h-[300vh]" 
        id="air-traffic"
      />

      {/* 6. Asteroid Monitoring Center */}
      <LazySection 
        importFunc={() => import('./sections/AsteroidMonitoringSection').then(m => ({ default: m.AsteroidMonitoringSection }))} 
        height="h-screen" 
        id="asteroid-monitoring"
      />

      {/* 7. Space Weather Center */}
      <LazySection 
        importFunc={() => import('./sections/SpaceWeatherSection').then(m => ({ default: m.SpaceWeatherSection }))} 
        height="h-screen" 
        id="space-weather"
      />

      {/* 8. Lunar Exploration Hub */}
      <LazySection 
        importFunc={() => import('./sections/LunarExplorationSection').then(m => ({ default: m.LunarExplorationSection }))} 
        height="h-screen" 
        id="lunar-hub"
      />

      {/* 9. Astronomy Gallery */}
      <LazySection 
        importFunc={() => import('./sections/AstronomyGallerySection').then(m => ({ default: m.AstronomyGallerySection }))} 
        height="min-h-screen" 
        id="astronomy-gallery"
      />

      {/* --- FOOTER CTA --- */}
      <div className="snap-start snap-always">
        <FooterCTA />
      </div>

    </div>
  );
}
