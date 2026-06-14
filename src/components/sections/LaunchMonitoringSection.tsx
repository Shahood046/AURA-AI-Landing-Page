import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Clock, Building2, MapPin, CalendarClock } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

/* ───────────────────── helpers ───────────────────── */
function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `T-00:${pad(m)}:${pad(s)}`;
}

/* ───────────────────── constants ───────────────────── */
const ACCENT = '#ff6b35';

const STAGES = [
  { key: 'prelaunch', label: 'Pre-Launch', threshold: 200 },
  { key: 'liftoff', label: 'Liftoff', threshold: 170 },
  { key: 'stagesep', label: 'Stage Sep', threshold: 120 },
  { key: 'meco', label: 'MECO', threshold: 60 },
  { key: 'orbit', label: 'Orbit Insertion', threshold: 0 },
];

const UPCOMING_LAUNCHES = [
  { mission: 'Starlink Group 12-4', agency: 'SpaceX', date: 'Jun 12, 2026', vehicle: 'Falcon 9' },
  { mission: 'Chandrayaan-4', agency: 'ISRO', date: 'Jun 18, 2026', vehicle: 'LVM3' },
  { mission: 'Ariane 6 – Flight 4', agency: 'ESA / ArianeGroup', date: 'Jun 25, 2026', vehicle: 'Ariane 62' },
];

const FEATURE_PILLS = [
  'Countdown Timer',
  'Vehicle Info',
  'Agency Data',
  'Launch Sites',
  'Mission Timeline',
];

/* ───────────────────── component ───────────────────── */
export function LaunchMonitoringSection() {
  /* countdown — starts at 3:47 = 227s */
  const [countdown, setCountdown] = useState(227);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? 227 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* telemetry values — smoothly climb after "liftoff" */
  const phase = countdown <= 170 ? 'flight' : 'prelaunch';
  const elapsed = Math.max(0, 170 - countdown); // seconds since liftoff

  const velocity = useMemo(() => {
    if (phase === 'prelaunch') return 0;
    return Math.min(7680, Math.round(elapsed * 45.2 + Math.sin(elapsed * 0.3) * 40));
  }, [phase, elapsed]);

  const altitude = useMemo(() => {
    if (phase === 'prelaunch') return 0;
    return Math.min(210, +(elapsed * 1.24 + Math.sin(elapsed * 0.15) * 3).toFixed(1));
  }, [phase, elapsed]);

  const gForce = useMemo(() => {
    if (phase === 'prelaunch') return 1.0;
    const g = 1.0 + elapsed * 0.025 + Math.sin(elapsed * 0.5) * 0.15;
    return Math.min(4.2, +g.toFixed(1));
  }, [phase, elapsed]);

  const downrange = useMemo(() => {
    if (phase === 'prelaunch') return 0;
    return Math.min(580, Math.round(elapsed * 3.4));
  }, [phase, elapsed]);

  /* active stage index */
  const activeStage = STAGES.findIndex((s) => countdown <= s.threshold);

  return (
    <SectionWrapper
      id="launch-monitor"
      index={3}
      totalSections={10}
      label="Launch Operations"
      title={<>Live Launch Monitor</>}
      description="Track upcoming and ongoing orbital launches worldwide. Monitor launch vehicles, agencies, mission profiles, and countdown timers in real-time."
      accentColor={ACCENT}
    >
      {/* ═══════ Main Simulation Container ═══════ */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff6b35]/5 blur-[120px] pointer-events-none" />

        {/* ─── Top Bar ─── */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Rocket className="w-4 h-4" style={{ color: ACCENT }} />
            <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
              Mission Control — Atlas V / NROL-107
            </span>
          </div>
          {/* LIVE badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ borderColor: `${ACCENT}40`, backgroundColor: `${ACCENT}10` }}>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="font-mono text-xs font-semibold tracking-widest" style={{ color: ACCENT }}>
              LIVE
            </span>
          </div>
        </div>

        {/* ─── Body Grid ─── */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* ── LEFT: Mission Timeline ── */}
          <div className="lg:col-span-2 border-r border-white/5 p-5">
            <h4 className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-5">
              Mission Timeline
            </h4>
            <div className="relative flex flex-col gap-1">
              {/* Vertical connector line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-white/5" />

              {STAGES.map((stage, i) => {
                const isActive = i === activeStage;
                const isPast = i < activeStage;
                return (
                  <motion.div
                    key={stage.key}
                    className="relative flex items-center gap-3 py-2.5 pl-0"
                    animate={{ opacity: isActive || isPast ? 1 : 0.35 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: isActive ? ACCENT : isPast ? `${ACCENT}80` : 'rgba(255,255,255,0.15)',
                          backgroundColor: isPast ? `${ACCENT}30` : 'transparent',
                        }}
                        animate={isActive ? { boxShadow: [`0 0 0px ${ACCENT}`, `0 0 12px ${ACCENT}`, `0 0 0px ${ACCENT}`] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {isPast && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                        )}
                      </motion.div>
                    </div>
                    {/* Label */}
                    <span
                      className="font-mono text-xs tracking-wide whitespace-nowrap"
                      style={{ color: isActive ? ACCENT : isPast ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}
                    >
                      {stage.label}
                    </span>
                    {isActive && (
                      <motion.span
                        className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        NOW
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── CENTER: Rocket + Countdown ── */}
          <motion.div 
            className="lg:col-span-5 relative flex flex-col items-center justify-center py-12 min-h-[420px] overflow-hidden"
            animate={phase === 'flight' ? {
              x: [0, -1, 1, -0.5, 0.5, 0],
              y: [0, 0.5, -0.5, 0.3, -0.3, 0],
            } : {}}
            transition={{
              duration: 0.12,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {/* Countdown */}
            <motion.div
              className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-1">Countdown</div>
              <div
                className="font-mono text-3xl md:text-4xl font-bold tracking-wider"
                style={{ color: countdown <= 10 ? '#ef4444' : ACCENT }}
              >
                {formatCountdown(countdown)}
              </div>
            </motion.div>

            {/* Launch Tower (Slides down during flight to simulate ascent) */}
            <motion.div 
              className="absolute left-[calc(50%-55px)] bottom-12 w-6 h-[170px] border-r border-t border-white/10 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] bg-[size:10px_10px] opacity-30 z-0 pointer-events-none"
              animate={phase === 'flight' ? { y: [0, 300], opacity: [0.3, 0] } : { y: 0, opacity: 0.3 }}
              transition={phase === 'flight' ? { duration: 12, ease: 'easeIn' } : { duration: 0.5 }}
            >
              <div className="absolute top-2 right-[-2.5px] w-1 h-1 bg-red-500 rounded-full animate-ping" />
              <div className="absolute top-20 right-[-2.5px] w-1 h-1 bg-red-500 rounded-full animate-ping" />
            </motion.div>

            {/* Rocket Image with thrust */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-end h-[220px]"
              animate={phase === 'flight' ? { y: [0, -12, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/realistic_rocket_cutout.png"
                className="h-[180px] w-auto object-contain select-none pointer-events-none"
                alt="Falcon 9 Rocket"
              />

              {/* Animated thrust flames */}
              {phase === 'flight' && (
                <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  {/* Inner flame (white-hot) */}
                  <motion.div
                    className="w-3 rounded-b-full bg-gradient-to-b from-white via-yellow-200 to-transparent"
                    style={{ filter: 'blur(1px)' }}
                    animate={{ height: [15, 28, 18, 25, 15], opacity: [0.9, 1, 0.8, 1, 0.9] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  />
                  {/* Outer flame (orange) */}
                  <motion.div
                    className="absolute top-0 w-6 rounded-b-full bg-gradient-to-b from-orange-400 via-[#ff6b35] to-transparent"
                    style={{ filter: 'blur(2px)', mixBlendMode: 'screen' }}
                    animate={{ height: [25, 45, 30, 42, 25], opacity: [0.8, 1, 0.7, 0.95, 0.8] }}
                    transition={{ duration: 0.12, repeat: Infinity }}
                  />
                  {/* Glowing Plume Halo */}
                  <motion.div
                    className="absolute top-[-5px] w-12 h-16 rounded-full bg-orange-600/30"
                    style={{ filter: 'blur(10px)', mixBlendMode: 'screen' }}
                    animate={{ scale: [0.9, 1.1, 0.95, 1.05, 0.9] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                  />
                  {/* Smoke particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/5 border border-white/5"
                      style={{ width: 8 + i * 4, height: 8 + i * 4, filter: 'blur(3px)' }}
                      animate={{
                        y: [15, 80 + i * 15],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (12 + i * 5)],
                        opacity: [0.4, 0],
                        scale: [1, 3.2],
                      }}
                      transition={{ duration: 1.0 + i * 0.25, repeat: Infinity, delay: i * 0.15, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              )}

              {/* Pre-launch: idle glow at nozzle */}
              {phase === 'prelaunch' && (
                <motion.div
                  className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-6 h-3 rounded-b-full"
                  style={{ backgroundColor: `${ACCENT}40` }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Launch pad base (Slides down during flight to simulate ascent) */}
            <motion.div 
              className="relative mt-1 z-0"
              animate={phase === 'flight' ? { y: [0, 250], opacity: [1, 0] } : { y: 0, opacity: 1 }}
              transition={phase === 'flight' ? { duration: 8, ease: 'easeIn' } : { duration: 0.5 }}
            >
              <div className="w-32 h-[3px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-24 h-[2px] mx-auto mt-1 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>

            {/* Phase label */}
            <motion.div
              className="mt-6 font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border"
              style={{
                color: ACCENT,
                borderColor: `${ACCENT}30`,
                backgroundColor: `${ACCENT}08`,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {phase === 'prelaunch' ? 'Awaiting Ignition' : 'Powered Flight'}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Telemetry + Upcoming ── */}
          <div className="lg:col-span-5 border-l border-white/5 p-5 flex flex-col gap-5">
            {/* Telemetry readouts */}
            <div>
              <h4 className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-4">
                Flight Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Velocity', value: `${velocity.toLocaleString()} m/s`, unit: 'm/s' },
                  { label: 'Altitude', value: `${altitude} km`, unit: 'km' },
                  { label: 'G-Force', value: `${gForce}g`, unit: 'g' },
                  { label: 'Downrange', value: `${downrange} km`, unit: 'km' },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="liquid-glass rounded-xl p-3.5 border border-white/5 hover:border-[#ff6b35]/30 transition-colors"
                  >
                    <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-1.5">
                      {t.label}
                    </div>
                    <motion.div
                      className="font-mono text-lg font-semibold"
                      style={{ color: ACCENT }}
                      key={t.value}
                      initial={{ opacity: 0.6, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t.value}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Upcoming launches */}
            <div>
              <h4 className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-3 flex items-center gap-2">
                <CalendarClock className="w-3 h-3" style={{ color: ACCENT }} />
                Upcoming Launches
              </h4>
              <div className="flex flex-col gap-2">
                {UPCOMING_LAUNCHES.map((launch, i) => (
                  <motion.div
                    key={launch.mission}
                    className="liquid-glass rounded-lg p-3 border border-white/5 hover:border-[#ff6b35]/20 transition-colors flex items-center justify-between gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}
                      >
                        <Rocket className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-white font-medium truncate">{launch.mission}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-2.5 h-2.5 text-white/30" />
                          <span className="font-mono text-[10px] text-white/40">{launch.agency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-[10px] text-white/50">{launch.vehicle}</div>
                      <div className="font-mono text-[10px] mt-0.5" style={{ color: ACCENT }}>
                        {launch.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vehicle info mini-card */}
            <div className="liquid-glass rounded-xl p-4 border border-white/5 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Vehicle</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}>
                  ULA
                </span>
              </div>
              <div className="text-sm text-white font-medium mb-1">Atlas V 541</div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: 'Mass', val: '590t' },
                  { label: 'Thrust', val: '4.15 MN' },
                  { label: 'Payload', val: '8,900 kg' },
                ].map((spec) => (
                  <div key={spec.label} className="text-center">
                    <div className="font-mono text-[9px] text-white/30 uppercase">{spec.label}</div>
                    <div className="font-mono text-xs text-white/70 mt-0.5">{spec.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar: Feature pills ─── */}
        <div className="relative px-5 py-4 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase mr-2">Features</span>
          {FEATURE_PILLS.map((pill) => (
            <span
              key={pill}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/60 border border-white/5 hover:border-[#ff6b35]/30 hover:text-white/80 transition-colors"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
