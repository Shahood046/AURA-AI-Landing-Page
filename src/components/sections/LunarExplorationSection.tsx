import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, MapPin, Calendar, Telescope, Play, Pause, RotateCcw } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const NEXT_EVENTS = [
  { label: 'Full Moon', date: 'Jun 11' },
  { label: 'New Moon', date: 'Jun 25' },
  { label: 'Lunar Eclipse', date: 'None' },
];

const FEATURE_PILLS = [
  'Phase Journey',
  'Location-Based',
  'Rise & Set Times',
  'Lunar Events',
  'Mission Data',
];

// Seeded random stars for a stable starfield
function generateStars(count: number) {
  const stars: { x: number; y: number; size: number; delay: number; duration: number }[] = [];
  let seed = 88;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.15 ? 2 : rand() < 0.4 ? 1.5 : 1,
      delay: rand() * 5,
      duration: 2.5 + rand() * 3.5,
    });
  }
  return stars;
}

// Bezier curve calculations for orbit:
// P0 = (8, 80), P1 = (50, -5), P2 = (92, 80)
const getOrbitCoords = (t: number) => {
  const x = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 50 + t * t * 92;
  const y = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * -5 + t * t * 80;
  return { x, y };
};

const MARKERS = [
  { t: 0.0, label: 'New', emoji: '🌑' },
  { t: 0.25, label: 'First Qtr', emoji: '🌓' },
  { t: 0.5, label: 'Full Moon', emoji: '🌕' },
  { t: 0.75, label: 'Last Qtr', emoji: '🌗' },
  { t: 1.0, label: 'New', emoji: '🌑' },
];

/* ──────────────────────── Memoized Subcomponents ──────────────────────── */

const TwinklingStars = React.memo(({ stars }: { stars: any[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.15, 0.85, 0.15] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});
TwinklingStars.displayName = 'TwinklingStars';

const NextEventsCard = React.memo(() => {
  return (
    <motion.div
      className="liquid-glass rounded-2xl border border-white/10 p-5 md:p-6"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-slate-300" />
        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest">
          Next Events
        </h4>
      </div>
      <div className="space-y-3">
        {NEXT_EVENTS.map((evt, idx) => (
          <motion.div
            key={evt.label}
            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  idx === 0
                    ? 'bg-slate-200 shadow-[0_0_6px_rgba(226,232,240,0.5)]'
                    : idx === 1
                    ? 'bg-slate-400'
                    : 'bg-slate-600'
                }`}
              />
              <span className="text-sm text-white/70 font-body">{evt.label}</span>
            </div>
            <span className="font-mono text-xs text-slate-300">{evt.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
NextEventsCard.displayName = 'NextEventsCard';

const ObserverLocationCard = React.memo(() => {
  return (
    <motion.div
      className="liquid-glass rounded-2xl border border-white/10 p-5 md:p-6"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-slate-300" />
        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest">
          Observer Location
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono block mb-1">
            Latitude
          </span>
          <span className="font-mono text-sm text-slate-200">33.6844° N</span>
        </div>
        <div>
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono block mb-1">
            Longitude
          </span>
          <span className="font-mono text-sm text-slate-200">73.0479° E</span>
        </div>
        <div>
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono block mb-1">
            Timezone
          </span>
          <span className="font-mono text-sm text-slate-200">UTC+5:00</span>
        </div>
        <div>
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono block mb-1">
            Altitude
          </span>
          <motion.span
            className="font-mono text-sm text-slate-200"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            42.3°
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
});
ObserverLocationCard.displayName = 'ObserverLocationCard';

const ActiveMissionsCard = React.memo(() => {
  return (
    <motion.div
      className="liquid-glass rounded-2xl border border-white/10 p-5 md:p-6"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Telescope className="w-4 h-4 text-slate-300" />
        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest">
          Active Missions
        </h4>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Artemis III', status: 'In Progress', progress: 68 },
          { name: 'SLIM Lander', status: 'On Surface', progress: 100 },
          { name: 'Chang\'e 7', status: 'Planning', progress: 22 },
        ].map((mission, idx) => (
          <div key={mission.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/77 font-body">{mission.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{mission.status}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: mission.progress === 100
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'linear-gradient(90deg, #64748b, #e2e8f0)',
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${mission.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 + idx * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});
ActiveMissionsCard.displayName = 'ActiveMissionsCard';


/* ──────────────────────── High-Fidelity Visual Moon ──────────────────────── */
function VisualMoon({ progress, illumination }: { progress: number; illumination: number }) {
  // Generate SVG path for the terminator boundary
  const getPathD = (p: number) => {
    if (p <= 0.5) {
      // Waxing
      const rx = Math.abs(50 - 200 * p);
      const sweep = p < 0.25 ? 0 : 1;
      return `M 50,0 A 50,50 0 0,1 50,100 A ${rx},50 0 0,${sweep} 50,0 Z`;
    } else {
      // Waning
      const rx = Math.abs(150 - 200 * p);
      const sweep = p < 0.75 ? 0 : 1;
      return `M 50,0 A 50,50 0 0,0 50,100 A ${rx},50 0 0,${sweep} 50,0 Z`;
    }
  };

  const pathD = getPathD(progress);

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 select-none">
      {/* Ambient Outer Glow (scales with illumination) - pure white-to-transparent, no blue hue */}
      <div
        className="absolute inset-0 rounded-full blur-[24px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${0.08 + (illumination / 100) * 0.42}) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]">
        <defs>
          {/* Mask for the illuminated (bright) side */}
          <mask id="lunar-mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <path d={pathD} fill="white" />
          </mask>
          {/* Clip path for circular moon: r=48 removes any edge fringes/artifacts */}
          <clipPath id="moon-clip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        {/* 1. BASE DARK HOLE (pure black, slightly smaller at r=47.5 to prevent edge peeking) */}
        <circle cx="50" cy="50" r="47.5" fill="#000000" />

        {/* 2. DARK SIDE (Earthshine texture, very low opacity, no filter for GPU performance) */}
        <image
          href="/lunar_surface_texture.png"
          x="1"
          y="1"
          width="98"
          height="98"
          clipPath="url(#moon-clip)"
          opacity="0.06"
        />

        {/* 3. BRIGHT SIDE (masked by terminator shape) */}
        <g mask="url(#lunar-mask)">
          {/* Base bright circle: slightly smaller at r=47.5 to ensure it never leaks under the clipped texture */}
          <circle cx="50" cy="50" r="47.5" fill="#ffffff" />
          {/* Photorealistic Moon texture */}
          <image
            href="/lunar_surface_texture.png"
            x="1"
            y="1"
            width="98"
            height="98"
            clipPath="url(#moon-clip)"
            opacity="0.96"
          />
        </g>

        {/* 4. Fine Neutral Rim Outline (prevents blue-ish/slate bleeding) */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
          style={{ mixBlendMode: 'screen' }}
        />
      </svg>
    </div>
  );
}

/* ──────────────────────── Main Section Component ──────────────────────── */
export function LunarExplorationSection() {
  const [progress, setProgress] = useState(0.38); // starts around Day 11.2 (Waxing Gibbous)
  const [isPlaying, setIsPlaying] = useState(true);

  const stars = useMemo(() => generateStars(70), []);

  // Butter-smooth delta-time loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      // 0.002 progress step roughly every 45ms (1 / 500 step)
      // speed = 0.000044 progress steps per millisecond
      const step = delta * 0.000044;
      setProgress((prev) => (prev + step) % 1.0);
      lastTime = time;
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Derived state values
  const day = progress * 29.53;
  const illumination = 50 * (1 - Math.cos(2 * Math.PI * progress));
  
  // Realistically varying observer metrics
  const distance = 384400 + Math.cos(progress * Math.PI * 2) * 18400;
  const formattedDistance = Math.round(distance).toLocaleString();

  const getPhaseName = (p: number) => {
    const d = p * 29.53;
    if (d >= 28.5 || d <= 1.0) return 'New Moon';
    if (d > 1.0 && d < 6.4) return 'Waxing Crescent';
    if (d >= 6.4 && d <= 8.4) return 'First Quarter';
    if (d > 8.4 && d < 13.8) return 'Waxing Gibbous';
    if (d >= 13.8 && d <= 15.8) return 'Full Moon';
    if (d > 15.8 && d < 21.1) return 'Waning Gibbous';
    if (d >= 21.1 && d <= 23.1) return 'Last Quarter';
    return 'Waning Crescent';
  };

  const getPhaseEmoji = (p: number) => {
    const d = p * 29.53;
    if (d >= 28.5 || d <= 1.0) return '🌑';
    if (d > 1.0 && d < 6.4) return '🌒';
    if (d >= 6.4 && d <= 8.4) return '🌓';
    if (d > 8.4 && d < 13.8) return '🌔';
    if (d >= 13.8 && d <= 15.8) return '🌕';
    if (d > 15.8 && d < 21.1) return '🌖';
    if (d >= 21.1 && d <= 23.1) return '🌗';
    return '🌘';
  };

  // Calculate moonrise/moonset dynamically based on phase
  const getMoonTimes = (p: number) => {
    const riseDecimal = (6 + p * 24) % 24;
    const setDecimal = (riseDecimal + 12) % 24;

    const formatTime = (decimal: number) => {
      const hours = Math.floor(decimal);
      const minutes = Math.floor((decimal - hours) * 60);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return {
      rise: formatTime(riseDecimal),
      set: formatTime(setDecimal),
    };
  };

  const times = useMemo(() => getMoonTimes(progress), [progress]);

  // Major floating labels appearing briefly
  const majorLabel = useMemo(() => {
    if (day >= 28.53 || day <= 1.0) return 'New Moon';
    if (day >= 6.38 && day <= 8.38) return 'First Quarter';
    if (day >= 13.76 && day <= 15.76) return 'Full Moon';
    if (day >= 21.15 && day <= 23.15) return 'Last Quarter';
    return null;
  }, [day]);

  const moonPos = getOrbitCoords(progress);

  return (
    <SectionWrapper
      id="lunar-hub"
      index={8}
      totalSections={10}
      label="Lunar Science"
      title="Lunar Exploration Hub"
      description="Track lunar phases based on your location, explore lunar surface features, and stay updated with lunar mission data and exploration timelines."
      accentColor="#e2e8f0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── Main Night Sky Visualizer (Left) ─── */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="liquid-glass rounded-2xl border border-white/10 relative overflow-hidden min-h-[460px] flex flex-col justify-between p-6">
            
            {/* Tweinkling Star Field (Memoized to prevent diffing during timer ticks) */}
            <TwinklingStars stars={stars} />

            {/* Glowing horizon ambient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />

            {/* Title Bar inside visualization */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Orbit Status</span>
                <span className="font-mono text-xs text-white/70 mt-0.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                  Day {day.toFixed(1)} / 29.5
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Phase</span>
                <span className="font-heading italic text-sm text-white mt-0.5 flex items-center gap-1.5">
                  {getPhaseEmoji(progress)} {getPhaseName(progress)}
                </span>
              </div>
            </div>

            {/* Orbit Dome Canvas */}
            <div className="relative flex-1 w-full my-8">
              {/* SVG Curved Orbital Arc */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 8,80 Q 50,-5 92,80"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.3"
                  strokeDasharray="1.5 1.5"
                />
              </svg>

              {/* Major Phase Markers along the orbit */}
              {MARKERS.map((m, idx) => {
                const pos = getOrbitCoords(m.t);
                return (
                  <div
                    key={idx}
                    className="absolute flex flex-col items-center pointer-events-none select-none"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y + 6}%`,
                      transform: 'translate(-50%, 0)',
                    }}
                  >
                    <div className="w-1 h-1 rounded-full bg-white/20 mb-1" />
                    <span className="text-[8px] font-mono text-white/30 whitespace-nowrap uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="text-[10px] mt-0.5 opacity-35">{m.emoji}</span>
                  </div>
                );
              })}

              {/* Glowing Traveler Moon (Hardware accelerated with translate3d and will-change) */}
              <div
                className="absolute"
                style={{
                  left: `${moonPos.x}%`,
                  top: `${moonPos.y}%`,
                  transform: 'translate3d(-50%, -50%, 0)',
                  zIndex: 20,
                  willChange: 'transform',
                }}
              >
                <VisualMoon progress={progress} illumination={illumination} />

                {/* Brief floating text for major phases */}
                <AnimatePresence>
                  {majorLabel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -15 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      {majorLabel}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Timeline Scrubbers */}
            <div className="relative z-10 w-full flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/30 text-white transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/30 text-white transition-colors"
                title="Reset to Day 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Slider scrubber */}
              <div className="flex-1 flex items-center gap-2">
                <span className="font-mono text-[9px] text-white/40">Day 0</span>
                <input
                  type="range"
                  min="0"
                  max="0.999"
                  step="0.001"
                  value={progress}
                  onChange={(e) => {
                    setProgress(parseFloat(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="flex-1 h-1 rounded-lg appearance-none cursor-pointer bg-white/10 accent-white outline-none focus:ring-1 focus:ring-white/30"
                />
                <span className="font-mono text-[9px] text-white/40">29.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Data Panels (Right) ─── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Moon Data Panel */}
          <motion.div
            className="liquid-glass rounded-2xl border border-white/10 p-5 md:p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-4 h-4 text-slate-300" />
              <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest">
                Lunar Telemetry
              </h4>
              <motion.div
                className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Illumination', value: `${illumination.toFixed(0)}%`, color: 'text-slate-200' },
                { label: 'Lunar Age', value: `${day.toFixed(1)} days`, color: 'text-slate-200' },
                { label: 'Distance', value: `${formattedDistance} km`, color: 'text-slate-200' },
                { label: 'Moonrise', value: times.rise, color: 'text-slate-200' },
                { label: 'Moonset', value: times.set, color: 'text-slate-200' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/40 font-body">{item.label}</span>
                  <span className={`font-mono text-sm ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
              {/* Illumination slider fill */}
              <div className="pt-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #475569, #ffffff)',
                      width: `${illumination}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Events Panel (Memoized) */}
          <NextEventsCard />

          {/* Observer Location Details (Memoized) */}
          <ObserverLocationCard />

          {/* Active Missions Card (Memoized) */}
          <ActiveMissionsCard />
        </div>
      </div>

      {/* ─── Feature Pills ─── */}
      <motion.div
        className="flex flex-wrap gap-3 mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {FEATURE_PILLS.map((pill, idx) => (
          <motion.span
            key={pill}
            className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/70 border border-white/10 font-body flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + idx * 0.08 }}
            whileHover={{
              borderColor: 'rgba(226,232,240,0.4)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#e2e8f0' }}
            />
            {pill}
          </motion.span>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
