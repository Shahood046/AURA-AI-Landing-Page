import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export function AirTrafficSection() {
  return (
    <SectionWrapper
      id="air-traffic"
      index={5}
      totalSections={10}
      label="Aviation Intelligence"
      title="Air Traffic Control"
      description="Monitor global commercial aviation and military flights in real-time. View active flights, routes, altitudes, and speeds powered by OpenSky Network ADS-B feeds."
      accentColor="#4ade80"
    >
      <button className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm">
        <span>Access Flight Radar</span>
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </SectionWrapper>
  );
}
