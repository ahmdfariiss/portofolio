'use client';

import { motion } from 'framer-motion';
import { FaHeart, FaArrowUp } from 'react-icons/fa';
import { socialLinks } from '@/constants';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            Portfolio
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-neutral-900/30 border border-white/5 rounded-lg text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="w-24 h-px bg-white/10" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 text-sm flex items-center gap-2"
            >
              © {new Date().getFullYear()} Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FaHeart className="text-white" size={12} />
              </motion.span>
            </motion.p>

            {/* Tech Stack */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-600 text-xs"
            >
              Ahmad Faris
            </motion.p>
          </div>

          {/* Back to Top */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
          >
            <FaArrowUp size={10} />
            Back to Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
