import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionWrapper } from './SectionWrapper';
import {
  Crosshair,
  Database,
  CalendarRange,
  Cpu,
  BarChart3,
  Satellite,
  Layers,
  MapPin,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

/* ──────────────────────── constants ──────────────────────── */

const ACCENT = '#2dd4bf';

const PIPELINE_STEPS = [
  { label: 'Select AOI', icon: Crosshair },
  { label: 'Choose Dataset', icon: Database },
  { label: 'Set Date Range', icon: CalendarRange },
  { label: 'Process', icon: Cpu },
  { label: 'Visualize', icon: BarChart3 },
] as const;

const DATASETS = ['Sentinel-2 L2A', 'Landsat 8', 'MODIS'] as const;

const SPECTRAL_BANDS = [
  { name: 'NDVI', color: '#22c55e', max: 0.87 },
  { name: 'EVI', color: '#3b82f6', max: 0.72 },
  { name: 'SAVI', color: '#f59e0b', max: 0.64 },
] as const;

const FEATURE_PILLS = [
  'No-Code Analysis',
  'GEE Integration',
  'AOI Selection',
  'Multi-Dataset',
  'Auto Visualization',
];

/* ──────────────────────── component ──────────────────────── */

export function EOAnalystSection() {
  /* ── state for timed simulation ── */
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState(0);
  const [bandValues, setBandValues] = useState([0, 0, 0]);
  const [processingPct, setProcessingPct] = useState(0);
  const [scriptDots, setScriptDots] = useState('');

  // Pipeline step cycling
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((p) => (p + 1) % PIPELINE_STEPS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // Dataset chip cycling
  useEffect(() => {
    const id = setInterval(() => {
      setSelectedDataset((p) => (p + 1) % DATASETS.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  // Spectral band fill animation
  useEffect(() => {
    const id = setInterval(() => {
      setBandValues(SPECTRAL_BANDS.map((b) => +(Math.random() * b.max).toFixed(2)));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Processing percentage
  useEffect(() => {
    const id = setInterval(() => {
      setProcessingPct((p) => (p >= 100 ? 0 : p + 2));
    }, 120);
    return () => clearInterval(id);
  }, []);

  // Typing dots
  useEffect(() => {
    const id = setInterval(() => {
      setScriptDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(id);
  }, []);

  /* ── random "stars" for map grid ── */
  const gridDots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: 8 + Math.random() * 84,
        delay: Math.random() * 4,
      })),
    [],
  );

  /* ────────── render ────────── */
  return (
    <SectionWrapper
      id="eo-analyst"
      index={10}
      totalSections={10}
      label="Geospatial AI"
      accentColor={ACCENT}
      title={<>AI Earth Observation Analyst</>}
      description={
        <>
          Perform satellite image analysis without writing code. AURA-AI bridges users
          and Earth observation datasets through Google Earth Engine, automating the
          entire workflow from area selection to insight delivery.
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* ╔══════════════════════════════════════════════╗
           ║  1 ─ WORKFLOW PIPELINE                       ║
           ╚══════════════════════════════════════════════╝ */}
        <div className="liquid-glass rounded-2xl p-6 md:p-8">
          {/* header */}
          <div className="flex items-center gap-2 mb-6">
            <Satellite className="w-4 h-4" style={{ color: ACCENT }} />
            <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
              Analysis Pipeline
            </span>
          </div>

          {/* nodes + connectors */}
          <div className="relative flex items-center justify-between gap-2 md:gap-0">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              return (
                <React.Fragment key={step.label}>
                  {/* connector line before this node (skip first) */}
                  {i > 0 && (
                    <div className="hidden md:block flex-1 h-[2px] relative bg-white/5 rounded-full overflow-hidden mx-1">
                      {/* traveling pulse */}
                      <motion.div
                        className="absolute inset-y-0 left-0 w-1/3 rounded-full"
                        style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
                        animate={{ x: ['-100%', '400%'] }}
                        transition={{
                          duration: 1.8,
                          delay: i * 2.4,
                          repeat: Infinity,
                          repeatDelay: (PIPELINE_STEPS.length - 1) * 2.4 - 1.8,
                          ease: 'easeInOut',
                        }}
                      />
                      {isDone && (
                        <div className="absolute inset-0 rounded-full" style={{ background: `${ACCENT}40` }} />
                      )}
                    </div>
                  )}

                  {/* node */}
                  <motion.div
                    className="flex flex-col items-center gap-2 z-10 shrink-0"
                    animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <div
                      className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'liquid-glass-strong'
                          : isDone
                          ? 'liquid-glass'
                          : 'bg-white/[0.02]'
                      }`}
                      style={
                        isActive
                          ? { boxShadow: `0 0 28px ${ACCENT}50, inset 0 0 12px ${ACCENT}20` }
                          : undefined
                      }
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: ACCENT }} />
                      ) : (
                        <Icon
                          className="w-5 h-5 transition-colors duration-300"
                          style={{ color: isActive ? ACCENT : 'rgba(255,255,255,0.3)' }}
                        />
                      )}
                      {/* active ring */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border"
                          style={{ borderColor: `${ACCENT}60` }}
                          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.12, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <span
                      className="text-[10px] md:text-xs font-mono whitespace-nowrap transition-colors duration-300"
                      style={{
                        color: isActive ? ACCENT : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ╔══════════════════════════════════════════════╗
           ║  2 ─ SPLIT VIEW (map + results)              ║
           ╚══════════════════════════════════════════════╝ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── LEFT: MAP PANEL ─── */}
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {/* titlebar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Map Panel
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
            </div>

            {/* map body */}
            <div className="relative w-full aspect-[4/3] bg-[#030a14] overflow-hidden">
              {/* grid */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* faint terrain SVG */}
              <svg
                viewBox="0 0 200 150"
                className="absolute inset-0 w-full h-full opacity-[0.06]"
                preserveAspectRatio="none"
              >
                <path d="M0,100 Q40,60 80,90 T160,70 T200,85 L200,150 L0,150Z" fill="#2dd4bf" />
                <path d="M0,120 Q50,90 100,110 T200,100 L200,150 L0,150Z" fill="#2dd4bf" />
              </svg>

              {/* scatter dots */}
              {gridDots.map((d) => (
                <motion.div
                  key={d.id}
                  className="absolute w-1 h-1 rounded-full bg-teal-400/30"
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                  animate={{ opacity: [0.15, 0.6, 0.15] }}
                  transition={{ duration: 3, delay: d.delay, repeat: Infinity }}
                />
              ))}

              {/* ── AOI rectangle ── */}
              <motion.div
                className="absolute rounded-sm"
                style={{
                  left: '22%',
                  top: '25%',
                  width: '42%',
                  height: '45%',
                  border: `2px dashed ${ACCENT}`,
                  background: `${ACCENT}08`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${ACCENT}00, inset 0 0 20px ${ACCENT}05`,
                    `0 0 18px ${ACCENT}30, inset 0 0 30px ${ACCENT}10`,
                    `0 0 0px ${ACCENT}00, inset 0 0 20px ${ACCENT}05`,
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* corner markers */}
                {[
                  { top: -3, left: -3 },
                  { top: -3, right: -3 },
                  { bottom: -3, left: -3 },
                  { bottom: -3, right: -3 },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{ ...pos, background: ACCENT }}
                  />
                ))}
              </motion.div>

              {/* coordinate readout */}
              <div className="absolute bottom-3 left-3 liquid-glass rounded-lg px-3 py-1.5 flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/60">
                  NW 34.0522°N, 118.2437°W
                </span>
                <span className="font-mono text-[10px] text-white/40">|</span>
                <span className="font-mono text-[10px] text-white/60">
                  SE 33.9425°N, 118.1280°W
                </span>
              </div>

              {/* zoom indicator */}
              <div className="absolute top-3 right-3 liquid-glass rounded-lg px-2.5 py-1 font-mono text-[10px] text-white/50">
                Z12 · 10m/px
              </div>

              {/* scanning bar */}
              <motion.div
                className="absolute left-0 w-full h-[1px] pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent 5%, ${ACCENT}60 50%, transparent 95%)` }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* ─── RIGHT: RESULTS PANEL ─── */}
          <div className="liquid-glass rounded-2xl overflow-hidden flex flex-col">
            {/* titlebar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Results Panel
                </span>
              </div>
              <motion.div
                className="flex items-center gap-1.5"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="font-mono text-[10px] text-teal-400/80">LIVE</span>
              </motion.div>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-5">
              {/* spectral bands */}
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Spectral Indices
                </span>
                {SPECTRAL_BANDS.map((band, i) => (
                  <div key={band.name} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-white/70">{band.name}</span>
                      <span className="font-mono text-xs" style={{ color: band.color }}>
                        {bandValues[i].toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: band.color }}
                        animate={{ width: `${(bandValues[i] / band.max) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* false-color image placeholder */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  False-Color Composite (B8-B4-B3)
                </span>
                <div
                  className="w-full aspect-[16/7] rounded-lg border border-white/5 overflow-hidden relative"
                  style={{
                    background:
                      'linear-gradient(135deg, #0a3d0a 0%, #1a5c1a 18%, #5c4b1a 35%, #3a6b3a 52%, #1a4d1a 68%, #6b5a2a 82%, #1a3a1a 100%)',
                  }}
                >
                  {/* noise texture overlay */}
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 20% 30%, rgba(34,197,94,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(139,92,42,0.5) 0%, transparent 35%), radial-gradient(circle at 50% 80%, rgba(34,197,94,0.3) 0%, transparent 45%)',
                    }}
                  />
                  {/* pixel grid overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />
                  {/* scanning shimmer */}
                  <motion.div
                    className="absolute inset-y-0 w-1/4"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${ACCENT}15, transparent)`,
                    }}
                    animate={{ left: ['-25%', '125%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                  <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/30">
                    10m GSD · RGB 843
                  </div>
                </div>
              </div>

              {/* Dataset selector */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Active Dataset
                </span>
                <div className="flex flex-wrap gap-2">
                  {DATASETS.map((ds, i) => (
                    <motion.div
                      key={ds}
                      className={`liquid-glass rounded-full px-3 py-1.5 text-xs font-mono cursor-default transition-all duration-300 ${
                        i === selectedDataset ? 'text-white' : 'text-white/40'
                      }`}
                      style={
                        i === selectedDataset
                          ? {
                              boxShadow: `0 0 14px ${ACCENT}30, inset 0 0 8px ${ACCENT}15`,
                              color: ACCENT,
                              borderColor: `${ACCENT}40`,
                            }
                          : undefined
                      }
                      animate={i === selectedDataset ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Satellite className="w-3 h-3" />
                        {ds}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ╔══════════════════════════════════════════════╗
           ║  3 ─ PROCESSING STATUS BAR                   ║
           ╚══════════════════════════════════════════════╝ */}
        <div className="liquid-glass rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* left: animated text */}
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-4 h-4" style={{ color: ACCENT }} />
              </motion.div>
              <span className="font-mono text-xs text-white/70">
                Generating Earth Engine script{scriptDots}
              </span>
            </div>

            {/* right: progress bar */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}90, ${ACCENT})`,
                  }}
                  animate={{ width: `${processingPct}%` }}
                  transition={{ duration: 0.12, ease: 'linear' }}
                />
              </div>
              <span className="font-mono text-xs min-w-[3ch] text-right" style={{ color: ACCENT }}>
                {processingPct}%
              </span>
            </div>
          </div>

          {/* code preview line */}
          <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/5 overflow-hidden">
            <motion.div
              className="font-mono text-[11px] text-white/40 whitespace-nowrap"
              animate={{ x: [0, -600] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              <span style={{ color: '#7c3aed' }}>var</span>{' '}
              <span style={{ color: ACCENT }}>aoi</span> ={' '}
              <span style={{ color: '#f59e0b' }}>ee.Geometry.Rectangle</span>
              ([-118.2437, 33.9425, -118.1280, 34.0522]);{' '}
              <span style={{ color: '#7c3aed' }}>var</span>{' '}
              <span style={{ color: ACCENT }}>collection</span> ={' '}
              <span style={{ color: '#f59e0b' }}>ee.ImageCollection</span>
              ('COPERNICUS/S2_SR_HARMONIZED').
              <span style={{ color: '#22c55e' }}>filterBounds</span>(aoi).
              <span style={{ color: '#22c55e' }}>filterDate</span>
              ('2025-01-01', '2025-06-01').
              <span style={{ color: '#22c55e' }}>filter</span>(
              <span style={{ color: '#f59e0b' }}>ee.Filter.lt</span>
              ('CLOUDY_PIXEL_PERCENTAGE', 20));{' '}
              <span style={{ color: '#7c3aed' }}>var</span>{' '}
              <span style={{ color: ACCENT }}>ndvi</span> = collection.
              <span style={{ color: '#22c55e' }}>map</span>(
              <span style={{ color: '#7c3aed' }}>function</span>(img){'{'}
              <span style={{ color: '#7c3aed' }}>return</span> img.
              <span style={{ color: '#22c55e' }}>normalizedDifference</span>
              (['B8','B4']).
              <span style={{ color: '#22c55e' }}>rename</span>('NDVI');{'}'});
            </motion.div>
          </div>
        </div>

        {/* ╔══════════════════════════════════════════════╗
           ║  4 ─ FEATURE PILLS                           ║
           ╚══════════════════════════════════════════════╝ */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {FEATURE_PILLS.map((pill, i) => (
            <motion.div
              key={pill}
              className="liquid-glass rounded-full px-4 py-2 text-xs font-mono text-white/60 flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
              whileHover={{
                scale: 1.06,
                boxShadow: `0 0 20px ${ACCENT}25`,
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: ACCENT }} />
              {pill}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
