'use client';

import { motion } from 'framer-motion';
import { GitBranch, Share2, Code2, Mail } from 'lucide-react';

const links = [
  { label: 'Documentation', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Status', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Support', href: '#' },
];

const socials = [
  { icon: GitBranch, href: '#' },
  { icon: Share2, href: '#' },
  { icon: Code2, href: '#' },
  { icon: Mail, href: '#' },
];

export function Footer() {
  return (
    <motion.footer
      className="relative z-10 border-t border-white/10 bg-card/30 backdrop-blur"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                STACKD
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              The modern deployment platform for web applications.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
                whileHover={{ x: 4 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Social */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm font-mono uppercase text-accent tracking-widest">Follow Us</p>
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <motion.div
          className="flex items-center justify-between text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>&copy; 2025 Stackd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
