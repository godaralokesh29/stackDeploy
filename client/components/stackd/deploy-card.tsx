'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface DeployCardProps {
  url: string;
  onUrlChange: (value: string) => void;
  onDeploy: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}

export function DeployCard({ url, onUrlChange, onDeploy, isLoading, isSuccess }: DeployCardProps) {
  return (
    <motion.div
      className="relative z-20 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative border border-white/10 bg-card/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 -z-10 transition-opacity" />

        <div className="space-y-6">
          {/* Input section */}
          <div className="space-y-3">
            <label className="block text-sm font-mono text-accent uppercase tracking-wider">
              <Zap className="inline mr-2 w-4 h-4" />
              Repository URL
            </label>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <input
                type="text"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="github.com/username/repo"
                className="w-full bg-muted/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                disabled={isLoading || isSuccess}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
            </motion.div>
          </div>

          {/* Info text */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span>Paste your GitHub repository URL to deploy</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
