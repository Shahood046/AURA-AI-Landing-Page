import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Star, Telescope, ImageIcon, BookOpen, Archive } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const ACCENT = '#c084fc';

/* ── tiny star field (memoised to avoid re-render jitter) ── */
function StarField({ count = 60 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [count],
  );

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

/* ── shooting star ── */
function ShootingStar() {
  const [key, setKey] = useState(0);
  const [pos, setPos] = useState({ startX: 20, startY: 10 });

  useEffect(() => {
    const id = setInterval(() => {
      setKey((k) => k + 1);
      setPos({ startX: 10 + Math.random() * 60, startY: Math.random() * 30 });
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="absolute z-20 pointer-events-none"
        style={{ top: `${pos.startY}%`, left: `${pos.startX}%` }}
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], x: 260, y: 180 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeIn' }}
      >
        {/* head */}
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]" />
        {/* tail */}
        <div className="absolute top-[3px] right-[6px] w-16 h-[1.5px] origin-right -rotate-[34deg] bg-gradient-to-l from-white/80 via-purple-300/40 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Category pill ── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="liquid-glass rounded-full px-3 py-1 text-[10px] font-mono tracking-wide text-purple-300 border border-purple-400/20">
      {children}
    </span>
  );
}

/* ── APOD Card (large) ── */
function ApodCardMain() {
  const [descExpanded] = useState(false);
  const truncated =
    'These dark pillars may look destructive, but they are creating stars. Made famous in a Hubble Space Telescope image from 1995, the Pillars of Creation are part of the Eagle Nebula (M16), a star-forming region 6,500 light-years away in the constellation Serpens…';

  return (
    <motion.div
      className="liquid-glass-strong rounded-2xl border border-white/10 overflow-hidden flex flex-col"
      whileHover={{ scale: 1.01, borderColor: 'rgba(192,132,252,0.3)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Image placeholder – cosmic gradient + star dots */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e0533] via-[#0c1445] to-[#020617]" />
        {/* Nebula glow blobs */}
        <div className="absolute top-[30%] left-[25%] w-40 h-40 rounded-full bg-purple-600/20 blur-[60px]" />
        <div className="absolute bottom-[20%] right-[20%] w-56 h-32 rounded-full bg-indigo-500/15 blur-[70px]" />
        <div className="absolute top-[15%] right-[35%] w-20 h-20 rounded-full bg-pink-500/10 blur-[40px]" />
        {/* Decorative star dots */}
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/70"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* Pillar silhouettes */}
        <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-30" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path d="M80 200 L90 80 L100 60 L110 80 L120 200Z" fill="#0a0014" />
          <path d="M160 200 L175 50 L185 30 L195 55 L210 200Z" fill="#0a0014" />
          <path d="M260 200 L270 100 L280 70 L290 95 L300 200Z" fill="#0a0014" />
        </svg>
        {/* Live badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] text-green-300/80 tracking-widest uppercase">Today's APOD</span>
        </div>
        {/* Navigation arrows */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center border border-white/10 hover:border-purple-400/40 transition-colors">
            <ChevronLeft className="w-4 h-4 text-white/60" />
          </button>
          <button className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center border border-white/10 hover:border-purple-400/40 transition-colors">
            <ChevronRight className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 md:p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>June 7, 2026</span>
        </div>
        <h3 className="text-xl md:text-2xl font-heading italic text-white tracking-tight">
          Pillars of Creation
        </h3>
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Tag>Nebula</Tag>
          <Tag>Deep Space</Tag>
          <Tag>HST</Tag>
        </div>
        {/* Description with fade */}
        <div className="relative">
          <p className={`text-sm text-slate-400 font-body leading-relaxed ${descExpanded ? '' : 'line-clamp-3'}`}>
            {truncated}
          </p>
          {!descExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          )}
        </div>
        <span className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition-colors">Read more →</span>
      </div>
    </motion.div>
  );
}

/* ── Yesterday's APOD (smaller card) ── */
function ApodCardYesterday() {
  return (
    <motion.div
      className="liquid-glass rounded-2xl border border-white/10 overflow-hidden"
      whileHover={{ scale: 1.02, borderColor: 'rgba(192,132,252,0.25)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Image placeholder – different gradient */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0a2a] via-[#111b45] to-[#081028]" />
        {/* Andromeda glow */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-36 h-20 rounded-full bg-indigo-400/20 blur-[50px] rotate-[35deg]" />
        <div className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-24 h-12 rounded-full bg-white/5 blur-[25px] rotate-[35deg]" />
        {/* Star dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              width: Math.random() * 1.5 + 0.5,
              height: Math.random() * 1.5 + 0.5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">Yesterday</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
          <Calendar className="w-3 h-3" />
          <span>June 6, 2026</span>
        </div>
        <h4 className="text-base font-heading italic text-white">Andromeda Rising</h4>
        <div className="flex flex-wrap gap-1.5">
          <Tag>Galaxy</Tag>
          <Tag>Astrophotography</Tag>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Daily streak widget ── */
function DailyStreak() {
  const [count, setCount] = useState(847);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 86400000); // symbolic
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="liquid-glass rounded-xl border border-white/10 px-5 py-4 flex items-center gap-4"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <motion.span
        className="text-2xl"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔭
      </motion.span>
      <div>
        <p className="text-sm text-white font-body">
          Day <span className="font-mono text-purple-300 font-semibold">{count}</span> of daily astronomy
        </p>
        <p className="text-xs text-white/40 font-mono mt-0.5">Continuous streak since Mar 14, 2024</p>
      </div>
      <div className="ml-auto flex gap-0.5">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: i < 6 ? ACCENT : 'rgba(192,132,252,0.25)' }}
            animate={i === 5 ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Telemetry stat line ── */
function StatLine({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="liquid-glass rounded-lg p-2 border border-white/5">
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <p className="text-xs text-white/40 font-mono">{label}</p>
        <p className="text-sm text-white font-mono">{value}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ██  MAIN EXPORT
   ════════════════════════════════════════════════════ */

export function AstronomyGallerySection() {
  /* typing effect for the APOD credit */
  const creditText = 'Credit: NASA, ESA, CSA, STScI — James Webb Space Telescope';
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      setTyped(creditText.slice(0, idx + 1));
      idx++;
      if (idx >= creditText.length) {
        clearInterval(id);
      }
    }, 45);
    return () => clearInterval(id);
  }, []);

  const featurePills = ['Daily APOD', 'NASA Content', 'Astronomy Education', 'Image Archive', 'Expert Commentary'];

  return (
    <SectionWrapper
      id="astronomy-gallery"
      index={9}
      totalSections={10}
      label="Daily Discovery"
      title={<>Astronomy Gallery</>}
      description={
        <>
          Explore the cosmos through NASA's Astronomy Picture of the Day. A daily curated feed of stunning astronomical imagery with expert explanations.
        </>
      }
      accentColor={ACCENT}
    >
      {/* ── section-level star field & shooting star ── */}
      <div className="relative">
        <div className="absolute inset-0 -top-32 overflow-hidden pointer-events-none">
          <StarField count={80} />
          <ShootingStar />
        </div>

        {/* ── Feature pills ── */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
        >
          {featurePills.map((pill) => (
            <motion.span
              key={pill}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs font-mono text-purple-200/80 border border-purple-400/15 select-none"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>

        {/* ── Grid layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main APOD card (spans 2 cols) */}
          <div className="lg:col-span-2">
            <ApodCardMain />
            {/* Typing credit */}
            <div className="mt-3 h-5 overflow-hidden">
              <p className="font-mono text-[11px] text-white/30 tracking-wide">
                {typed}
                <motion.span
                  className="inline-block w-[2px] h-3 bg-purple-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <ApodCardYesterday />

            {/* Stats panel */}
            <motion.div
              className="liquid-glass rounded-xl border border-white/10 p-4 flex flex-col gap-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <h4 className="text-xs font-mono text-purple-300/60 uppercase tracking-widest mb-2">Archive Stats</h4>
              <StatLine icon={ImageIcon} label="Total Images" value="11,247" />
              <StatLine icon={Star} label="Favorites" value="328" />
              <StatLine icon={Telescope} label="Observatories" value="42" />
              <StatLine icon={BookOpen} label="Articles Read" value="1,094" />
              <StatLine icon={Archive} label="Collections" value="17" />
            </motion.div>

            {/* Mini calendar heatmap */}
            <motion.div
              className="liquid-glass rounded-xl border border-white/10 p-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              <h4 className="text-xs font-mono text-purple-300/60 uppercase tracking-widest mb-3">June 2026</h4>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => {
                  const active = i < 7; // first 7 days "viewed"
                  const today = i === 6;
                  return (
                    <motion.div
                      key={i}
                      className={`aspect-square rounded-sm text-[8px] font-mono flex items-center justify-center
                        ${today ? 'bg-purple-500 text-white' : active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-white/20'}`}
                      animate={today ? { boxShadow: ['0 0 0px #c084fc', '0 0 8px #c084fc', '0 0 0px #c084fc'] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {i + 1}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Daily Streak ── */}
        <div className="mt-6">
          <DailyStreak />
        </div>

        {/* ── Bottom ticker bar ── */}
        <motion.div
          className="mt-6 liquid-glass rounded-xl border border-white/10 px-5 py-3 flex items-center gap-4 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <span className="shrink-0 font-mono text-[10px] text-purple-400 uppercase tracking-widest">Feed</span>
          <div className="h-3 w-px bg-white/10 shrink-0" />
          <motion.div
            className="flex gap-8 whitespace-nowrap font-mono text-xs text-white/40"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[
              "NGC 1300 — Barred Spiral Galaxy",
              "Crab Nebula Pulsar Wind",
              "Jupiter's Great Red Spot in IR",
              "Eta Carinae Homunculus",
              "Lagoon Nebula (M8)",
              "Hubble Ultra Deep Field",
              "Cassiopeia A Supernova Remnant",
              "NGC 1300 — Barred Spiral Galaxy",
              "Crab Nebula Pulsar Wind",
              "Jupiter's Great Red Spot in IR",
              "Eta Carinae Homunculus",
              "Lagoon Nebula (M8)",
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-400/60" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
