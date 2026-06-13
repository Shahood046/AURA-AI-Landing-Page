import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plane, Radio, ArrowRight } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

/* ── data ────────────────────────────────────────────────────────── */

interface Aircraft {
  id: number;
  callsign: string;
  x: number;          // 0‑100 %
  y: number;          // 0‑100 %
  dx: number;         // drift per tick
  dy: number;
  heading: number;    // degrees
  altitude: string;
  showLabel: boolean;
}

const INITIAL_AIRCRAFT: Aircraft[] = [
  { id: 1, callsign: 'UAE231',  x: 25, y: 22, dx:  0.12, dy:  0.08, heading: 45,  altitude: 'FL380', showLabel: true  },
  { id: 2, callsign: 'PIA302',  x: 68, y: 35, dx: -0.09, dy:  0.05, heading: 210, altitude: 'FL350', showLabel: true  },
  { id: 3, callsign: 'BA117',   x: 40, y: 60, dx:  0.07, dy: -0.10, heading: 320, altitude: 'FL410', showLabel: true  },
  { id: 4, callsign: 'LH442',   x: 78, y: 72, dx: -0.11, dy: -0.04, heading: 270, altitude: 'FL360', showLabel: false },
  { id: 5, callsign: 'QR801',   x: 15, y: 75, dx:  0.14, dy: -0.06, heading: 55,  altitude: 'FL390', showLabel: true  },
  { id: 6, callsign: 'AF447',   x: 55, y: 18, dx: -0.05, dy:  0.12, heading: 180, altitude: 'FL330', showLabel: false },
  { id: 7, callsign: 'SQ21',    x: 85, y: 50, dx: -0.13, dy:  0.02, heading: 250, altitude: 'FL430', showLabel: false },
  { id: 8, callsign: 'EK215',   x: 32, y: 42, dx:  0.10, dy:  0.07, heading: 75,  altitude: 'FL370', showLabel: true  },
  { id: 9, callsign: 'TK1',     x: 50, y: 85, dx:  0.06, dy: -0.14, heading: 350, altitude: 'FL340', showLabel: false },
  { id: 10,callsign: 'CX888',   x: 62, y: 55, dx: -0.08, dy: -0.09, heading: 225, altitude: 'FL400', showLabel: false },
];

interface FlightRow {
  callsign: string;
  route: string;
  altitude: string;
  speed: string;
  status: 'en-route' | 'climbing' | 'descending';
}

const FLIGHT_LIST: FlightRow[] = [
  { callsign: 'UAE231', route: 'DXB → LHR', altitude: 'FL380', speed: '487 kts', status: 'en-route'    },
  { callsign: 'PIA302', route: 'ISB → JED', altitude: 'FL350', speed: '462 kts', status: 'climbing'    },
  { callsign: 'BA117',  route: 'LHR → JFK', altitude: 'FL410', speed: '502 kts', status: 'en-route'    },
  { callsign: 'QR801',  route: 'DOH → SIN', altitude: 'FL390', speed: '478 kts', status: 'descending'  },
  { callsign: 'EK215',  route: 'DXB → LAX', altitude: 'FL370', speed: '495 kts', status: 'en-route'    },
];

const FEATURE_PILLS = [
  'Real-time Tracking',
  'Flight Paths',
  'Aircraft Data',
  'Global Coverage',
  'OpenSky Powered',
];

const STATS = [
  { label: 'Aircraft Tracked', value: '12,847' },
  { label: 'Flights Active',   value: '9,432'  },
  { label: 'Airspaces',        value: '247'    },
];

/* ── helpers ─────────────────────────────────────────────────────── */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const statusColor: Record<FlightRow['status'], string> = {
  'en-route':   'text-green-400',
  'climbing':   'text-yellow-400',
  'descending': 'text-sky-400',
};

/* ── component ───────────────────────────────────────────────────── */

export function AirTrafficSection() {
  /* aircraft drift simulation */
  const [aircraft, setAircraft] = useState<Aircraft[]>(INITIAL_AIRCRAFT);

  useEffect(() => {
    const id = setInterval(() => {
      setAircraft(prev =>
        prev.map(a => ({
          ...a,
          x: clamp(a.x + a.dx + (Math.random() - 0.5) * 0.04, 4, 96),
          y: clamp(a.y + a.dy + (Math.random() - 0.5) * 0.04, 4, 96),
        })),
      );
    }, 120);
    return () => clearInterval(id);
  }, []);

  /* live ticker values */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const dynamicStats = useMemo(() => {
    const jitter = (base: number) => base + Math.floor(Math.random() * 40 - 20);
    return [
      { label: 'Aircraft Tracked', value: jitter(12847).toLocaleString() },
      { label: 'Flights Active',   value: jitter(9432).toLocaleString()  },
      { label: 'Airspaces',        value: '247' },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  /* concentric rings */
  const rings = [20, 35, 50, 65, 80];

  return (
    <SectionWrapper
      id="air-traffic"
      index={5}
      totalSections={10}
      label="Aviation Intelligence"
      title="Air Traffic Operations"
      description="Monitor global air traffic in real-time powered by OpenSky Network. Track aircraft positions, flight paths, and aviation activity across worldwide airspace."
      accentColor="#4ade80"
    >
      {/* ── Stats row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {dynamicStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="liquid-glass rounded-xl p-4 border border-white/5 text-center"
          >
            <p className="font-mono text-2xl md:text-3xl text-green-400 tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid: Radar + Side Panel ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* ── RADAR DISPLAY ──────────────────────────────────────── */}
        <div className="liquid-glass-strong relative rounded-2xl border border-white/5 overflow-hidden aspect-square md:aspect-[4/3]">
          {/* subtle grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full bg-green-500/10 blur-[60px]" />
          </div>

          {/* ── Concentric circles (SVG) ─────────────────────────── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* crosshair lines */}
            <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(74,222,128,0.12)" strokeWidth="0.2" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(74,222,128,0.12)" strokeWidth="0.2" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="rgba(74,222,128,0.06)" strokeWidth="0.15" />
            <line x1="85" y1="15" x2="15" y2="85" stroke="rgba(74,222,128,0.06)" strokeWidth="0.15" />

            {/* rings */}
            {rings.map((r, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r / 2}
                fill="none"
                stroke="rgba(74,222,128,0.12)"
                strokeWidth="0.2"
                strokeDasharray={i % 2 === 0 ? 'none' : '1 1'}
              />
            ))}

            {/* center dot */}
            <circle cx="50" cy="50" r="0.7" fill="#4ade80" opacity="0.9" />
          </svg>

          {/* ── Rotating radar sweep ──────────────────────────────── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="absolute"
              style={{ width: '100%', height: '100%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              {/* sweep cone via conic-gradient */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(74,222,128,0.18) 15deg, rgba(74,222,128,0.06) 40deg, transparent 70deg)',
                }}
              />
              {/* leading edge line */}
              <div
                className="absolute left-1/2 bottom-1/2 origin-bottom"
                style={{ width: '1px', height: '42%', background: 'linear-gradient(to top, rgba(74,222,128,0.7), transparent)' }}
              />
            </motion.div>
          </div>

          {/* ── Aircraft blips ────────────────────────────────────── */}
          {aircraft.map((a) => (
            <motion.div
              key={a.id}
              className="absolute z-10"
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              animate={{ left: `${a.x}%`, top: `${a.y}%` }}
              transition={{ duration: 0.12, ease: 'linear' }}
            >
              {/* blip triangle */}
              <svg width="14" height="14" viewBox="0 0 14 14" className="drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" style={{ transform: `rotate(${a.heading}deg)` }}>
                <polygon points="7,1 12,12 7,9 2,12" fill="#4ade80" opacity="0.9" />
              </svg>

              {/* pulse ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-green-400/40"
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: a.id * 0.3 }}
              />

              {/* callsign tooltip */}
              {a.showLabel && (
                <div className="absolute left-5 top-[-4px] whitespace-nowrap">
                  <div className="liquid-glass rounded px-2 py-0.5 text-[10px] font-mono text-green-300 border border-green-500/20 flex items-center gap-1.5">
                    <span className="text-green-400 font-semibold">{a.callsign}</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60">{a.altitude}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* ── HUD overlays ─────────────────────────────────────── */}
          {/* top-left status */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
            <div className="liquid-glass rounded-lg px-3 py-1.5 border border-green-500/15 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[11px] text-green-400 tracking-wide">LIVE RADAR ACTIVE</span>
            </div>
            <div className="liquid-glass rounded-lg px-3 py-1.5 border border-white/5">
              <span className="font-mono text-[10px] text-white/50">RANGE: 450 NM &nbsp;|&nbsp; SCAN: 6 RPM</span>
            </div>
          </div>

          {/* bottom-right coordinates */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="liquid-glass rounded-lg px-3 py-1.5 border border-white/5">
              <span className="font-mono text-[10px] text-white/40">LAT 33.6844° N &nbsp; LON 73.0479° E</span>
            </div>
          </div>

          {/* bottom-left altitude scale */}
          <div className="absolute bottom-4 left-4 z-20 flex items-end gap-[3px]">
            {[28, 45, 60, 38, 52, 70, 55, 40].map((h, i) => (
              <motion.div
                key={i}
                className="w-[4px] rounded-sm bg-green-500/50"
                animate={{ height: [h * 0.4, h * 0.6, h * 0.4] }}
                transition={{ duration: 1.5 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                style={{ height: h * 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* ── SIDE PANEL ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Flight list */}
          <div className="liquid-glass rounded-2xl border border-white/5 p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Active Flights</span>
              </div>
              <span className="font-mono text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                {FLIGHT_LIST.length} shown
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {FLIGHT_LIST.map((f, i) => (
                <motion.div
                  key={f.callsign}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="liquid-glass rounded-xl px-3 py-2.5 border border-white/5 hover:border-green-500/20 transition-colors group cursor-default"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-green-400 font-semibold tracking-wide">{f.callsign}</span>
                    <span className={`text-[10px] font-mono uppercase ${statusColor[f.status]}`}>{f.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
                    <span>{f.route.split(' → ')[0]}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-green-500/60" />
                    <span>{f.route.split(' → ')[1]}</span>
                    <span className="ml-auto text-white/40">{f.altitude}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/40">{f.speed}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mini status panel */}
          <div className="liquid-glass rounded-2xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-white/70 uppercase tracking-wider">System Status</span>
            </div>

            <div className="space-y-2">
              {[
                { label: 'ADS-B Feed',    status: 'Online',  color: 'bg-green-500' },
                { label: 'MLAT Engine',    status: 'Active',  color: 'bg-green-500' },
                { label: 'OpenSky Link',   status: 'Sync\'d', color: 'bg-green-500' },
                { label: 'Radar Network',  status: '247 Nodes', color: 'bg-green-500' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-white/50 font-mono">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full ${row.color}`}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                    <span className="text-[10px] text-green-400/80 font-mono">{row.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature pills ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        {FEATURE_PILLS.map((pill, i) => (
          <motion.span
            key={pill}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
            className="liquid-glass rounded-full px-3 py-1.5 text-xs font-mono text-green-300/90 border border-green-500/15 hover:border-green-400/40 transition-colors cursor-default"
          >
            {pill}
          </motion.span>
        ))}
      </div>
    </SectionWrapper>
  );
}
