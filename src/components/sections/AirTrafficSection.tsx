import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from 'motion/react';

/* ────────────────────────────────────────────────────────────────────────────
   Air Traffic Control — Scroll-Driven Cinematic Aircraft Sequence

   A 300vh section pinned via a sticky child. The user's scroll (0 → 1) drives a
   single hand-built SVG airliner through four stages:
     Stage 1 Idle        (0.00 – 0.20)  stationary, nav lights blink, no landing lights
     Stage 2 Taxi        (0.20 – 0.50)  slow controlled roll, landing lights on
     Stage 3 Takeoff roll(0.50 – 0.80)  acceleration + motion blur, stays low
     Stage 4 Rotation    (0.80 – 1.00)  nose-up rotation, lift-off toward upper-right
   Scrolling up reverses everything naturally (it is scroll-linked, not a loop).
──────────────────────────────────────────────────────────────────────────── */

// Stage breakpoints reused across every scroll-linked transform.
const STAGES = [0, 0.2, 0.5, 0.8, 1] as const;

// ── Photorealistic commercial airliner image (side profile, facing right) ──────
function Airliner({
  landingLightOpacity,
}: {
  landingLightOpacity: MotionValue<number>;
}) {
  return (
    <div className="relative w-full h-full select-none pointer-events-none overflow-visible">
      {/* Photorealistic airliner image, mirrored to face right */}
      <img
        src="/airliner_cutout.png?v=2"
        alt="Airliner"
        className="w-full h-full object-cover"
        style={{
          transform: 'scaleX(-1)',
        }}
      />

      {/* Nav light — visible wingtip (green, starboard) */}
      <span
        className="absolute rounded-full bg-[#22c55e]"
        style={{
          left: '69%',
          top: '52%',
          width: '6px',
          height: '6px',
          boxShadow: '0 0 12px #22c55e, 0 0 24px #22c55e',
          transform: 'translate(-50%, -50%)',
          animation: 'atc-blink 1.6s ease-in-out infinite',
        }}
      />

      {/* Tail anti-collision strobe (white) */}
      <span
        className="absolute rounded-full bg-white"
        style={{
          left: '11.8%',
          top: '32.5%',
          width: '5px',
          height: '5px',
          boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
          transform: 'translate(-50%, -50%)',
          animation: 'atc-strobe 2.4s linear infinite',
        }}
      />

      {/* Red beacon under the belly */}
      <span
        className="absolute rounded-full bg-[#ef4444]"
        style={{
          left: '42.5%',
          top: '56.5%',
          width: '5px',
          height: '5px',
          boxShadow: '0 0 10px #ef4444, 0 0 20px #ef4444',
          transform: 'translate(-50%, -50%)',
          animation: 'atc-blink 1.1s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// ── Static cinematic runway scene — side view (dusk/night) ──────────────────
// The runway is a flat horizontal strip at the bottom of the viewport, matching
// the side-profile perspective of the aircraft.
const RUNWAY_TOP = 74; // % from top where the runway surface begins

function RunwayScene() {
  // Horizontal edge lights along the top edge of the runway strip.
  const edgeLights = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        x: (i / 27) * 100,           // evenly spaced across full width
        delay: (i % 6) * 0.3,
      })),
    []
  );

  // Horizontal centerline dashes.
  const centerlineDashes = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => ({ x: (i / 17) * 100 })),
    []
  );

  // Distant airport / city lights scattered just above the horizon.
  const distantLights = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        x: (i * 41) % 100,
        y: RUNWAY_TOP - 2 - ((i * 7) % 6),
        size: 1 + ((i * 5) % 3) * 0.6,
        warm: i % 3 === 0,
        delay: (i % 8) * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Night sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #030508 0%, #060a12 30%, #080d18 55%, #09101a 74%, #0a111c 100%)',
        }}
      />

      {/* Warm horizon glow just above the runway line */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: `${RUNWAY_TOP - 18}%`,
          height: '22%',
          background:
            'radial-gradient(ellipse 90% 100% at 50% 100%, rgba(255,140,60,0.13) 0%, rgba(255,100,40,0.05) 50%, transparent 80%)',
        }}
      />

      {/* Cool upper sky glow */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '50%',
          background:
            'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(30,60,120,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Distant airport / city lights near the horizon */}
      {distantLights.map((l, i) => (
        <span
          key={`dl-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: l.size,
            height: l.size,
            background: l.warm ? '#ffd9a0' : '#b8d0ff',
            boxShadow: `0 0 ${l.size * 4}px ${l.warm ? 'rgba(255,195,110,0.75)' : 'rgba(160,200,255,0.65)'}`,
            animation: `atc-blink ${3 + (i % 4)}s ease-in-out ${l.delay}s infinite`,
          }}
        />
      ))}

      {/* Horizon line — thin luminous stripe where sky meets tarmac */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: `${RUNWAY_TOP}%`,
          height: 1,
          background: 'linear-gradient(to right, transparent 0%, rgba(180,210,255,0.25) 20%, rgba(200,220,255,0.5) 50%, rgba(180,210,255,0.25) 80%, transparent 100%)',
        }}
      />

      {/* ── Runway surface (flat horizontal tarmac) ── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: `${RUNWAY_TOP}%`,
          background:
            'linear-gradient(to bottom, #111620 0%, #0e1319 35%, #0b1016 70%, #090e13 100%)',
        }}
      />
      {/* Slight reflective sheen on tarmac near the horizon */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: `${RUNWAY_TOP}%`,
          height: '10%',
          background:
            'linear-gradient(to bottom, rgba(100,140,200,0.10) 0%, transparent 100%)',
        }}
      />

      {/* Edge lights — white/blue dots running along the top edge of the runway */}
      {edgeLights.map((l, i) => (
        <span
          key={`el-${i}`}
          className="absolute -translate-x-1/2 rounded-full"
          style={{
            left: `${l.x}%`,
            top: `${RUNWAY_TOP}%`,
            marginTop: -3,
            width: 5,
            height: 5,
            background: '#cde3ff',
            boxShadow: '0 0 8px rgba(180,210,255,0.9), 0 0 16px rgba(140,180,255,0.5)',
            animation: `atc-blink ${2.5 + (i % 3) * 0.5}s ease-in-out ${l.delay}s infinite`,
          }}
        />
      ))}

      {/* Bottom edge lights — dimmer row along the very bottom of the frame */}
      {edgeLights.filter((_, i) => i % 2 === 0).map((l, i) => (
        <span
          key={`bel-${i}`}
          className="absolute -translate-x-1/2 rounded-full"
          style={{
            left: `${l.x * 1.04}%`,
            bottom: '1%',
            width: 3.5,
            height: 3.5,
            background: '#aac8ff',
            boxShadow: '0 0 6px rgba(150,190,255,0.7)',
            opacity: 0.55,
            animation: `atc-blink ${3 + (i % 3) * 0.6}s ease-in-out ${l.delay + 0.3}s infinite`,
          }}
        />
      ))}

      {/* Centerline dashes — horizontal, centered vertically on the runway strip */}
      {centerlineDashes.map((d, i) => (
        <span
          key={`cd-${i}`}
          className="absolute rounded-sm"
          style={{
            left: `${d.x * 0.98 + 1}%`,
            top: `${RUNWAY_TOP + (100 - RUNWAY_TOP) * 0.44}%`,
            width: '3.8%',
            height: 2,
            background: 'rgba(210,220,235,0.35)',
            transform: 'translateY(-50%)',
          }}
        />
      ))}

      {/* Drifting atmospheric ground haze */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: `${RUNWAY_TOP - 6}%`,
          height: '18%',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(110,130,175,0.08) 50%, transparent 100%)',
          animation: 'atc-haze 16s ease-in-out infinite',
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 95% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {/* Dark top vignette so text stays readable */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: '25%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
      />
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export function AirTrafficSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dims, setDims] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Manual scroll progress — bypasses Framer Motion's useScroll which has
  // unreliable behaviour when the scroll container is set via getElementById.
  // Progress maps 0→1 over (sectionHeight - viewportHeight), matching the
  // sticky pinning zone so the plane animation completes while still visible.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const container = document.getElementById('theme-landing-container');
    const section = sectionRef.current;
    if (!container || !section) return;

    // Walk offsetParent chain to get true offset from scroll container
    const getTrueOffset = (el: HTMLElement): number => {
      let offset = 0;
      let current: HTMLElement | null = el;
      while (current && current !== container) {
        offset += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      return offset;
    };

    const onScroll = () => {
      const sectionTop = getTrueOffset(section);
      const sectionHeight = section.offsetHeight;
      const viewportHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      // Equivalent to useScroll offset ['start start', 'end end']
      const totalScroll = sectionHeight - viewportHeight;
      if (totalScroll <= 0) return;
      const raw = (scrollTop - sectionTop) / totalScroll;
      scrollYProgress.set(Math.max(0, Math.min(1, raw)));
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial calculation

    return () => container.removeEventListener('scroll', onScroll);
  }, [scrollYProgress]);

  const planeW = Math.min(713, dims.w * 0.53);
  const planeH = (planeW * 220) / 640;

  // Set the plane's top so that the wheels rest exactly on the horizontal runway line, lowered by 8px.
  const groundY = dims.h * (RUNWAY_TOP / 100) - planeH * 0.77 + 8;

  // Aircraft box position — x travels from off-screen-left through the frame and beyond.
  const x = useTransform(
    scrollYProgress,
    [...STAGES],
    [-0.04, -0.04, 0.16, 0.54, 1.28].map((f) => f * dims.w)
  );
  // y stays on the ground until rotation stage, then climbs out to upper-right.
  const y = useTransform(
    scrollYProgress,
    [...STAGES],
    [groundY, groundY, groundY, groundY - planeH * 0.06, groundY - dims.h * 0.74]
  );
  const rotate = useTransform(scrollYProgress, [...STAGES], [0, 0, 0, -4, -14]);
  const scale = useTransform(scrollYProgress, [...STAGES], [1, 1, 1, 1.06, 0.7]);

  // Directional speed is suggested with a blur that peaks during the takeoff roll.
  const blurPx = useTransform(scrollYProgress, [...STAGES], [0, 0, 0.6, 3.2, 1.4]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  // Landing lights illuminate as taxi begins; engine heat fades as it starts moving.
  const landingLightOpacity = useTransform(scrollYProgress, [0.2, 0.28], [0, 1]);
  const heatOpacity = useTransform(scrollYProgress, [0, 0.18, 0.3], [0.85, 0.85, 0]);

  // Speed streaks fade in during the takeoff roll then vanish at rotation.
  const streakOpacity = useTransform(scrollYProgress, [0.5, 0.62, 0.85], [0, 0.5, 0]);

  return (
    <section ref={sectionRef} id="air-traffic" className="relative w-full bg-black" style={{ height: '300vh' }}>
      {/* Pinned cinematic stage — stays fixed while user scrolls through flow spacers below */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
        <RunwayScene />

        {/* Engine heat shimmer (idle), pinned just behind the engine */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{
            left: x,
            top: y,
            width: planeW,
            height: planeH,
            opacity: heatOpacity,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              left: '38%',
              top: '64%',
              width: '20%',
              height: '14%',
              background: 'radial-gradient(ellipse, rgba(255,200,150,0.5) 0%, transparent 70%)',
              filter: 'blur(6px)',
              animation: 'atc-heat 0.45s ease-in-out infinite',
            }}
          />
        </motion.div>

        {/* Speed streaks during the takeoff roll — aligned just above the runway line */}
        <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: streakOpacity }}>
          {[-4, 0, 4].map((offsetPct, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${RUNWAY_TOP + offsetPct}%`,
                left: '2%',
                width: '64%',
                height: 1.5,
                background: 'linear-gradient(to right, transparent, rgba(190,210,255,0.65), transparent)',
              }}
            />
          ))}
        </motion.div>

        {/* The aircraft */}
        <motion.div
          className="absolute z-20"
          style={{
            left: 0,
            top: 0,
            x,
            y,
            width: planeW,
            height: planeH,
            rotate,
            scale,
            filter,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <Airliner landingLightOpacity={landingLightOpacity} />
        </motion.div>

        {/* Fixed title + description on the left (text sits in front of the nose) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute z-30 top-1/2 -translate-y-1/2 left-8 md:left-16 lg:left-24 max-w-xl pointer-events-none"
        >
          <span className="text-sm font-body font-medium tracking-[0.2em] uppercase text-emerald-400/80 mb-4 block">
            Aviation Intelligence
          </span>
          <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight tracking-tight mb-6">
            Airspace Monitoring
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-body font-light leading-relaxed mb-8">
            Monitor global commercial aviation and military flights in real-time. View active
            flights, routes, altitudes, and speeds powered by OpenSky Network ADS-B feeds.
          </p>
          <button className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm pointer-events-auto">
            <span>Access Flight Radar</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Bottom fade so the next section emerges naturally beneath the climb-out */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>

      {/*
        Flow-based scroll spacers — REAL layout children (not absolute-positioned).
        CSS scroll-snap reliably detects snap points only on flow-positioned children.
        The sticky div above stays pinned on screen while these spacers scroll beneath it.

        Snap architecture (4 total steps):
          Step 1 @ 0vh   → LazySection wrapper (snap-start snap-always) → plane idle
          Step 2 @ 100vh → first spacer below → plane taxiing
          Step 3 @ 200vh → second spacer below → takeoff roll / rotation
          Step 4 @ 300vh → next LazySection (Asteroid) → plane airborne & gone
      */}
      <div className="h-screen snap-start snap-always" aria-hidden="true" />
      <div className="h-screen snap-start snap-always" aria-hidden="true" />
    </section>
  );
}
