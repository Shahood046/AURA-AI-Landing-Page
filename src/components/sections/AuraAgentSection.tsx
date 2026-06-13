import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Network, Activity, Cpu, Radio } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function AuraAgentSection() {
  const [nodes, setNodes] = useState<{ id: number, active: boolean }[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, active: Math.random() > 0.5 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(current => current.map(node => ({
        ...node,
        active: Math.random() > 0.3
      })));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionWrapper title="AURA Autonomous Agents" description="Self-orchestrating drone swarms and digital sentinels operating in absolute sync.">
      <div className="flex flex-col md:flex-row-reverse gap-10 items-center mt-12">
        <div className="flex-1 space-y-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            className="p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Network className="w-8 h-8 text-purple-400" />
              Swarm Intelligence
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Deploy autonomous agents that adapt to dynamic environments. They communicate, coordinate, and execute complex reconnaissance missions without continuous human intervention.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Mesh Networking', 'Self-Healing', 'Tactical AI'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-mono rounded-full border border-purple-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex-1 w-full relative h-80 bg-black/50 rounded-2xl border border-gray-800 overflow-hidden p-6 flex flex-col justify-center items-center">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-gray-500 animate-pulse" />
            <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Agent Topology</span>
          </div>
          
          <div className="relative w-64 h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-gray-800 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border border-purple-900/30 rounded-full"
            />
            
            {/* Center Node */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-12 h-12 bg-purple-600/20 border border-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Cpu className="w-6 h-6 text-purple-300" />
              </div>
            </div>

            {/* Orbiting Nodes */}
            {nodes.map((node, i) => {
              const angle = (i * 360) / nodes.length;
              const radius = i % 2 === 0 ? 120 : 80;
              return (
                <motion.div
                  key={node.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
                  style={{ transform: `rotate(${angle}deg) translateX(${radius}px)` }}
                >
                  <motion.div
                    animate={{ scale: node.active ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-3 h-3 rounded-full ${node.active ? 'bg-purple-400 shadow-[0_0_10px_#c084fc]' : 'bg-gray-700'}`}
                    style={{ transform: `rotate(-${angle}deg)` }} // keep dot upright
                  />
                  {node.active && (
                    <motion.svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none" style={{ transform: `rotate(-${angle}deg)` }}>
                      <line x1="8" y1="8" x2="-40" y2="-40" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" strokeDasharray="2" />
                    </motion.svg>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
