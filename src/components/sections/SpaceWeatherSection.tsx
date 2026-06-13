import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Sun, Activity, Zap, Radio, ShieldAlert } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

// Deterministic pseudo-random for SSR safety
function seededPositions(count: number, seed: number) {
  const results: { x: number; y: number; delay: number; duration: number }[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 16807 + 7) % 2147483647;
    const x = (s % 1000) / 10;
    s = (s * 16807 + 7) % 2147483647;
    const y = (s % 1000) / 10;
    s = (s * 16807 + 7) % 2147483647;
    const delay = (s % 500) / 100;
    s = (s * 16807 + 7) % 2147483647;
    const duration = 1.5 + (s % 300) / 100;
    results.push({ x, y, delay, duration });
  }
  return results;
}

/* ──────────────────────── High-Fidelity Visual Sun ──────────────────────── */
function VisualSun() {
  const [xOffset, setXOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    lastXRef.current = clientX;
  };

  // Auto-rotation effect
  useEffect(() => {
    if (isDragging) return;
    let animationId: number;
    const update = () => {
      setXOffset((prev) => prev - 0.25); // Slow horizontal rotation drift
      animationId = requestAnimationFrame(update);
    };
    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ('cancelable' in e && e.cancelable) {
        e.preventDefault();
      }
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - lastXRef.current;
      lastXRef.current = clientX;
      setXOffset((prev) => prev + deltaX);
    };

    const handleEnd = () => {
      setIsDragging(false);
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
  }, [isDragging]);

  return (
    <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center select-none">
      {/* 1. Deep Core Corona Glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(251,146,60,0.16) 0%, rgba(239,68,68,0.03) 55%, transparent 75%)',
          filter: 'blur(12px)',
        }}
        animate={{
          scale: [0.96, 1.08, 0.96],
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Intense Volumetric Inner Corona Glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(250,204,21,0.24) 0%, rgba(249,115,22,0.06) 45%, transparent 70%)',
          filter: 'blur(8px)',
          mixBlendMode: 'screen',
        }}
        animate={{
          scale: [1.05, 0.95, 1.05],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Expanding Shockwave Flares (Rings) */}
      <svg className="absolute w-72 h-72 md:w-80 md:h-80 pointer-events-none z-0" viewBox="0 0 100 100">
        <defs>
          <filter id="shockwave-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Shockwave Ring 1 */}
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#fb923c"
          filter="url(#shockwave-blur)"
          animate={{
            r: [22, 46],
            opacity: [0.8, 0],
            strokeWidth: [2.5, 0.5],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0,
          }}
        />

        {/* Shockwave Ring 2 */}
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#facc15"
          filter="url(#shockwave-blur)"
          animate={{
            r: [22, 46],
            opacity: [0.8, 0],
            strokeWidth: [2.5, 0.5],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 1.2,
          }}
        />

        {/* Shockwave Ring 3 */}
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#f87171"
          filter="url(#shockwave-blur)"
          animate={{
            r: [22, 46],
            opacity: [0.8, 0],
            strokeWidth: [2.5, 0.5],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 2.4,
          }}
        />
      </svg>

      {/* 4. Main Sun Sphere (Clipped photorealistic panoramic texture + 3D spherical shading) */}
      <div
        ref={containerRef}
        className="relative z-10 w-32 h-32 rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          boxShadow: '0 0 35px rgba(250,204,21,0.55), 0 0 70px rgba(251,146,60,0.35), inset 0 0 20px rgba(234,88,12,0.65)',
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Photorealistic Sun surface texture repeating horizontally and sliding to simulate 3D rotation */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/solar_surface_panoramic.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPositionX: `${xOffset}px`,
          }}
        />

        {/* Volumetric Limb Shading Overlay (warm glow edge - no dark edges) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(234,88,12,0.35) 75%, rgba(185,28,28,0.75) 100%)',
          }}
        />

        {/* Hot Solar Flares Glow Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(254,240,138,0.8) 0%, transparent 65%)',
            mixBlendMode: 'screen',
          }}
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────── Main Space Weather Section ──────────────────────── */
export function SpaceWeatherSection() {
  const [solarFlux, setSolarFlux] = useState(142);
  const [kpDisplay, setKpDisplay] = useState(3);
  const [sunspotNum, setSunspotNum] = useState(87);
  const [tick, setTick] = useState(0);

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setSolarFlux(140 + Math.floor(Math.random() * 6));
      setKpDisplay(2 + Math.floor(Math.random() * 2));
      setSunspotNum(85 + Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const starPositions = useMemo(() => seededPositions(20, 42), []);

  const solarEvents = [
    { label: 'C2.1 Flare', time: '3h ago', color: '#facc15' },
    { label: 'CME Detected', time: '8h ago', color: '#fb923c' },
    { label: 'Proton Event', time: '1d ago', color: '#f87171' },
  ];

  const featurePills = [
    'Solar Monitoring',
    'Flare Detection',
    'CME Tracking',
    'Kp Index',
    'Radiation Alerts',
  ];

  // Kp Gauge configuration
  const kpValue = 3;
  const kpMax = 9;
  const gaugeRadius = 52;
  const gaugeStroke = 6;
  const gaugeCenterX = 64;
  const gaugeCenterY = 64;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle; // 270 degrees
  const kpAngle = startAngle + (kpValue / kpMax) * totalAngle;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startAng: number, endAng: number) {
    const start = polarToCartesian(cx, cy, r, endAng);
    const end = polarToCartesian(cx, cy, r, startAng);
    const largeArc = endAng - startAng > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  const bgArcPath = describeArc(gaugeCenterX, gaugeCenterY, gaugeRadius, startAngle, endAngle);
  const filledArcPath = describeArc(gaugeCenterX, gaugeCenterY, gaugeRadius, startAngle, kpAngle);
  const needleTip = polarToCartesian(gaugeCenterX, gaugeCenterY, gaugeRadius - 10, kpAngle);

  return (
    <SectionWrapper
      id="space-weather"
      index={7}
      totalSections={10}
      label="Solar Intelligence"
      title="Space Weather Center"
      description="Monitor solar activity, geomagnetic storms, solar flares, and space weather conditions that impact satellite operations and communications."
      accentColor="#facc15"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Visual Sun Command Panel ─── */}
        <div className="lg:col-span-5 relative w-full aspect-square max-h-[480px] rounded-2xl liquid-glass border border-white/5 overflow-hidden flex items-center justify-center">
          
          {/* Static Twinkling Stars background */}
          {starPositions.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full pointer-events-none"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              animate={{ opacity: [0.15, 0.75, 0.15] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
            />
          ))}

          {/* High-Fidelity Photorealistic Sun Simulation */}
          <VisualSun />

          {/* Solar wind speed reading */}
          <div className="absolute top-3 right-3 px-2 py-1 liquid-glass rounded-md border border-yellow-500/20">
            <span className="font-mono text-[10px] text-yellow-400 tracking-wider">SOLAR WIND → 420 km/s</span>
          </div>
        </div>

        {/* ─── RIGHT: Space Weather Analytics ─── */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Gauge + Core indices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Kp Arc Gauge */}
            <div className="liquid-glass rounded-xl border border-white/5 p-5 flex flex-col items-center justify-center">
              <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2">Kp Geomagnetic Index</span>
              <svg viewBox="0 0 128 90" className="w-full max-w-[180px]">
                <path
                  d={bgArcPath}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={gaugeStroke}
                  strokeLinecap="round"
                />
                <motion.path
                  d={filledArcPath}
                  fill="none"
                  stroke="url(#kpGradient)"
                  strokeWidth={gaugeStroke}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="kpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="40%" stopColor="#facc15" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1={gaugeCenterX}
                  y1={gaugeCenterY}
                  x2={needleTip.x}
                  y2={needleTip.y}
                  stroke="#facc15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
                <circle cx={gaugeCenterX} cy={gaugeCenterY} r="3" fill="#facc15" />
                <text x={gaugeCenterX} y={gaugeCenterY + 18} textAnchor="middle" className="font-mono" fill="#facc15" fontSize="18" fontWeight="bold">
                  {kpDisplay}
                </text>
                <text x="18" y="82" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">0</text>
                <text x="110" y="82" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">9</text>
              </svg>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs text-yellow-400">Kp {kpDisplay}</span>
                <span className="text-[10px] text-white/30">— Quiet</span>
              </div>
            </div>

            {/* Live Solar flux / sunspots readout */}
            <div className="liquid-glass rounded-xl border border-white/5 p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Solar Indices</span>
              </div>

              {[
                { label: 'Solar Flux (F10.7)', value: `${solarFlux} SFU`, icon: <Sun className="w-3 h-3" /> },
                { label: 'Kp Index', value: `${kpDisplay}`, icon: <Activity className="w-3 h-3" /> },
                { label: 'Sunspot Number', value: `${sunspotNum}`, icon: <Zap className="w-3 h-3" /> },
                { label: 'X-ray Flux', value: 'B4.2', icon: <Radio className="w-3 h-3" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400/60">{item.icon}</span>
                    <span className="text-xs text-white/50 font-body">{item.label}</span>
                  </div>
                  <motion.span
                    key={`${item.value}-${tick}`}
                    className="font-mono text-sm text-yellow-400 font-medium"
                    initial={{ opacity: 0.4, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.value}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          {/* Geomagnetic status & events list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Geomagnetic alert panel */}
            <div className="liquid-glass rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">System Status</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-green-500/20">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"
                  animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}
                />
                <div>
                  <span className="font-mono text-xs text-green-400 font-semibold tracking-wide">GEOMAGNETIC: QUIET</span>
                  <p className="text-[10px] text-white/30 mt-0.5">No significant disturbances detected</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-black/20 rounded-md px-3 py-2 border border-white/5">
                  <div className="text-[9px] text-white/30 font-mono uppercase">Dst Index</div>
                  <div className="font-mono text-sm text-white/80">-8 nT</div>
                </div>
                <div className="bg-black/20 rounded-md px-3 py-2 border border-white/5">
                  <div className="text-[9px] text-white/30 font-mono uppercase">Proton Flux</div>
                  <div className="font-mono text-sm text-white/80">0.42 pfu</div>
                </div>
              </div>
            </div>

            {/* Timeline of events */}
            <div className="liquid-glass rounded-xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Recent Solar Events</span>
              </div>

              <div className="flex flex-col gap-3">
                {solarEvents.map((evt, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3 relative"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {idx < solarEvents.length - 1 && (
                      <div className="absolute left-[5px] top-[14px] w-[1px] h-full bg-white/10" />
                    )}
                    <motion.div
                      className="w-[11px] h-[11px] rounded-full flex-shrink-0 mt-0.5 border-2"
                      style={{ borderColor: evt.color, backgroundColor: `${evt.color}30` }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-white/80 font-medium">{evt.label}</span>
                      <span className="text-[10px] text-white/30 font-mono">{evt.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* X-ray flux bar */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] text-white/30 font-mono uppercase">X-ray Activity</span>
                  <span className="text-[9px] text-yellow-400 font-mono">B4.2</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #22c55e, #facc15)' }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '28%' }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {featurePills.map((pill, idx) => (
              <motion.span
                key={pill}
                className="liquid-glass rounded-full px-3 py-1.5 text-xs font-mono text-yellow-400/80 border border-yellow-500/15 hover:border-yellow-500/40 transition-colors cursor-default"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
              >
                {pill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
