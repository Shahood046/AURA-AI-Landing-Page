import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Shield, Crosshair, TrendingUp, Radar, Activity } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

/* ── static data ───────────────────────────────────────────────── */

const ASTEROIDS = [
  { id: 1, name: '2024 PT5', diameter: '50m', velocity: '14.2 km/s', miss: '0.03 AU', angle: 30, radius: 95, duration: 11, hazardous: true },
  { id: 2, name: '99942 Apophis', diameter: '370m', velocity: '30.7 km/s', miss: '0.12 AU', angle: 110, radius: 145, duration: 16, hazardous: true },
  { id: 3, name: '2023 DW', diameter: '40m', velocity: '24.5 km/s', miss: '0.08 AU', angle: 200, radius: 120, duration: 13, hazardous: false },
  { id: 4, name: '2015 TB145', diameter: '600m', velocity: '35.0 km/s', miss: '0.21 AU', angle: 275, radius: 170, duration: 18, hazardous: false },
  { id: 5, name: '101955 Bennu', diameter: '490m', velocity: '28.0 km/s', miss: '0.15 AU', angle: 340, radius: 155, duration: 15, hazardous: false },
  { id: 6, name: '2024 BX1', diameter: '12m', velocity: '18.3 km/s', miss: '0.02 AU', angle: 155, radius: 85, duration: 9, hazardous: true },
];

const CLOSE_APPROACHES = [
  { name: '2024 PT5', date: 'Jun 12, 2026', distance: '0.031 AU', size: '50m', hazard: 'HIGH' },
  { name: '2024 BX1', date: 'Jun 18, 2026', distance: '0.024 AU', size: '12m', hazard: 'MEDIUM' },
  { name: '99942 Apophis', date: 'Jun 25, 2026', distance: '0.119 AU', size: '370m', hazard: 'HIGH' },
  { name: '2023 DW', date: 'Jul 03, 2026', distance: '0.082 AU', size: '40m', hazard: 'LOW' },
];

const FEATURE_PILLS = ['NEO Tracking', 'Close Approaches', 'Hazard Assessment', 'Trajectory Analysis', 'NASA NEO API'];

/* ── helpers ───────────────────────────────────────────────────── */

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleDuration: Math.random() * 3 + 2,
  }));
}

const hazardColor = (h: string) =>
  h === 'HIGH' ? 'text-red-400' : h === 'MEDIUM' ? 'text-amber-400' : 'text-green-400';

const hazardBg = (h: string) =>
  h === 'HIGH'
    ? 'bg-red-500/10 border-red-500/20 text-red-400'
    : h === 'MEDIUM'
    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    : 'bg-green-500/10 border-green-500/20 text-green-400';

/* ── component ─────────────────────────────────────────────────── */

export function AsteroidMonitoringSection() {
  const stars = useMemo(() => generateStars(40), []);

  /* animated counters */
  const [neoCount, setNeoCount] = useState(34_201);
  const [closeCount, setCloseCount] = useState(12);
  const [hazCount] = useState(2);

  useEffect(() => {
    const t = setInterval(() => {
      setNeoCount((p) => p + Math.floor(Math.random() * 3));
      setCloseCount((p) => (Math.random() > 0.85 ? p + 1 : p));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  /* threat gauge sweep */
  const [gaugeValue, setGaugeValue] = useState(0.18);
  useEffect(() => {
    const t = setInterval(() => {
      setGaugeValue((p) => {
        const next = p + (Math.random() - 0.48) * 0.04;
        return Math.max(0.05, Math.min(0.35, next));
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  /* Earth Rotation and Drag States */
  const [earthRotation, setEarthRotation] = useState(0);
  const [isDraggingEarth, setIsDraggingEarth] = useState(false);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const earthRef = useRef<HTMLDivElement>(null);

  const getAngle = (clientX: number, clientY: number) => {
    if (!earthRef.current) return 0;
    const rect = earthRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDraggingEarth(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const angle = getAngle(clientX, clientY);
    startAngleRef.current = angle;
    startRotationRef.current = earthRotation;
  };

  // Auto-rotation effect
  useEffect(() => {
    if (isDraggingEarth) return;
    let animationId: number;
    const update = () => {
      setEarthRotation((prev) => (prev + 0.05) % 360);
      animationId = requestAnimationFrame(update);
    };
    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [isDraggingEarth]);

  useEffect(() => {
    if (!isDraggingEarth) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ('cancelable' in e && e.cancelable) {
        e.preventDefault();
      }
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const angle = getAngle(clientX, clientY);
      const angleDiff = angle - startAngleRef.current;
      setEarthRotation(startRotationRef.current + angleDiff);
    };

    const handleEnd = () => {
      setIsDraggingEarth(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingEarth]);

  return (
    <SectionWrapper
      id="asteroid-monitoring"
      index={6}
      totalSections={10}
      label="Planetary Defense"
      accentColor="#fb923c"
      title="Asteroid Monitoring Center"
      description="Track near-Earth objects using NASA NEO APIs. Monitor asteroid trajectories, close approach data, sizes, and potentially hazardous object classifications."
    >
      <div className="flex flex-col gap-6">
        {/* ── Row 1: Deep-space viz + Close Approach Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Deep-space visualization — spans 3 cols */}
          <div className="lg:col-span-3 relative rounded-2xl liquid-glass-strong overflow-hidden border border-white/5 h-[420px]">
            {/* Stars */}
            {stars.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
                animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
                transition={{ duration: s.twinkleDuration, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {/* Orbit rings */}
            {[90, 140, 185].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/[0.04]"
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Central Earth */}
            <div
              ref={earthRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              <div
                className="relative w-16 h-16 rounded-full overflow-hidden"
                style={{
                  boxShadow: '0 0 25px rgba(59,130,246,0.55), 0 0 50px rgba(59,130,246,0.25), inset 0 0 10px rgba(59,130,246,0.7)',
                }}
              >
                {/* Photorealistic Earth surface texture slowly rotating */}
                <img
                  src="/earth_surface_texture.png"
                  className="w-full h-full object-cover scale-[1.08] select-none pointer-events-none"
                  style={{ transform: `rotate(${earthRotation}deg)` }}
                  alt="Realistic Earth"
                />

                {/* 3D Volumetric Atmosphere Shading Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, transparent 45%, rgba(0,149,255,0.25) 70%, rgba(0,0,50,0.85) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>

              {/* Glowing outer atmosphere rings */}
              <div className="absolute -inset-1 rounded-full border border-blue-400/20 pointer-events-none" />
              <div className="absolute -inset-2 rounded-full border border-blue-400/10 pointer-events-none opacity-60" />
            </div>

            {/* Asteroids with trajectory trails */}
            {ASTEROIDS.map((a) => {
              const rad = (a.angle * Math.PI) / 180;
              const startX = Math.cos(rad) * 280;
              const startY = Math.sin(rad) * 280;
              const endX = Math.cos(rad) * a.radius;
              const endY = Math.sin(rad) * a.radius;

              return (
                <motion.div
                  key={a.id}
                  className="absolute z-20"
                  style={{ left: '50%', top: '50%' }}
                  animate={{ x: [startX, endX, startX], y: [startY, endY, startY] }}
                  transition={{ duration: a.duration, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Trail line */}
                  <svg
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width="120"
                    height="4"
                    style={{ transform: `rotate(${a.angle + 180}deg)`, transformOrigin: '0 50%' }}
                  >
                    <defs>
                      <linearGradient id={`trail-${a.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="2" x2="100" y2="2" stroke={`url(#trail-${a.id})`} strokeWidth="1.5" />
                  </svg>

                  {/* Asteroid dot */}
                  <motion.div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      a.hazardous
                        ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                        : 'bg-amber-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]'
                    }`}
                    style={{ width: a.hazardous ? 8 : 6, height: a.hazardous ? 8 : 6 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />

                  {/* Distance label */}
                  <div className="absolute left-3 top-[-14px] whitespace-nowrap font-mono text-[10px] text-amber-300/70">
                    {a.miss}
                  </div>
                </motion.div>
              );
            })}

            {/* Hazardous Object Warning Ping */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/30 pointer-events-none"
              animate={{ width: [0, 300], height: [0, 300], opacity: [0.6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeOut' }}
            />

            {/* Top-left overlay */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5">
              <div className="liquid-glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[10px] text-amber-300 tracking-wider">DEEP SPACE SCAN ACTIVE</span>
              </div>
              <div className="liquid-glass rounded-lg px-3 py-1.5">
                <span className="font-mono text-[10px] text-white/50">FOV: 180° × 90° | RES: 0.01 AU</span>
              </div>
            </div>

            {/* Bottom-right overlay */}
            <div className="absolute bottom-4 right-4 z-30">
              <div className="liquid-glass rounded-lg px-3 py-1.5">
                <span className="font-mono text-[10px] text-white/40">
                  EPOCH: {new Date().toISOString().slice(0, 10)}
                </span>
              </div>
            </div>
          </div>

          {/* Close Approach Timeline — spans 2 cols */}
          <div className="lg:col-span-2 liquid-glass-strong rounded-2xl border border-white/5 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Radar className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-amber-300 tracking-wider uppercase">Close Approach Timeline</span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {CLOSE_APPROACHES.map((ca, i) => (
                <motion.div
                  key={ca.name}
                  className="liquid-glass rounded-xl p-3.5 border border-white/5 hover:border-amber-500/20 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm text-white font-medium">{ca.name}</span>
                      <div className="text-[11px] text-white/40 font-mono mt-0.5">{ca.date}</div>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${hazardBg(ca.hazard)}`}>
                      {ca.hazard}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-white/50">
                    <span>Dist: <span className={hazardColor(ca.hazard)}>{ca.distance}</span></span>
                    <span>Ø {ca.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Threat Gauge + Asteroid Data Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Threat Assessment Gauge — 2 cols */}
          <div className="lg:col-span-2 liquid-glass-strong rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-5 self-start">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-amber-300 tracking-wider uppercase">Threat Assessment</span>
            </div>

            {/* Arc Gauge */}
            <div className="relative w-52 h-28 mb-2">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Green zone */}
                <path
                  d="M 20 100 A 80 80 0 0 1 75 28"
                  fill="none"
                  stroke="rgba(34,197,94,0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Yellow zone */}
                <path
                  d="M 75 28 A 80 80 0 0 1 125 28"
                  fill="none"
                  stroke="rgba(250,204,21,0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Red zone */}
                <path
                  d="M 125 28 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(239,68,68,0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Gauge needle */}
                <motion.line
                  x1="100"
                  y1="100"
                  x2={100 + Math.cos(Math.PI + gaugeValue * Math.PI) * 68}
                  y2={100 + Math.sin(Math.PI + gaugeValue * Math.PI) * 68}
                  stroke="#fb923c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  animate={{
                    x2: 100 + Math.cos(Math.PI + gaugeValue * Math.PI) * 68,
                    y2: 100 + Math.sin(Math.PI + gaugeValue * Math.PI) * 68,
                  }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
                {/* Center dot */}
                <circle cx="100" cy="100" r="4" fill="#fb923c" />
                <circle cx="100" cy="100" r="2" fill="#020617" />

                {/* Labels */}
                <text x="16" y="108" className="fill-green-500/60" style={{ fontSize: 8, fontFamily: 'monospace' }}>LOW</text>
                <text x="88" y="18" className="fill-yellow-500/60" style={{ fontSize: 8, fontFamily: 'monospace' }}>MED</text>
                <text x="166" y="108" className="fill-red-500/60" style={{ fontSize: 8, fontFamily: 'monospace' }}>HIGH</text>
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-mono text-sm tracking-widest text-green-400">THREAT LEVEL: NOMINAL</span>
            </div>
            <span className="font-mono text-[10px] text-white/30 mt-1">Last assessment: 4s ago · Auto-refresh</span>
          </div>

          {/* Asteroid Data Cards — 3 cols */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ASTEROIDS.slice(0, 3).map((a, i) => (
              <motion.div
                key={a.id}
                className="liquid-glass rounded-xl border border-white/5 p-4 hover:border-amber-500/20 transition-colors group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {a.hazardous && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-sm font-medium text-white">{a.name}</span>
                </div>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-white/40">Diameter</span>
                    <span className="text-amber-300">{a.diameter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Velocity</span>
                    <span className="text-amber-300">{a.velocity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Miss Dist</span>
                    <span className={a.hazardous ? 'text-red-400' : 'text-amber-300'}>{a.miss}</span>
                  </div>
                </div>
                {a.hazardous && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-red-400/80">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    POTENTIALLY HAZARDOUS
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Row 3: Stats + Feature Pills ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-3 gap-3">
            {[
              { label: 'NEOs Tracked', value: neoCount.toLocaleString(), icon: Crosshair },
              { label: 'Close Approaches (7d)', value: String(closeCount), icon: TrendingUp },
              { label: 'Hazardous', value: String(hazCount), icon: AlertTriangle, danger: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="liquid-glass rounded-xl border border-white/5 p-4 flex flex-col items-start gap-2"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <stat.icon className={`w-4 h-4 ${stat.danger ? 'text-red-400' : 'text-amber-400'}`} />
                <span className={`font-mono text-2xl font-semibold ${stat.danger ? 'text-red-400' : 'text-amber-300'}`}>
                  {stat.value}
                </span>
                <span className="text-[11px] text-white/40">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Feature pills */}
          <div className="lg:col-span-2 flex flex-wrap items-start content-start gap-2 py-2">
            {FEATURE_PILLS.map((pill, i) => (
              <motion.span
                key={pill}
                className="liquid-glass rounded-full px-3 py-1.5 text-xs text-amber-300/80 font-mono tracking-wide border border-amber-500/10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                {pill}
              </motion.span>
            ))}
            {/* Scanning animation pill */}
            <motion.span
              className="liquid-glass rounded-full px-3 py-1.5 text-xs text-amber-400/60 font-mono tracking-wide border border-amber-500/10 flex items-center gap-1.5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Activity className="w-3 h-3" />
              Scanning…
            </motion.span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
