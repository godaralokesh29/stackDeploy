'use client';

import { motion } from 'framer-motion';

const steps = [
  'Initializing deployment environment',
  'Building your application',
  'Optimizing bundles',
  'Running security checks',
  'Deploying to edge servers',
  'Finalizing configuration',
];

interface LoadingAnimationProps {
  currentStep: number;
}

export function LoadingAnimation({ currentStep }: LoadingAnimationProps) {
  return (
    <motion.div
      className="relative z-20 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative border border-white/10 bg-card/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div className="space-y-4">
          {/* Terminal-like header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">deployment@stackd.io</span>
          </div>

          {/* Deployment steps */}
          <div className="space-y-3 font-mono text-sm">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: index <= currentStep ? 1 : 0.3, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                  >
                    <span className="text-xs text-background">✓</span>
                  </motion.div>
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5"
                  >
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
                <span className={index <= currentStep ? 'text-accent' : 'text-muted-foreground'}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
