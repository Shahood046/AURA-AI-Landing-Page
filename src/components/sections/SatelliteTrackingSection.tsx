import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Satellite, Radio, Globe, Search, Layers } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

/* ── helper data ─────────────────────────────────────────────── */
const ACCENT = '#38bdf8';

interface SatEntry {
  name: string;
  norad: string;
  alt: string;
  speed: string;
  orbit: string;
}

const SAT_FEED: SatEntry[] = [
  { name: 'ISS (ZARYA)',       norad: '25544', alt: '408 km',   speed: '7.66 km/s', orbit: 'LEO' },
  { name: 'STARLINK-5291',    norad: '58401', alt: '550 km',   speed: '7.59 km/s', orbit: 'LEO' },
  { name: 'COSMOS 2560',      norad: '53312', alt: '19,130 km',speed: '3.87 km/s', orbit: 'MEO' },
  { name: 'GPS BIIR-2',       norad: '24876', alt: '20,200 km',speed: '3.87 km/s', orbit: 'MEO' },
  { name: 'GOES-18',          norad: '51850', alt: '35,786 km',speed: '3.07 km/s', orbit: 'GEO' },
  { name: 'INTELSAT 40E',     norad: '56174', alt: '35,786 km',speed: '3.07 km/s', orbit: 'GEO' },
  { name: 'TIANGONG',         norad: '54216', alt: '389 km',   speed: '7.68 km/s', orbit: 'LEO' },
  { name: 'ONEWEB-0568',      norad: '56092', alt: '1,200 km', speed: '7.31 km/s', orbit: 'LEO' },
  { name: 'GALILEO-SAT-31',   norad: '55721', alt: '23,222 km',speed: '3.59 km/s', orbit: 'MEO' },
  { name: 'MUOS-5',           norad: '41622', alt: '35,786 km',speed: '3.07 km/s', orbit: 'GEO' },
  { name: 'STARLINK-4817',    norad: '53901', alt: '550 km',   speed: '7.59 km/s', orbit: 'LEO' },
  { name: 'IRIDIUM 180',      norad: '56803', alt: '780 km',   speed: '7.45 km/s', orbit: 'LEO' },
];

const FEATURES = [
  { label: 'Real-time Positions', icon: Satellite },
  { label: 'TLE Management',     icon: Layers },
  { label: 'Category Browsing',  icon: Globe },
  { label: 'Speed & Altitude',   icon: Radio },
  { label: 'Search & Filter',    icon: Search },
];

/* ── satellite dots on each ring ─────────────────────────────── */
interface OrbitDot {
  id: number;
  ring: number;       // 0-3
  startAngle: number; // degrees
  duration: number;   // seconds for full orbit
  size: number;
  glow: boolean;
}

const ORBIT_DOTS: OrbitDot[] = [
  { id: 1,  ring: 0, startAngle: 0,   duration: 6,  size: 4, glow: true },
  { id: 2,  ring: 0, startAngle: 90,  duration: 6,  size: 3, glow: false },
  { id: 3,  ring: 0, startAngle: 200, duration: 6,  size: 3, glow: true },
  { id: 4,  ring: 0, startAngle: 310, duration: 6,  size: 3, glow: false },
  { id: 5,  ring: 1, startAngle: 45,  duration: 10, size: 4, glow: true },
  { id: 6,  ring: 1, startAngle: 160, duration: 10, size: 3, glow: false },
  { id: 7,  ring: 1, startAngle: 270, duration: 10, size: 4, glow: true },
  { id: 8,  ring: 2, startAngle: 30,  duration: 16, size: 5, glow: true },
  { id: 9,  ring: 2, startAngle: 180, duration: 16, size: 3, glow: false },
  { id: 10, ring: 2, startAngle: 300, duration: 16, size: 4, glow: true },
  { id: 11, ring: 3, startAngle: 60,  duration: 24, size: 5, glow: true },
  { id: 12, ring: 3, startAngle: 210, duration: 24, size: 4, glow: false },
];

const RING_RADII = [18, 30, 42, 54]; // percentage of container half-size

/* ── component ───────────────────────────────────────────────── */
export function SatelliteTrackingSection() {
  /* animated counter 0 → 8432 */
  const [count, setCount] = useState(0);
  const TARGET = 8432;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const DURATION = 2400; // ms
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setCount(Math.round(eased * TARGET));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* scrolling data feed */
  const [feedIdx, setFeedIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFeedIdx((i) => (i + 1) % SAT_FEED.length), 1800);
    return () => clearInterval(id);
  }, []);

  const visibleFeed = useMemo(() => {
    const items: SatEntry[] = [];
    for (let i = 0; i < 6; i++) {
      items.push(SAT_FEED[(feedIdx + i) % SAT_FEED.length]);
    }
    return items;
  }, [feedIdx]);

  /* simulated scan timer */
  const [scanMs, setScanMs] = useState(0.84);
  useEffect(() => {
    const id = setInterval(() => {
      setScanMs(+(0.7 + Math.random() * 0.5).toFixed(2));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <SectionWrapper
      id="satellite-tracking"
      index={2}
      totalSections={10}
      label="Orbital Awareness"
      title="Satellite Tracking System"
      description="Track 8,000+ active satellites in real-time. Monitor orbital positions, speeds, altitudes, and TLE data across LEO, MEO, and GEO orbits with sub-second refresh rates."
      accentColor={ACCENT}
    >
      {/* ───── Main Layout ───── */}
      <div className="flex flex-col gap-6">

        {/* ── Row 1: Radar + Data Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

          {/* ── Large Orbital Radar Panel ── */}
          <div className="liquid-glass relative w-full rounded-2xl border border-white/5 overflow-hidden"
               style={{ minHeight: 500, background: 'radial-gradient(ellipse at center, #0c192d 0%, #000 70%)' }}>

            {/* subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]"
                 style={{
                   backgroundImage:
                     'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                   backgroundSize: '40px 40px',
                 }}
            />

            {/* cross-hairs */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />

            {/* concentric orbit rings */}
            {RING_RADII.map((r, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${r * 2}%`,
                  height: `${r * 2}%`,
                  left: `${50 - r}%`,
                  top: `${50 - r}%`,
                  borderColor: `${ACCENT}18`,
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
              />
            ))}

            {/* Ring labels */}
            <span className="absolute font-mono text-[9px] tracking-widest uppercase"
                  style={{ left: '50%', top: `${50 - RING_RADII[0] - 2}%`, transform: 'translateX(-50%)', color: `${ACCENT}60` }}>
              LEO
            </span>
            <span className="absolute font-mono text-[9px] tracking-widest uppercase"
                  style={{ left: '50%', top: `${50 - RING_RADII[1] - 2}%`, transform: 'translateX(-50%)', color: `${ACCENT}60` }}>
              MEO-I
            </span>
            <span className="absolute font-mono text-[9px] tracking-widest uppercase"
                  style={{ left: '50%', top: `${50 - RING_RADII[2] - 2}%`, transform: 'translateX(-50%)', color: `${ACCENT}60` }}>
              MEO-II
            </span>
            <span className="absolute font-mono text-[9px] tracking-widest uppercase"
                  style={{ left: '50%', top: `${50 - RING_RADII[3] - 2}%`, transform: 'translateX(-50%)', color: `${ACCENT}60` }}>
              GEO
            </span>

            {/* center earth dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                 style={{ background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)` }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />

            {/* radar sweep */}
            <motion.div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: `${RING_RADII[3] * 2}%`,
                height: `${RING_RADII[3] * 2}%`,
                marginLeft: `-${RING_RADII[3]}%`,
                marginTop: `-${RING_RADII[3]}%`,
                transformOrigin: 'center center',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              {/* sweep wedge using conic gradient */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${ACCENT}22 10deg, transparent 45deg)`,
                }}
              />
              {/* sweep line */}
              <div className="absolute left-1/2 top-0 bottom-1/2 w-px"
                   style={{ background: `linear-gradient(to bottom, ${ACCENT}60, transparent)` }} />
            </motion.div>

            {/* orbiting satellite dots */}
            {ORBIT_DOTS.map((dot) => {
              const r = RING_RADII[dot.ring];
              return (
                <motion.div
                  key={dot.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: 0,
                    height: 0,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: dot.duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 0,
                  }}
                >
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: dot.size,
                      height: dot.size,
                      backgroundColor: ACCENT,
                      boxShadow: dot.glow ? `0 0 8px 2px ${ACCENT}88` : 'none',
                      top: -r * 2.5, // percentage → px approximation won't work, use vw trick below
                      left: -dot.size / 2,
                      transform: `rotate(${dot.startAngle}deg) translateY(-${r * 2.5}px)`,
                    }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              );
            })}

            {/* Use an SVG overlay for proper circular orbiting dots */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 500" fill="none">
              {/* re-draw orbit rings in SVG for dot pathing */}
              {RING_RADII.map((r, i) => {
                const cx = 300, cy = 250;
                const rx = r * 3, ry = r * 2.5;
                return (
                  <ellipse key={`ring-${i}`} cx={cx} cy={cy} rx={rx} ry={ry}
                           stroke={ACCENT} strokeOpacity={0.08} strokeWidth={0.5} fill="none" />
                );
              })}

              {/* orbiting dots along ellipses */}
              {ORBIT_DOTS.map((dot) => {
                const cx = 300, cy = 250;
                const rx = RING_RADII[dot.ring] * 3;
                const ry = RING_RADII[dot.ring] * 2.5;
                const pathId = `orbit-${dot.id}`;
                return (
                  <g key={dot.id}>
                    {/* invisible path for animation */}
                    <ellipse id={pathId} cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="none" />
                    <circle r={dot.size / 2} fill={ACCENT} opacity={0.9}>
                      {dot.glow && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
                      <animateMotion
                        dur={`${dot.duration}s`}
                        repeatCount="indefinite"
                        begin={`${(dot.startAngle / 360) * dot.duration}s`}
                      >
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                    </circle>
                    {/* glow halo */}
                    {dot.glow && (
                      <circle r={dot.size} fill={ACCENT} opacity={0.15} filter="url(#dotglow)">
                        <animateMotion
                          dur={`${dot.duration}s`}
                          repeatCount="indefinite"
                          begin={`${(dot.startAngle / 360) * dot.duration}s`}
                        >
                          <mpath href={`#${pathId}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* glow filter */}
              <defs>
                <filter id="dotglow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* HUD overlays */}
            {/* top-left: live status */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="liquid-glass rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
                <span className="font-mono text-xs tracking-wide" style={{ color: ACCENT }}>
                  LIVE TRACKING
                </span>
              </div>
              <div className="liquid-glass rounded-lg px-3 py-1.5 border border-white/5">
                <span className="font-mono text-[10px] text-white/40">SCAN RATE</span>
                <span className="font-mono text-xs ml-2" style={{ color: ACCENT }}>{scanMs}ms</span>
              </div>
            </div>

            {/* top-right: satellite count */}
            <div className="absolute top-4 right-4 z-10">
              <div className="liquid-glass rounded-lg px-4 py-2 border border-white/5 text-right">
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Active Satellites</div>
                <div className="font-mono text-2xl font-bold tracking-tight" style={{ color: ACCENT }}>
                  {count.toLocaleString()}
                </div>
              </div>
            </div>

            {/* bottom-left: orbit legend */}
            <div className="absolute bottom-4 left-4 z-10 flex gap-3">
              {[
                { label: 'LEO', range: '200-2000 km' },
                { label: 'MEO', range: '2,000-35,786 km' },
                { label: 'GEO', range: '35,786 km' },
              ].map((o) => (
                <div key={o.label} className="liquid-glass rounded-md px-2 py-1 border border-white/5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span className="font-mono text-[10px] text-white/60">{o.label}</span>
                  <span className="font-mono text-[9px] text-white/30">{o.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Data Feed Sidebar ── */}
          <div className="liquid-glass rounded-2xl border border-white/5 flex flex-col overflow-hidden"
               style={{ minHeight: 500 }}>
            {/* header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                <span className="font-mono text-xs text-white/70 uppercase tracking-widest">Live Feed</span>
              </div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            </div>

            {/* scrolling entries */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                {visibleFeed.map((sat, i) => (
                  <motion.div
                    key={`${sat.norad}-${feedIdx + i}`}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-white/90 truncate max-w-[160px]">{sat.name}</span>
                      <span className="font-mono text-[9px] rounded-full px-1.5 py-0.5 border"
                            style={{
                              color: ACCENT,
                              borderColor: `${ACCENT}30`,
                              backgroundColor: `${ACCENT}10`,
                            }}>
                        {sat.orbit}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/40">ALT <span className="text-white/60">{sat.alt}</span></span>
                      <span className="font-mono text-[10px] text-white/40">VEL <span className="text-white/60">{sat.speed}</span></span>
                    </div>
                    <div className="font-mono text-[9px] text-white/25 mt-0.5">NORAD {sat.norad}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* footer */}
            <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/30">UPD 0.8s</span>
              <span className="font-mono text-[10px]" style={{ color: `${ACCENT}80` }}>
                {SAT_FEED.length} sources
              </span>
            </div>
          </div>
        </div>

        {/* ── Row 2: Status Badges ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { orbit: 'LEO', tracked: '4,281', pct: 51 },
            { orbit: 'MEO', tracked: '2,847', pct: 34 },
            { orbit: 'GEO', tracked: '1,304', pct: 15 },
          ].map((stat) => (
            <motion.div
              key={stat.orbit}
              className="liquid-glass-strong rounded-xl border border-white/5 p-5 flex flex-col gap-3"
              whileHover={{ borderColor: `${ACCENT}40`, scale: 1.01 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-white tracking-wide">{stat.orbit}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: ACCENT, backgroundColor: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}>
                  TRACKED
                </span>
              </div>
              <div className="font-mono text-3xl font-bold" style={{ color: ACCENT }}>{stat.tracked}</div>
              {/* mini progress bar */}
              <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ACCENT }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/30">{stat.pct}% of total fleet</span>
            </motion.div>
          ))}
        </div>

        {/* ── Row 3: Feature Pills ── */}
        <div className="flex flex-wrap gap-3 pt-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                className="liquid-glass rounded-full px-4 py-2 text-xs font-mono flex items-center gap-2 border border-white/5 cursor-default"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ borderColor: `${ACCENT}50`, backgroundColor: `${ACCENT}08` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                <span className="text-white/70">{f.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
