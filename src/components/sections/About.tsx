'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  useCMSProfile,
  useCMSHighlights,
  useCMSStats,
} from '@/hooks/useCMSData';
import Image from 'next/image';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const profile = useCMSProfile();
  const highlights = useCMSHighlights();
  const stats = useCMSStats();

  return (
    <section id="about" className="py-32 relative">
      {/* LAYOUT: Asymmetric Split - Content Left, Visual Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          {/* Left Column - Text Content (7 cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-white/30" />
              <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
                About Me
              </span>
            </motion.div>

            {/* Main Heading - Left Aligned */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            >
              Building Digital
              <br />
              <span className="text-neutral-500">Experiences</span>
            </motion.h2>

            {/* Description Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4 text-neutral-400 leading-relaxed mb-10 max-w-xl"
            >
              {profile.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Highlights - Horizontal Cards */}
            {highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.3)' }}
                    className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-full"
                  >
                    <item.icon className="text-white/60" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="text-neutral-500 text-xs ml-2">
                        {item.desc}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Column - Visual Element (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* Stats Card - Floating */}
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Background Frame */}
                <div className="absolute inset-4 border border-white/10 rounded-2xl" />
                <div className="absolute inset-8 border border-white/5 rounded-xl" />

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-56 h-56 border border-dashed border-white/10 rounded-full"
                  />
                </div>

                {/* Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {profile.avatar ? (
                    <div className="w-48 h-48 rounded-full bg-neutral-900 border border-white/20 overflow-hidden relative">
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-6xl">
                      👨‍💻
                    </div>
                  )}
                </div>

                {/* Floating Stats */}
                {stats.length > 0 &&
                  stats.map((stat, index) => {
                    const positions = [
                      'top-0 left-1/2 -translate-x-1/2',
                      'bottom-8 left-4',
                      'bottom-8 right-4',
                    ];
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.15 }}
                        whileHover={{ scale: 1.05 }}
                        className={`absolute ${positions[index]} bg-neutral-900/80 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-xl text-center`}
                      >
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative - Right Side Line */}
      <div className="absolute top-1/2 right-0 w-32 h-px bg-linear-to-l from-white/10 to-transparent hidden lg:block" />
    </section>
  );
}
