import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

/* ─── Particle / Star field ─────────────────────────────────────────── */

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.8,
    opacity: Math.random() * 0.5 + 0.15,
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 30,
    duration: Math.random() * 18 + 14,
    delay: Math.random() * 6,
  }));
}

function StarField({ stars }: { stars: Star[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            x: [0, s.driftX, -s.driftX * 0.6, 0],
            y: [0, s.driftY, -s.driftY * 0.4, 0],
            opacity: [s.opacity, s.opacity * 1.8, s.opacity * 0.6, s.opacity],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typing / pulse effect for the heading ─────────────────────────── */

function PulsingCursor() {
  return (
    <motion.span
      className="inline-block w-[3px] h-[0.85em] bg-white/60 ml-1 align-middle rounded-full"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Main Component ────────────────────────────────────────────────── */

export function FooterCTA() {
  const stars = useMemo(() => generateStars(18), []);

  /* Simple time ticker for the "live" feel */
  const [utc, setUtc] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setUtc(
        d.toISOString().slice(11, 19) + ' UTC'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    '8,432+ Satellites',
    '24/7 Monitoring',
    'Real-time Data',
    'AI Powered',
  ];

  const footerLinks = ['Documentation', 'Privacy', 'Terms', 'Status'];

  return (
    <section className="relative w-full bg-black overflow-hidden">
      {/* ── Background layers ────────────────────────────────────── */}
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 30%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Star field */}
      <StarField stars={stars} />

      {/* Horizon line glow at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.06) 50%, transparent 90%)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-heading italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
        >
          Ready to See Earth
          <br />
          From Above?
          <PulsingCursor />
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-6 max-w-xl text-base sm:text-lg text-white/50 font-body leading-relaxed"
        >
          Join the next generation of space intelligence. AURA-AI is free, open,
          and always evolving.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Primary */}
          <button
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-white text-black font-body font-semibold text-sm px-8 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-[0.98] liquid-glass-strong"
          >
            Launch AURA-AI
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          {/* Secondary */}
          <button
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-transparent text-white font-body font-medium text-sm px-8 py-3.5 transition-all duration-300 hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-white/40"
        >
          {stats.map((stat, i) => (
            <span key={stat} className="flex items-center gap-3">
              {stat}
              {i < stats.length - 1 && (
                <span className="text-white/15">•</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Live UTC clock */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-4 font-mono text-[10px] text-white/20 tracking-widest uppercase"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-1.5 animate-pulse align-middle" />
          Systems Operational — {utc}
        </motion.div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Footer Links */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 flex items-center gap-1"
              >
                {link}
                {link === 'Status' && (
                  <ExternalLink className="w-2.5 h-2.5" />
                )}
              </a>
            ))}
          </motion.nav>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xs text-white/30 font-body"
          >
            © 2026 AURA-AI. Built for Earth and Space Intelligence.
          </motion.p>
        </div>
      </div>

      {/* ── Decorative SVG orbits (very subtle) ─────────────────── */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-[0.03]"
        viewBox="0 0 900 900"
        fill="none"
        aria-hidden
      >
        <circle cx="450" cy="450" r="200" stroke="white" strokeWidth="0.5" />
        <circle cx="450" cy="450" r="320" stroke="white" strokeWidth="0.5" />
        <circle cx="450" cy="450" r="440" stroke="white" strokeWidth="0.3" />
      </svg>
    </section>
  );
}

export default FooterCTA;
