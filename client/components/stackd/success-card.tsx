'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Trophy } from 'lucide-react';
import { useState } from 'react';

interface SuccessCardProps {
  deploymentUrl: string;
  onDeploy: () => void;
}

export function SuccessCard({ deploymentUrl, onDeploy }: SuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="relative z-20 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative border border-white/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Success glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative space-y-6">
          {/* Success icon */}
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-8 h-8 text-background" />
          </motion.div>

          {/* Success message */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-accent">Deployment Successful!</h2>
            <p className="text-muted-foreground">Your application is now live on the edge</p>
          </div>

          {/* URL display */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-mono text-accent uppercase tracking-wider">
              Live URL
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3 bg-muted/50 border border-white/10 rounded-xl px-4 py-3">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-mono text-sm text-foreground truncate hover:text-accent transition-colors"
                >
                  {deploymentUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4 text-accent" />
                </button>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Open URL"
                >
                  <ExternalLink className="w-4 h-4 text-accent" />
                </a>
              </div>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-accent font-mono"
              >
                ✓ Copied to clipboard
              </motion.p>
            )}
          </motion.div>

          {/* Deploy another button */}
          <motion.button
            onClick={onDeploy}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-accent/20 to-secondary/20 border border-accent/50 rounded-xl font-mono text-sm text-accent hover:from-accent/30 hover:to-secondary/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Deploy Another Project
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
