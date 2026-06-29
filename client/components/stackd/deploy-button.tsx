'use client';

import { motion } from 'framer-motion';
import { Rocket, Loader2, CheckCircle } from 'lucide-react';

interface DeployButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  disabled?: boolean;
}

export function DeployButton({ onClick, isLoading, isSuccess, disabled }: DeployButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading || isSuccess}
      className="relative group"
      whileHover={{ scale: disabled || isLoading || isSuccess ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading || isSuccess ? 1 : 0.95 }}
    >
      {/* Button glow background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent via-secondary to-accent rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ripple effect on hover */}
      <motion.div
        className="absolute inset-0 bg-accent rounded-lg opacity-0"
        animate={isLoading ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0 }}
      />

      <button
        className="relative px-8 py-3 bg-gradient-to-r from-accent to-secondary text-background font-bold rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
        disabled={disabled || isLoading || isSuccess}
      >
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Deployed!</span>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5" />
            <span>Deploying...</span>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            <span>Deploy Now</span>
          </motion.div>
        )}
      </button>
    </motion.button>
  );
}
