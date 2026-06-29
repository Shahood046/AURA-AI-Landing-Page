import React from 'react';
import { motion } from 'motion/react';

export function BlurText({ text, delayOffset = 0, className = "", justify = 'center' }: { text: string, delayOffset?: number, className?: string, justify?: string }) {
  const words = text.split(" ");
  
  return (
    <p className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: justify, rowGap: '0.1em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          whileInView={{
            filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
            opacity: [0, 0.5, 1],
            y: [50, -5, 0]
          }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: delayOffset + (i * 0.1) // 100ms per word stagger
          }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
