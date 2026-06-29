import React, { useEffect, useRef } from 'react';

export function FadingVideo({ src, className, style }: { src: string, className?: string, style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeTo = (targetOpacity: number, duration: number = 500) => {
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
      }

      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        video.style.opacity = (startOpacity + (targetOpacity - startOpacity) * progress).toString();
        
        if (progress < 1) {
          rAFRef.current = requestAnimationFrame(animate);
        }
      };
      rAFRef.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch(() => {});
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (remaining > 0 && remaining <= 0.55) {
        fadingOutRef.current = true;
        fadeTo(0, 500); // the prompt says 0.55 sec lead, 500ms fade duration
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1, 500);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Initial setup if video already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
