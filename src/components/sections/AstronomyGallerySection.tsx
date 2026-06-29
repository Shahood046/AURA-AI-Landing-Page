import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SpaceImage {
  id: string;
  url: string;
  title: string;
  date: string;
  copyright: string;
  description: string;
}

const GALLERY_IMAGES: SpaceImage[] = [
  {
    id: 'pillars',
    url: '/apod_pillars.jpg',
    title: 'Pillars of Creation',
    date: 'June 28, 2026',
    copyright: 'Image © STScI / ESA / NASA',
    description: 'Breathtaking towering columns of interstellar dust and gas in the Eagle Nebula, acting as active nurseries for newly forming stars.'
  },
  {
    id: 'galaxy',
    url: '/apod_galaxy.jpg',
    title: 'Grand Design Spiral Galaxy NGC 4303',
    date: 'June 27, 2026',
    copyright: 'Image © ESA / Hubble & NASA',
    description: 'A spectacular face-on spiral galaxy displaying intricate dust lanes, glowing clusters of massive blue stars, and active star-forming regions.'
  },
  {
    id: 'carina',
    url: '/apod_carina.jpg',
    title: 'Cosmic Cliffs of the Carina Nebula',
    date: 'June 26, 2026',
    copyright: 'Image © STScI / ESA / NASA / CSA',
    description: 'A mesmerizing visual showing the edge of a giant gaseous cavity where stellar winds carve beautiful, glowing pillars of hot molecular gas.'
  },
  {
    id: 'deepfield',
    url: '/apod_deepfield.jpg',
    title: 'JWST First Deep Field',
    date: 'June 25, 2026',
    copyright: 'Image © STScI / ESA / NASA / CSA',
    description: 'The deepest and sharpest infrared view of the universe to date, revealing thousands of distant galaxies and gravitational lensing arcs in exquisite detail.'
  }
];

export function AstronomyGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "200px" });

  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const cachedId = localStorage.getItem('aura_apod_active_id');
    if (cachedId) {
      const idx = GALLERY_IMAGES.findIndex(i => i.id === cachedId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const activeImg = GALLERY_IMAGES[activeIdx];

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalActiveImg, setModalActiveImg] = useState<SpaceImage>(GALLERY_IMAGES[0]);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax spring calculations
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 });
  const parallaxX = useTransform(springX, [0, 1], [-8, 8]);
  const parallaxY = useTransform(springY, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const valX = (e.clientX - rect.left) / rect.width;
    const valY = (e.clientY - rect.top) / rect.height;
    mouseX.set(valX);
    mouseY.set(valY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  // Automatic slideshow timer
  useEffect(() => {
    if (isGalleryOpen || isHovered || !isInView) return; // Pause slideshow offscreen!
    
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 6000); // Cycle every 6 seconds

    return () => clearInterval(interval);
  }, [isGalleryOpen, isHovered, isInView]);

  // Sync cache with active index
  useEffect(() => {
    localStorage.setItem('aura_apod_active_id', GALLERY_IMAGES[activeIdx].id);
  }, [activeIdx]);

  const selectImage = (img: SpaceImage) => {
    const idx = GALLERY_IMAGES.findIndex(i => i.id === img.id);
    if (idx !== -1) {
      setActiveIdx(idx);
    }
  };

  const openGalleryModal = () => {
    setModalActiveImg(activeImg);
    setIsGalleryOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="astronomy-gallery"
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between py-20 px-6 md:px-16 lg:px-24 overflow-hidden border-b border-white/5"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[25%] right-[15%] w-96 h-96 rounded-full blur-[140px] opacity-10 bg-purple-500" />
        <div className="absolute bottom-[25%] left-[15%] w-96 h-96 rounded-full blur-[140px] opacity-10 bg-blue-500" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col flex-1 justify-between">
        
        {/* Top Header & Dynamic Title */}
        <div className="w-full flex flex-col items-center text-center mb-6">
          <span className="text-[10px] font-mono tracking-[0.3em] text-purple-400/80 uppercase mb-2">
            Cosmic Observatory
          </span>
          <h3 className="text-xl md:text-3xl font-heading italic text-white/95 leading-tight tracking-wide h-8">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeImg.id}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.6 }}
              >
                {activeImg.title}
              </motion.span>
            </AnimatePresence>
          </h3>
        </div>

        {/* Huge NASA Image Container (90% height constraint handled by flex-1 and absolute layers) */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative w-full aspect-[16/9] md:h-[60vh] max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] cursor-crosshair select-none"
        >
          {/* Overlay gradient - rises softly from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10 pointer-events-none" />

          {/* Crossfade Images Layer */}
          <AnimatePresence initial={false}>
            <motion.div
              key={activeImg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Subtle mouse parallax container */}
              <motion.div
                style={{ x: parallaxX, y: parallaxY }}
                className="w-full h-full scale-[1.04]" // scale up slightly so edges don't reveal during parallax
              >
                {/* Ken Burns slow zoom image */}
                <motion.img
                  src={activeImg.url}
                  alt={activeImg.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.0 }}
                  animate={{ scale: 1.025 }}
                  transition={{ 
                    duration: 30, 
                    ease: "linear", 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tiny Metadata Row beneath image */}
        <div className="w-full mt-4 flex justify-between items-center text-[11px] md:text-xs font-mono text-white/40 tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
            <span>NASA APOD &bull; {activeImg.date}</span>
          </div>
          <span className="text-right">{activeImg.copyright}</span>
        </div>

        {/* Elegant Thin Horizontal Divider */}
        <div className="w-full my-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="max-w-2xl text-left">
            <h2 className="text-4xl md:text-5xl font-heading italic text-white leading-tight tracking-tight mb-4">
              Astronomy Picture of the Day
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-body font-light leading-relaxed">
              Discover a new view of the universe every day, from distant galaxies and colorful nebulae to planetary landscapes and cosmic phenomena.
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Quick selector dots */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              {GALLERY_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => selectImage(img)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeImg.id === img.id ? 'bg-purple-400 w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={img.title}
                />
              ))}
            </div>

            <button
              onClick={openGalleryModal}
              className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-purple-400 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
            >
              <span>Explore Gallery</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

      </div>

      {/* --- Glassmorphic Gallery Modal --- */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-neutral-950/90 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[70vh] shadow-[0_0_80px_rgba(168,85,247,0.15)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Side: Large Image Display */}
              <div className="relative w-full md:w-[60%] h-[40%] md:h-full bg-black overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={modalActiveImg.id}
                    src={modalActiveImg.url}
                    alt={modalActiveImg.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows inside Modal Image */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <button
                    onClick={() => {
                      const idx = GALLERY_IMAGES.findIndex(img => img.id === modalActiveImg.id);
                      const prevIdx = (idx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
                      setModalActiveImg(GALLERY_IMAGES[prevIdx]);
                    }}
                    className="p-2 rounded-full bg-black/55 border border-white/5 hover:border-white/20 text-white/70 hover:text-white transition-all cursor-pointer pointer-events-auto hover:scale-105"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const idx = GALLERY_IMAGES.findIndex(img => img.id === modalActiveImg.id);
                      const nextIdx = (idx + 1) % GALLERY_IMAGES.length;
                      setModalActiveImg(GALLERY_IMAGES[nextIdx]);
                    }}
                    className="p-2 rounded-full bg-black/55 border border-white/5 hover:border-white/20 text-white/70 hover:text-white transition-all cursor-pointer pointer-events-auto hover:scale-105"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Right Side: Details & Selector */}
              <div className="w-full md:w-[40%] h-[60%] md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 bg-neutral-950/50">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase mb-2">
                    {modalActiveImg.date}
                  </span>
                  <h4 className="text-xl md:text-2xl font-heading italic text-white mb-2 leading-tight">
                    {modalActiveImg.title}
                  </h4>
                  <span className="text-xs font-mono text-white/50 mb-4 block">
                    {modalActiveImg.copyright}
                  </span>
                  
                  <p className="text-xs md:text-sm text-slate-400 font-body font-light leading-relaxed mb-6">
                    {modalActiveImg.description}
                  </p>
                </div>

                <div className="mt-auto">
                  {/* Gallery selector thumbnail list */}
                  <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-3 block text-left">
                    Select Image
                  </span>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {GALLERY_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setModalActiveImg(img)}
                        className={`relative aspect-square rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                          modalActiveImg.id === img.id 
                            ? 'border-purple-400 ring-2 ring-purple-400/20 scale-[1.03]' 
                            : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* CTA: Select as Active Hero */}
                  <button
                    onClick={() => {
                      selectImage(modalActiveImg);
                      setIsGalleryOpen(false);
                    }}
                    className="w-full py-2.5 rounded-full text-xs font-medium text-black bg-white hover:bg-purple-300 hover:text-black transition-all duration-300 font-mono tracking-wider cursor-pointer"
                  >
                    View in Exhibition
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

