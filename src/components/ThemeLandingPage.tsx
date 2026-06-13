import React from 'react';
import { motion } from 'motion/react';
import { BlurText } from './BlurText';
import { WovenCanvas } from './ui/woven-light-hero';

// Sections in exact user-specified order
import { SatelliteTrackingSection } from './sections/SatelliteTrackingSection';
import { LaunchMonitoringSection } from './sections/LaunchMonitoringSection';
import { DisasterIntelligenceSection } from './sections/DisasterIntelligenceSection';
import { AirTrafficSection } from './sections/AirTrafficSection';
import { AsteroidMonitoringSection } from './sections/AsteroidMonitoringSection';
import { SpaceWeatherSection } from './sections/SpaceWeatherSection';
import { LunarExplorationSection } from './sections/LunarExplorationSection';
import { AstronomyGallerySection } from './sections/AstronomyGallerySection';
import { EOAnalystSection } from './sections/EOAnalystSection';
import { FooterCTA } from './sections/FooterCTA';

export function ThemeLandingPage() {
  return (
    <div className="w-full relative bg-black min-h-screen text-white font-body selection:bg-white/30 selection:text-white" style={{ scrollBehavior: 'smooth' }}>
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between">
        <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center pointer-events-auto cursor-pointer">
          <span className="font-heading italic text-2xl lowercase mt-1">a</span>
        </div>
        
        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center pointer-events-auto">
          {["Overview", "Live Globe", "Intelligence", "Platform", "Datacube"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors">
              {link}
            </a>
          ))}
          <button className="ml-2 bg-white text-black rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-1 hover:bg-white/90 transition-colors whitespace-nowrap">
            Launch App
            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </button>
        </div>

        <div className="w-12 h-12 invisible" aria-hidden="true" />
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col bg-black">
        {/* Background Visual */}
        <WovenCanvas />
        
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center pt-24 pb-20 px-8 md:px-16 lg:px-24 pointer-events-none max-w-4xl">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="liquid-glass rounded-full px-1.5 py-1.5 inline-flex items-center gap-3 pr-4 mb-6 w-max"
          >
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full">New</span>
            <span className="text-sm text-white/90 font-medium">Earth Never Sleeps: Live Global Intelligence</span>
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
            Monitor satellites, launches, disasters, aircraft, space weather, and Earth observation missions through a single interactive platform powered by real-time data and artificial intelligence.
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

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
            className="flex flex-col sm:flex-row items-stretch justify-start gap-4 mt-8 w-full max-w-md pointer-events-auto"
          >
            <div className="liquid-glass rounded-[1.25rem] p-4 w-[220px] flex flex-col">
              <svg className="w-6 h-6 text-white/80 mb-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <div className="mt-4">
                <div className="font-heading italic text-white text-3xl tracking-[-1px] leading-none">24/7</div>
                <div className="text-[11px] text-white/70 font-body mt-1 uppercase tracking-wider">Live Asset Tracking</div>
              </div>
            </div>
            
            <div className="liquid-glass rounded-[1.25rem] p-4 w-[220px] flex flex-col">
              <svg className="w-6 h-6 text-white/80 mb-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
              </svg>
              <div className="mt-4">
                <div className="font-heading italic text-white text-3xl tracking-[-1px] leading-none">8,432+</div>
                <div className="text-[11px] text-white/70 font-body mt-1 uppercase tracking-wider">Active Orbiting Satellites</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1.4 }}
           className="relative z-10 flex flex-col items-center gap-5 pb-10"
        >
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white">
            Collaborating with top aerospace pioneers globally
          </div>
          <div className="flex items-center gap-10 md:gap-16 font-heading italic text-white text-2xl md:text-3xl tracking-tight leading-none text-white/90 cursor-default">
            <span>Aeon</span>
            <span>Vela</span>
            <span>Apex</span>
            <span>Orbit</span>
            <span>Zeno</span>
          </div>
        </motion.div>

        {/* Gradient fade to blend into the next section */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
      </section>

      {/* --- STORY SECTIONS (User's exact order) --- */}
      {/* 2. Satellite Tracking System */}
      <SatelliteTrackingSection />

      {/* 3. Live Launch Monitor */}
      <LaunchMonitoringSection />

      {/* 4. Earth Events & Disaster Intelligence */}
      <DisasterIntelligenceSection />

      {/* 5. Air Traffic Operations */}
      <AirTrafficSection />

      {/* 6. Asteroid Monitoring Center */}
      <AsteroidMonitoringSection />

      {/* 7. Space Weather Center */}
      <SpaceWeatherSection />

      {/* 8. Lunar Exploration Hub */}
      <LunarExplorationSection />

      {/* 9. Astronomy Gallery */}
      <AstronomyGallerySection />

      {/* 10. AI Earth Observation Analyst */}
      <EOAnalystSection />

      {/* --- FOOTER CTA --- */}
      <FooterCTA />

    </div>
  );
}
