"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import * as THREE from 'three';
import { ArrowRight, Globe } from 'lucide-react';

// --- Main Hero Component ---
export const WovenLightHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    // Start animations
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        transition: { delay: 1.5, duration: 1 }
    });
  }, [textControls, buttonControls]);

  const headline = "The Operating System for Earth and Space Intelligence";
  
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#020617]">
      <WovenCanvas />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pointer-events-none">
        <div className="max-w-4xl">
          <motion.div
            custom={0}
            initial={{ opacity: 0, y: 30 }}
            animate={textControls}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-mono font-medium tracking-widest text-primary uppercase">
              Earth Never Sleeps
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-display font-bold leading-[1.1] tracking-tight mb-8">
            The Operating System for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white">
              Earth and Space Intelligence
            </span>
          </h1>
          
          <motion.p
            custom={1}
            initial={{ opacity: 0, y: 30 }}
            animate={textControls}
            className="max-w-2xl text-lg md:text-xl text-slate-400 font-sans font-light leading-relaxed pointer-events-auto"
          >
            Monitor satellites, launches, disasters, aircraft, space weather, and Earth observation missions through a single interactive platform powered by real-time data and artificial intelligence.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={buttonControls} className="mt-12 flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
            <button className="group relative w-full sm:w-auto px-8 py-4 bg-white text-[#020617] font-mono text-sm tracking-widest font-semibold hover:bg-slate-200 transition-colors flex justify-center items-center gap-3">
              <span>LAUNCH AURA-AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-mono text-sm tracking-widest hover:border-white/50 hover:bg-white/5 transition-colors flex justify-center items-center gap-3">
              <Globe className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span>EXPLORE THE LIVE GLOBE</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Three.js Canvas Component ---
export const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // VERY STRICT CLEANUP: If there's already a canvas, remove it.
    // Also, query the DOM just in case there are orphaned canvases
    const existingCanvases = mountRef.current.querySelectorAll('canvas');
    existingCanvases.forEach(c => c.remove());

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Ensure the canvas itself takes up the full container and is absolutely positioned
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';

    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // Main group to hold Earth and all orbital elements
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // --- DARK EARTH MESH ---
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg');
    
    const earthRadius = 2.6;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.8,
        metalness: 0.2,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.rotation.z = 23.5 * Math.PI / 180;
    earthGroup.add(earthMesh);

    // --- ATMOSPHERE GLOW ---
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      void main() {
        // Fresnel effect intensity
        float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.2, 0.5, 0.9, 1.0) * intensity * 0.8;
      }
    `;
    const atmosMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosMesh = new THREE.Mesh(new THREE.SphereGeometry(earthRadius * 1.15, 64, 64), atmosMaterial);
    earthGroup.add(atmosMesh);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // brighter ambient
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // --- SATELLITES AND ORBITS ---
    const orbitsGroup = new THREE.Group();
    earthGroup.add(orbitsGroup);

    const colors = [0x38bdf8, 0x818cf8, 0xffffff];

    for (let i = 0; i < 20; i++) {
        const radius = earthRadius + 0.3 + (Math.random() * 1.5);
        
        // Faint orbital ring
        const ringGeo = new THREE.TorusGeometry(radius, 0.003, 16, 100);
        const ringColor = colors[Math.floor(Math.random() * colors.length)];
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: ringColor, 
            transparent: true, 
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        
        // Random orientations
        ring.rotation.x = Math.random() * Math.PI * 2;
        ring.rotation.y = Math.random() * Math.PI * 2;
        orbitsGroup.add(ring);

        // Satellites
        const numSatellites = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < numSatellites; j++) {
            const satGeo = new THREE.SphereGeometry(0.015, 8, 8);
            const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const sat = new THREE.Mesh(satGeo, satMat);
            
            const angle = Math.random() * Math.PI * 2;
            sat.position.x = Math.cos(angle) * radius;
            sat.position.y = Math.sin(angle) * radius;
            
            const satGlowGeo = new THREE.SphereGeometry(0.04, 8, 8);
            const satGlowMat = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
            const satGlow = new THREE.Mesh(satGlowGeo, satGlowMat);
            sat.add(satGlow);

            sat.userData = { radius, angle, speed: (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1) };
            ring.add(sat);
        }
    }

    const targetRotation = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    let isHovered = false;

    const handleMouseMove = (event: MouseEvent) => {
        // More pronounced rotation based on mouse
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        targetRotation.x = mouse.y * 1.0;
        targetRotation.y = mouse.x * 2.0;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- RENDER LOOP ---
    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        
        // Raycaster for direct earth hover detection
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(earthMesh);
        isHovered = intersects.length > 0;
        
        // Speed up rotation when directly hovered
        const baseRotationSpeed = isHovered ? 0.8 : 0.15;
        earthMesh.rotation.y += baseRotationSpeed * delta;
        
        // Use slerp-like smoothing for mouse rotation
        earthGroup.rotation.y += (targetRotation.y - earthGroup.rotation.y) * 0.1;
        earthGroup.rotation.x += (targetRotation.x - earthGroup.rotation.x) * 0.1;
        
        // Rotate Orbits
        orbitsGroup.children.forEach((ring) => {
            ring.rotation.z += 0.03 * delta; 
            
            ring.children.forEach(child => {
                if (child.userData.speed) {
                    child.userData.angle += child.userData.speed * delta;
                    child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                    child.position.y = Math.sin(child.userData.angle) * child.userData.radius;
                }
            });
        });

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Position earth beautifully and RESPONSIVELY so it is never cut off
        if (window.innerWidth < 1024) {
            earthGroup.position.set(0, -2.0, 0); 
            earthGroup.scale.set(0.7, 0.7, 0.7);
        } else {
            // Keep it fully in frame on the right side.
            // A typical visible X boundary at Z=0 with fov=45 is ~3.3 * aspect.
            // We want the earth (radius ~2.6) to fit comfortably.
            const visibleRight = 3.3 * aspect;
            const targetX = Math.min(2.5, visibleRight - 3.0); // 3.0 provides padding
            
            earthGroup.position.set(Math.max(1.0, targetX), 0, 0); 
            earthGroup.scale.set(1.0, 1.0, 1.0);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        
        // Deeply dispose scene resources (geometries, materials, textures)
        earthTexture.dispose();
        scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry?.dispose();
                const m = obj.material;
                if (Array.isArray(m)) m.forEach(mm => mm.dispose());
                else m?.dispose();
            }
        });
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
