import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, MessageSquare, Terminal, Zap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

export default function AIAssistantSection() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'user', text: 'Analyze satellite feed for Sector 4.' }
  ]);

  useEffect(() => {
    const sequence = [
      { role: 'ai', text: 'Processing feed... thermal signatures detected.', delay: 2000 },
      { role: 'user', text: 'Cross-reference with historical data.', delay: 5000 },
      { role: 'ai', text: 'Match found. 87% probability of emerging wildfire.', delay: 7000 },
    ];

    const timeouts = sequence.map((msg) =>
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: msg.role as 'user' | 'ai', text: msg.text }]);
      }, msg.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <SectionWrapper title="AI Assistant" description="Cognitive companion for rapid data synthesis and operational decision making.">
      <div className="flex flex-col md:flex-row gap-8 items-center mt-12">
        <div className="flex-1 space-y-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors"
          >
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-400" />
              Cognitive Core
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              AURA-AI acts as your co-pilot, digesting petabytes of raw data into natural language insights. 
              Interact natively to command sensor grids, query historical intelligence, and run predictive models in real-time.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-blue-400 font-mono bg-blue-500/10 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4" /> Sub-millisecond latency
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 w-full bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          <div className="bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">Live Simulation: Neural Chat</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div className="p-6 h-80 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-4 rounded-xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 self-end ml-auto rounded-tr-sm' 
                    : 'bg-gray-800/80 border border-gray-700 text-gray-200 self-start rounded-tl-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === 'user' ? (
                    <MessageSquare className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-purple-400" />
                  )}
                  <div className="text-[10px] font-bold tracking-wider uppercase opacity-60">
                    {msg.role === 'user' ? 'Operator' : 'AURA-AI'}
                  </div>
                </div>
                <div className="text-sm font-mono leading-relaxed">{msg.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
