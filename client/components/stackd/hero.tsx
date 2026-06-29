'use client';

import { motion } from 'framer-motion';
import { useTyping } from '@/hooks/use-typing';

interface HeroProps {
  onReady?: () => void;
}

export function Hero({ onReady }: HeroProps) {
  const typedText = useTyping('Deploy Next.js apps in seconds', 60);

  return (
    <motion.div
      className="relative z-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onAnimationComplete={onReady}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="text-sm font-mono text-accent mb-8 tracking-widest">STACKD</div>
      </motion.div>

      <motion.h1
        className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span className="text-foreground">Build your </span>
        <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
          future stack
        </span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground mb-8 h-8 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {typedText}
        <span className="animate-pulse">_</span>
      </motion.p>

      <motion.p
        className="text-base text-muted-foreground max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Deploy modern web applications with zero configuration. Experience the future of web development.
      </motion.p>
    </motion.div>
  );
}
