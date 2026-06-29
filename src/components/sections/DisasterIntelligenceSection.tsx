import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import * as THREE from 'three';
import { Flame, Wind, Waves, Mountain, Zap, CloudRain, Thermometer, AlertTriangle } from 'lucide-react';

// All events placed safely inland to align correctly with the 3D globe texture
const EVENTS = [
  { id: 0, Icon: CloudRain,     label: 'Cyclone Warning',    time: '6 min ago',  color: '#67e8f9', lat:  23.5, lon:  90.4 }, // Bangladesh (Dhaka)
  { id: 1, Icon: Mountain,      label: 'Volcanic Activity',  time: '31 min ago', color: '#f87171', lat:  -7.5, lon: 110.4 }, // Java, Indonesia (Mt. Merapi)
  { id: 2, Icon: Waves,         label: 'Flood Warning',      time: '15 min ago', color: '#818cf8', lat:  25.9, lon:  68.4 }, // Pakistan (Sindh)
  { id: 3, Icon: Thermometer,   label: 'Extreme Heatwave',   time: '1 hr ago',   color: '#fb923c', lat:  27.0, lon:  73.0 }, // India (Rajasthan)
  { id: 4, Icon: Zap,           label: 'Earthquake M6.4',    time: '44 min ago', color: '#facc15', lat:  37.6, lon:  36.9 }, // Turkey (Kahramanmaraş)
  { id: 5, Icon: AlertTriangle, label: 'Flash Flood Alert',  time: '22 min ago', color: '#a78bfa', lat: -15.8, lon: -47.9 }, // Brazil (Brasilia)
  { id: 6, Icon: Wind,          label: 'Hurricane Landfall', time: '8 min ago',  color: '#38bdf8', lat:  33.0, lon: -87.0 }, // Alabama, USA (Inland)
  { id: 7, Icon: Flame,         label: 'Wildfire Detected',  time: '2 min ago',  color: '#f97316', lat:  38.0, lon:-120.0 }, // California, USA (Sierra Nevada)
  { id: 8, Icon: AlertTriangle, label: 'Landslide Alert',    time: '12 min ago', color: '#fb7185', lat: -15.0, lon: -70.0 }, // Peru (Andes)
  { id: 9, Icon: Wind,          label: 'Severe Dust Storm',  time: '50 min ago', color: '#fb923c', lat:  25.0, lon:  15.0 }, // Libya (Sahara Desert)
  { id: 10, Icon: CloudRain,    label: 'Blizzard Warning',   time: '40 min ago', color: '#38bdf8', lat:  60.0, lon: 100.0 }, // Russia (Siberia)
  { id: 11, Icon: Flame,        label: 'Bushfire Warning',   time: '5 min ago',  color: '#f97316', lat: -25.0, lon: 134.0 }, // Australia (Outback)
  { id: 12, Icon: Waves,        label: 'River Flooding',     time: '18 min ago', color: '#818cf8', lat:  48.8, lon:   2.3 }, // France (Paris)
  { id: 13, Icon: Mountain,     label: 'Volcanic Plume',     time: '25 min ago', color: '#f87171', lat:  65.0, lon: -18.0 }, // Iceland (Inland)
] as const;

// Helper to format lat/lon as readable coordinates
function getCoordinateString(lat: number, lon: number) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

// Correct Three.js sphere lat/lon → local 3D position
// Matches the exact vertex calculation formula of Three.js SphereGeometry:
// x = -R * cos(theta) * sin(phi)
// y = R * cos(phi)
// z = R * sin(theta) * sin(phi)
function latLonTo3D(lat: number, lon: number, R: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
     -R * Math.cos(theta) * Math.sin(phi),
      R * Math.cos(phi),
      R * Math.sin(theta) * Math.sin(phi)
  );
}

// ── Globe ─────────────────────────────────────────────────────────────────────
function GlobeCanvas({
  markerRefs,
  activeIdxRef,
}: {
  markerRefs:   React.RefObject<(HTMLDivElement | null)[]>;
  activeIdxRef: React.MutableRefObject<number>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    el.querySelectorAll('canvas').forEach(c => c.remove());

    const R = 3.0;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', zIndex: '0', pointerEvents: 'none',
    });
    el.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg');
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.85, metalness: 0.1,
      }),
    );
    // Initial rotation positioning (focus on East Asia / Bangladesh)
    earth.rotation.y = 270 * Math.PI / 180;
    earth.rotation.z = 23.5 * Math.PI / 180; // axial tilt
    scene.add(earth);

    // Atmosphere glow
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.1, 64, 64),
      new THREE.ShaderMaterial({
        vertexShader:   `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vN;void main(){float i=pow(.55-dot(vN,vec3(0,0,1)),2.);gl_FragColor=vec4(.15,.4,.9,1.)*i*.7;}`,
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
      }),
    ));

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const localPositions = EVENTS.map(e => latLonTo3D(e.lat, e.lon, R));
    const _worldPos  = new THREE.Vector3();
    const _projected = new THREE.Vector3();
    const R2 = R * R; // visibility threshold

    // Park markers offscreen initially
    if (markerRefs.current) {
      markerRefs.current.forEach(markerEl => {
        if (markerEl) {
          markerEl.style.left = '-999px';
          markerEl.style.top  = '-999px';
        }
      });
    }

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      
      // Rotates slightly faster: changed speed from 0.0010 to 0.0035
      earth.rotation.y += 0.0035;
      renderer.render(scene, camera);

      if (!markerRefs.current) return;

      EVENTS.forEach((event, idx) => {
        const markerEl = markerRefs.current[idx];
        if (!markerEl) return;

        _worldPos.copy(localPositions[idx]).applyEuler(earth.rotation);

        // Surface point is visible when dot(worldPos, camPos) > R²
        const isFront = _worldPos.dot(camera.position) > R2;

        markerEl.style.opacity = isFront ? '1' : '0';
        if (!isFront) {
          markerEl.style.left = '-999px';
          return;
        }

        _projected.copy(_worldPos).project(camera);
        markerEl.style.left = `${((_projected.x + 1) / 2) * window.innerWidth}px`;
        markerEl.style.top  = `${((-_projected.y + 1) / 2) * window.innerHeight}px`;
      });
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      earthTexture.dispose();
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach(mm => mm.dispose());
          else m?.dispose();
        }
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [markerRefs, activeIdxRef]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

// ── Section ───────────────────────────────────────────────────────────────────
export function DisasterIntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "300px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const markerRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % EVENTS.length;
        activeIdxRef.current = next;
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="disaster-intelligence"
      className="relative w-full h-screen overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 bg-black"
    >
      {isInView && <GlobeCanvas markerRefs={markerRefs} activeIdxRef={activeIdxRef} />}

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 45%, transparent 30%, rgba(0,0,8,0.55) 65%, rgba(0,0,0,0.92) 100%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

      {/* All markers rendering simultaneously on the rotating globe */}
      {EVENTS.map((item, idx) => {
        const MarkerIcon = item.Icon;
        const isActive = idx === activeIdx;
        const coordinateString = getCoordinateString(item.lat, item.lon);

        return (
          <div
            key={item.id}
            ref={el => { markerRefs.current[idx] = el; }}
            className="absolute z-20 transition-opacity duration-700 pointer-events-none"
            style={{ transform: 'translate(-50%,-50%)' }}
          >
            {/* Pulse rings */}
            <motion.span
              className="absolute rounded-full border"
              style={{ borderColor: item.color, width: 30, height: 30, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
              animate={{ scale: [1, 2.6], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute rounded-full border"
              style={{ borderColor: item.color, width: 30, height: 30, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />

            {/* Core dot */}
            <motion.span
              className="relative block rounded-full"
              style={{ backgroundColor: item.color, width: 10, height: 10 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Event card (only shows detail card for the active index event) */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  className="absolute left-5 bottom-5 whitespace-nowrap pointer-events-none"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: 5 }}
                  transition={{ duration: 0.35 }}
                >
                  <div
                    className="px-3 py-2.5 rounded-xl font-body backdrop-blur-xl"
                    style={{
                      background: 'rgba(4,4,14,0.88)',
                      border:     `1px solid ${item.color}30`,
                      boxShadow:  `0 0 18px ${item.color}14`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MarkerIcon size={11} style={{ color: item.color }} strokeWidth={2.5} />
                      <span className="font-semibold text-white" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                        {item.label}
                      </span>
                    </div>
                    {/* Precise coordinates of the event instead of the country name */}
                    <div className="text-slate-400 font-mono" style={{ fontSize: '10px' }}>
                      {coordinateString}
                    </div>
                    <div style={{ color: item.color, fontSize: '10px', opacity: 0.8, marginTop: 2 }}>{item.time}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-30 w-full max-w-4xl flex flex-col items-start text-left"
      >
        <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight tracking-tight mb-6">
          Disaster Intelligence
        </h2>
        <p className="text-lg md:text-xl text-slate-300 font-body font-light leading-relaxed max-w-2xl mb-8">
          Monitor global natural disasters in real-time. Track wildfires, floods, volcanic activity, and storm systems as they emerge — anywhere on Earth.
        </p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm"
        >
          Monitor Events
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
