'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Gauge, Globe, Code2, Layers } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Deploy in milliseconds with edge-first infrastructure',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Enterprise-grade security and DDoS protection',
  },
  {
    icon: Gauge,
    title: 'Auto Scaling',
    description: 'Handle millions of requests without configuration',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Serve content from 300+ data centers worldwide',
  },
  {
    icon: Code2,
    title: 'Framework Agnostic',
    description: 'Deploy any framework: Next.js, React, Vue, and more',
  },
  {
    icon: Layers,
    title: 'Full Stack Ready',
    description: 'Built-in database, auth, and serverless functions',
  },
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.section
      className="relative z-10 py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Choose </span>
            <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
              Stackd?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform for modern web application deployment and scaling
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                {/* Card background glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative border border-white/10 bg-card/50 backdrop-blur rounded-2xl p-6 h-full hover:border-accent/30 transition-colors">
                  {/* Icon */}
                  <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-secondary/30 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>

                  {/* Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
