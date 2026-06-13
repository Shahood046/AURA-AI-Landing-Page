import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Droplets,
  Mountain,
  Zap,
  CloudLightning,
  AlertTriangle,
  MapPin,
  Activity,
  Shield,
  Radio,
} from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

/* ─── disaster type config ─── */
interface DisasterType {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const DISASTER_TYPES: Record<string, DisasterType> = {
  wildfire:   { label: 'Wildfire',    color: '#f97316', icon: <Flame size={14} /> },
  flood:      { label: 'Flood',       color: '#3b82f6', icon: <Droplets size={14} /> },
  earthquake: { label: 'Earthquake',  color: '#ef4444', icon: <Zap size={14} /> },
  volcano:    { label: 'Volcano',     color: '#a855f7', icon: <Mountain size={14} /> },
  storm:      { label: 'Storm',       color: '#06b6d4', icon: <CloudLightning size={14} /> },
};

/* ─── alert data ─── */
interface AlertItem {
  id: number;
  type: keyof typeof DISASTER_TYPES;
  name: string;
  severity: 'Critical' | 'High' | 'Medium';
  location: string;
  time: string;
}

const ALERT_POOL: AlertItem[] = [
  { id: 1,  type: 'wildfire',   name: 'Sierra Nevada Complex',     severity: 'Critical', location: '37.8°N, 119.5°W',  time: 'Just now' },
  { id: 2,  type: 'earthquake', name: 'Tōhoku Seismic Event',      severity: 'Critical', location: '38.3°N, 142.4°E',  time: '12s ago' },
  { id: 3,  type: 'flood',      name: 'Mekong Delta Surge',        severity: 'High',     location: '10.0°N, 105.8°E',  time: '34s ago' },
  { id: 4,  type: 'volcano',    name: 'Mt. Etna Eruption',         severity: 'High',     location: '37.7°N, 15.0°E',   time: '1m ago' },
  { id: 5,  type: 'storm',      name: 'Cyclone Anaya',             severity: 'Critical', location: '14.5°N, 67.2°E',   time: '2m ago' },
  { id: 6,  type: 'wildfire',   name: 'Amazon Basin Ignition',     severity: 'High',     location: '3.1°S, 60.0°W',    time: '3m ago' },
  { id: 7,  type: 'earthquake', name: 'Chilean Subduction Quake',  severity: 'Medium',   location: '33.4°S, 70.6°W',   time: '4m ago' },
  { id: 8,  type: 'flood',      name: 'Rhine Overflow Alert',      severity: 'Medium',   location: '51.2°N, 6.8°E',    time: '5m ago' },
  { id: 9,  type: 'storm',      name: 'Typhoon Kiko',              severity: 'High',     location: '22.3°N, 131.5°E',  time: '6m ago' },
  { id: 10, type: 'volcano',    name: 'Kilauea Lava Flow',         severity: 'Medium',   location: '19.4°N, 155.3°W',  time: '7m ago' },
  { id: 11, type: 'wildfire',   name: 'Australian Bushfire',       severity: 'Critical', location: '33.9°S, 151.2°E',  time: '8m ago' },
  { id: 12, type: 'earthquake', name: 'Istanbul Tremor',           severity: 'High',     location: '41.0°N, 28.9°E',   time: '9m ago' },
];

/* ─── map marker positions (percentage of map area) ─── */
const MAP_MARKERS = [
  { id: 'm1', type: 'wildfire',   x: 15, y: 38, alertId: 1  },
  { id: 'm2', type: 'earthquake', x: 82, y: 32, alertId: 2  },
  { id: 'm3', type: 'flood',      x: 75, y: 55, alertId: 3  },
  { id: 'm4', type: 'volcano',    x: 52, y: 36, alertId: 4  },
  { id: 'm5', type: 'storm',      x: 65, y: 48, alertId: 5  },
  { id: 'm6', type: 'wildfire',   x: 32, y: 62, alertId: 6  },
  { id: 'm7', type: 'earthquake', x: 26, y: 72, alertId: 7  },
  { id: 'm8', type: 'flood',      x: 50, y: 30, alertId: 8  },
  { id: 'm9', type: 'storm',      x: 88, y: 40, alertId: 9  },
  { id: 'm10', type: 'volcano',   x: 10, y: 50, alertId: 10 },
];

/* ─── severity helpers ─── */
function severityColor(s: string) {
  if (s === 'Critical') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (s === 'High') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
}

/* ─── feature pills data ─── */
const FEATURE_PILLS = [
  'Flood Monitoring',
  'Wildfire Tracking',
  'Earthquake Alerts',
  'Volcanic Activity',
  'Storm Events',
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function DisasterIntelligenceSection() {
  /* ── scrolling alert feed ── */
  const [visibleAlerts, setVisibleAlerts] = useState<AlertItem[]>([ALERT_POOL[0]]);

  useEffect(() => {
    let idx = 1;
    const interval = setInterval(() => {
      if (idx < ALERT_POOL.length) {
        setVisibleAlerts((prev) => [ALERT_POOL[idx], ...prev].slice(0, 8));
        idx++;
      } else {
        idx = 0; // loop
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ── threat gauge animated value ── */
  const [threatLevel, setThreatLevel] = useState(72);
  useEffect(() => {
    const t = setInterval(() => {
      setThreatLevel((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(55, Math.min(95, prev + delta));
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  /* ── active events ticker ── */
  const [activeEvents, setActiveEvents] = useState(23);
  useEffect(() => {
    const t = setInterval(() => {
      setActiveEvents((p) => p + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const threatArc = useMemo(() => {
    const pct = threatLevel / 100;
    const angle = pct * 180;
    const rad = (angle * Math.PI) / 180;
    const r = 40;
    const cx = 50;
    const cy = 45;
    const x = cx - r * Math.cos(rad);
    const y = cy - r * Math.sin(rad);
    const largeArc = angle > 180 ? 1 : 0;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  }, [threatLevel]);

  return (
    <SectionWrapper
      id="disaster-intelligence"
      index={4}
      totalSections={10}
      label="Crisis Response"
      title="Earth Events & Disaster Intelligence"
      description="Monitor global natural disasters in real-time powered by NASA EONET feeds. Track floods, wildfires, volcanic activity, earthquakes, and storm events with intelligent alerting."
      accentColor="#ef4444"
    >
      {/* ─── main grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* ═══ LEFT: World Map Panel (3 cols) ═══ */}
        <div className="lg:col-span-3 liquid-glass rounded-2xl border border-white/5 overflow-hidden relative">
          {/* panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="font-mono text-xs text-white/60 tracking-wider uppercase">
                Global Threat Map — Live
              </span>
            </div>
            <span className="font-mono text-[10px] text-red-400/80 tracking-widest">EONET FEED</span>
          </div>

          {/* map area */}
          <div className="relative w-full aspect-[2/1] min-h-[320px] bg-[#050a14]">
            {/* grid lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '10% 10%',
              }}
            />

            {/* Stylised world map SVG (simplified continents) */}
            <svg
              viewBox="0 0 200 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Equator + Tropics */}
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="2 2" />
              <line x1="0" y1="27" x2="200" y2="27" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" strokeDasharray="1 3" />
              <line x1="0" y1="73" x2="200" y2="73" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" strokeDasharray="1 3" />

              {/* North America */}
              <path
                d="M20,20 L35,18 L42,22 L44,30 L40,38 L34,42 L28,40 L22,35 L18,28 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* South America */}
              <path
                d="M38,50 L44,48 L48,55 L50,65 L46,78 L40,82 L36,74 L34,60 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* Europe */}
              <path
                d="M88,18 L100,16 L106,20 L104,28 L96,32 L90,30 L86,24 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* Africa */}
              <path
                d="M90,36 L102,34 L108,42 L110,55 L106,68 L98,74 L90,70 L86,56 L88,44 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* Asia */}
              <path
                d="M110,14 L140,12 L160,18 L168,28 L164,38 L150,44 L136,42 L124,38 L116,32 L108,24 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* India */}
              <path
                d="M130,38 L138,36 L142,44 L138,54 L132,52 L128,44 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* Australia */}
              <path
                d="M154,60 L172,58 L178,64 L176,74 L166,78 L156,74 L152,66 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
            </svg>

            {/* ── Pulsing disaster markers ── */}
            {MAP_MARKERS.map((marker, i) => {
              const dt = DISASTER_TYPES[marker.type];
              return (
                <motion.div
                  key={marker.id}
                  className="absolute flex items-center justify-center"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* outer pulse ring */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      border: `1px solid ${dt.color}`,
                      opacity: 0.3,
                    }}
                    animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  {/* second pulse */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      border: `1px solid ${dt.color}`,
                      opacity: 0.2,
                    }}
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 0.4 }}
                  />
                  {/* core dot */}
                  <motion.div
                    className="relative z-10 rounded-full flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: `${dt.color}30`,
                      border: `1.5px solid ${dt.color}`,
                      boxShadow: `0 0 12px ${dt.color}60`,
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <span style={{ color: dt.color }} className="flex items-center justify-center">
                      {dt.icon}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* subtle scan-line sweep */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.25) 50%, transparent 100%)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* ═══ RIGHT: Alert Feed + Gauge (2 cols) ═══ */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* ── Threat Level Gauge ── */}
          <div className="liquid-glass rounded-2xl border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-red-400" />
              <span className="font-mono text-xs text-white/60 tracking-wider uppercase">Threat Level</span>
            </div>

            <div className="flex items-end justify-between">
              {/* gauge SVG */}
              <svg viewBox="0 0 100 55" className="w-32 h-auto">
                {/* track */}
                <path
                  d="M 10 45 A 40 40 0 0 1 90 45"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* value arc */}
                <motion.path
                  d={threatArc}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.5))' }}
                />
                {/* needle dot */}
                <motion.circle
                  cx={50 - 40 * Math.cos((threatLevel / 100) * Math.PI)}
                  cy={45 - 40 * Math.sin((threatLevel / 100) * Math.PI)}
                  r="3"
                  fill="#ef4444"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.8))' }}
                  animate={{ r: [3, 4, 3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>

              {/* numeric readout */}
              <div className="text-right">
                <motion.span
                  key={threatLevel}
                  className="text-3xl font-mono font-bold text-red-400"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {threatLevel}
                </motion.span>
                <span className="text-sm font-mono text-white/40 ml-1">/ 100</span>
                <div className="mt-1">
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    threatLevel >= 80
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : threatLevel >= 65
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {threatLevel >= 80 ? 'SEVERE' : threatLevel >= 65 ? 'ELEVATED' : 'MODERATE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Alert Feed ── */}
          <div className="liquid-glass rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Radio size={13} className="text-red-400" />
                </motion.div>
                <span className="font-mono text-xs text-white/60 tracking-wider uppercase">Live Alert Feed</span>
              </div>
              <span className="font-mono text-[10px] text-red-400/70">{visibleAlerts.length} events</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[340px] scrollbar-thin scrollbar-thumb-white/10">
              <AnimatePresence initial={false}>
                {visibleAlerts.map((alert) => {
                  const dt = DISASTER_TYPES[alert.type];
                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, x: 30, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-center gap-3 group hover:border-white/10 transition-colors"
                    >
                      {/* icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${dt.color}18`, border: `1px solid ${dt.color}30` }}
                      >
                        <span style={{ color: dt.color }}>{dt.icon}</span>
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">{alert.name}</span>
                          <span
                            className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full border shrink-0 ${severityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={10} className="text-white/30" />
                          <span className="font-mono text-[10px] text-white/40">{alert.location}</span>
                          <span className="text-white/15 mx-1">|</span>
                          <span className="font-mono text-[10px] text-white/30">{alert.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { label: 'Active Events', value: activeEvents, icon: <Activity size={14} className="text-red-400" /> },
          { label: 'Monitoring',    value: '147 Zones',  icon: <MapPin size={14} className="text-red-400" /> },
          { label: 'Alerts Issued', value: 12,            icon: <AlertTriangle size={14} className="text-red-400" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="liquid-glass rounded-xl border border-white/5 px-5 py-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <div className="font-mono text-lg text-white font-semibold leading-none">
                {typeof stat.value === 'number' ? (
                  <motion.span
                    key={stat.value}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.span>
                ) : (
                  stat.value
                )}
              </div>
              <span className="text-[11px] text-white/40 tracking-wide">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Feature Pills ─── */}
      <div className="flex flex-wrap gap-2 mt-5">
        {FEATURE_PILLS.map((pill, i) => {
          const typeKey = Object.keys(DISASTER_TYPES)[i % Object.keys(DISASTER_TYPES).length];
          const dt = DISASTER_TYPES[typeKey];
          return (
            <motion.span
              key={pill}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs font-mono tracking-wide border border-white/5 flex items-center gap-1.5 cursor-default"
              whileHover={{ scale: 1.05, borderColor: `${dt.color}40` }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span style={{ color: dt.color }}>{dt.icon}</span>
              <span className="text-white/70">{pill}</span>
            </motion.span>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
