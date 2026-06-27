import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export function SpaceWeatherSection() {
  return (
    <SectionWrapper
      id="space-weather"
      index={7}
      totalSections={10}
      label="Solar Telemetry"
      title="Space Weather Intelligence"
      description="Monitor solar activity, geomagnetic storms, and ionizing radiation events. Track solar flares, solar wind velocity, and auroral activity index powered by NOAA SWPC telemetry."
      accentColor="#f59e0b"
    >
      <button className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm">
        <span>Monitor Solar Activity</span>
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </SectionWrapper>
  );
}
