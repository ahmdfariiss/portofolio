'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCMSSkills } from '@/hooks/useCMSData';

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const skills = useCMSSkills();

  return (
    <section id="skills" className="py-32 relative bg-neutral-950/50">
      {/* LAYOUT: Full-Width Staggered Grid with Large Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref}>
          {/* Header - Right Aligned */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:max-w-xl"
            >
              <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4">
                What I Work With
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Skills &<br />
                <span className="text-neutral-600">Technologies</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-neutral-500 max-w-sm lg:text-right"
            >
              Constantly learning and adapting to new technologies to build
              better solutions.
            </motion.p>
          </div>

          {/* Skills Grid - Masonry-like Stagger */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {skills.map((skill, index) => {
              const isHovered = hoveredSkill === skill.name;
              // Create visual interest with varying heights
              const isLarge = index % 5 === 0;

              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  className={`group relative ${isLarge ? 'row-span-2' : ''}`}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`h-full p-6 bg-neutral-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-white/20 hover:bg-neutral-900/80 transition-all duration-300 ${
                      isLarge ? 'min-h-50' : 'min-h-30'
                    }`}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        rotate: isHovered ? 360 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <skill.icon
                        size={isLarge ? 40 : 28}
                        className="text-neutral-400 group-hover:text-white transition-colors duration-300"
                      />
                    </motion.div>

                    {/* Name */}
                    <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>

                    {/* Level Indicator - Show on Hover */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        scaleX: isHovered ? 1 : 0,
                      }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isHovered ? `${skill.level}%` : 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full bg-white"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 pt-16 border-t border-white/5"
          >
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              {[
                { value: `${skills.length}+`, label: 'Technologies' },
                { value: '3', label: 'Specializations' },
                { value: '∞', label: 'Learning' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-neutral-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
