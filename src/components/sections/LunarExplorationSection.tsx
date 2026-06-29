import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { SectionWrapper } from './SectionWrapper';

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px" });
  const [progress, setProgress] = useState(0.38); // starts around Day 11.2 (Waxing Gibbous)
  const [isPlaying, setIsPlaying] = useState(true);

  const stars = useMemo(() => generateStars(70), []);

  // Butter-smooth delta-time loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying || !isInView) return;
    let animId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = Math.min(time - lastTime, 32); // cap frame delta at 32ms to eliminate lag-induced jumps
      // 0.002 progress step roughly every 45ms (1 / 500 step)
      // speed = 0.000044 progress steps per millisecond
      const step = delta * 0.000044;
      setProgress((prev) => (prev + step) % 1.0);
      lastTime = time;
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isInView]);

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
    <section
      ref={sectionRef}
      id="lunar-hub"
      className="relative w-full h-screen overflow-hidden flex flex-col justify-end bg-black px-8 md:px-16 lg:px-24"
    >
      {/* Top right live phase status badge */}
      <div className="absolute top-12 right-8 md:right-16 lg:right-24 z-20 pointer-events-none">
        <span className="font-mono text-xs text-white/60 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm uppercase tracking-widest flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
          {getPhaseName(progress)} &bull; Day {day.toFixed(1)} &bull; {illumination.toFixed(0)}% Illum
        </span>
      </div>

      {/* ─── Main Night Sky Visualizer (Centered Background) ─── */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Twinkling Star Field across the entire section background */}
        <TwinklingStars stars={stars} />

        {/* Orbit Path and Moon (in a top-half container) */}
        <div className="absolute top-16 left-0 w-full h-[50%] pointer-events-none">
          {/* SVG Curved Orbital Arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 8,80 Q 50,-5 92,80"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.4"
              strokeDasharray="1.5 2.5"
            />
          </svg>

          {/* Major Phase Markers along the orbit */}
          {MARKERS.map((m, idx) => {
            const pos = getOrbitCoords(m.t);
            return (
              <div
                key={idx}
                className="absolute flex flex-col items-center scale-100 opacity-60"
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
                <span className="text-sm md:text-base mt-1 opacity-80">{m.emoji}</span>
              </div>
            );
          })}

          {/* Glowing Traveler Moon */}
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
      </div>

      {/* Centered Content at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl mx-auto text-center flex flex-col items-center pb-20 md:pb-24 lg:pb-28 pointer-events-none mt-auto"
      >
        <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-slate-400/90 mb-4 block">
          Lunar Science
        </span>

        <h2 className="text-5xl md:text-6xl font-heading italic text-white leading-[1.1] tracking-tight mb-4">
          Lunar Exploration Hub
        </h2>



        <p className="text-base text-slate-300 font-body font-light leading-relaxed max-w-xl">
          Track lunar phases based on your location, explore lunar surface features, and stay updated with lunar mission data and exploration timelines.
        </p>
      </motion.div>

      {/* Bottom border separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
    </section>
  );
}
