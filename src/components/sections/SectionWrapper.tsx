import React from 'react';
import { motion } from 'motion/react';

interface SectionWrapperProps {
  id: string;
  index: number;
  totalSections: number;
  label: string;
  title: React.ReactNode;
  description: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  index,
  totalSections,
  label,
  title,
  description,
  accentColor,
  children
}: SectionWrapperProps) {
  return (
    <section id={id} className="relative w-full min-h-screen py-32 overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div 
          className="absolute top-[20%] right-[10%] w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 flex flex-col justify-center min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight max-w-4xl tracking-tight mb-6">
            {title}
          </h2>

          <p className="text-lg md:text-xl text-slate-400 font-body font-light leading-relaxed max-w-2xl">
            {description}
          </p>
        </motion.div>

        {/* Custom Section Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
