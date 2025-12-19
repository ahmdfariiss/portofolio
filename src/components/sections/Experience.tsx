'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import {
  useSupabaseExperiences,
  useSupabaseEducation,
} from '@/hooks/useSupabase';
import type { DBExperience, DBEducation } from '@/lib/supabase';

// Helper to get title from experience or education
const getItemTitle = (
  item: DBExperience | DBEducation | undefined,
  type: 'work' | 'education'
) => {
  if (!item) return '';
  if (type === 'work') return (item as DBExperience).title;
  return (item as DBEducation).degree;
};

// Helper to get organization/institution
const getItemPlace = (
  item: DBExperience | DBEducation | undefined,
  type: 'work' | 'education'
) => {
  if (!item) return '';
  if (type === 'work') return (item as DBExperience).organization;
  return (item as DBEducation).institution;
};

// Helper to get skills/achievements
const getItemTags = (
  item: DBExperience | DBEducation | undefined,
  type: 'work' | 'education'
): string[] => {
  if (!item) return [];
  if (type === 'work') return (item as DBExperience).skills || [];
  return (item as DBEducation).achievements || [];
};

export default function Experience() {
  const { experiences } = useSupabaseExperiences();
  const { education } = useSupabaseEducation();

  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentData = activeTab === 'work' ? experiences : education;
  const currentItem = currentData[activeIndex];
  const hasData = currentData.length > 0;

  // Don't render until mounted (for hydration safety)
  if (!isMounted) {
    return null;
  }

  const handleNext = () => {
    if (currentData.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % currentData.length);
  };

  const handlePrev = () => {
    if (currentData.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? currentData.length - 1 : prev - 1));
  };

  const handleTabChange = (tab: 'work' | 'education') => {
    setActiveTab(tab);
    setActiveIndex(0);
  };

  return (
    <section
      id="experience"
      className="min-h-screen py-32 relative overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4"
          >
            My Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
          >
            Experience
          </motion.h2>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10"
          >
            <button
              onClick={() => handleTabChange('work')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'work'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FaBriefcase size={14} />
              Work
            </button>
            <button
              onClick={() => handleTabChange('education')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'education'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FaGraduationCap size={14} />
              Education
            </button>
          </motion.div>
        </div>

        {/* Empty State */}
        {!hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              {activeTab === 'work' ? (
                <FaBriefcase size={32} className="text-neutral-600" />
              ) : (
                <FaGraduationCap size={32} className="text-neutral-600" />
              )}
            </div>
            <h3 className="text-xl font-medium text-neutral-400 mb-2">
              No {activeTab === 'work' ? 'Work Experience' : 'Education'} Yet
            </h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              {activeTab === 'work'
                ? 'Work experience will appear here once added through the CMS.'
                : 'Education history will appear here once added through the CMS.'}
            </p>
          </motion.div>
        )}

        {/* Main Content - Split Layout */}
        {hasData && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Large Card Display */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              {/* Main Card */}
              <motion.div
                key={`${activeTab}-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative bg-linear-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32">
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white/10 rounded-full" />
                  <div className="absolute top-8 right-8 w-10 h-10 border border-white/5 rounded-full" />
                </div>

                {/* Year Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeTab === 'work' ? 'bg-blue-400' : 'bg-green-400'
                    } animate-pulse`}
                  />
                  <span className="text-sm font-mono text-neutral-400">
                    {currentItem?.period}
                  </span>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {getItemTitle(currentItem, activeTab)}
                  </h3>
                  <div className="flex items-center gap-2 text-neutral-400 mb-6">
                    <FaMapMarkerAlt size={12} />
                    <span>{getItemPlace(currentItem, activeTab)}</span>
                  </div>
                  <p className="text-neutral-500 leading-relaxed mb-6">
                    {currentItem?.description}
                  </p>

                  {/* Tags/Skills */}
                  <div className="flex flex-wrap gap-2">
                    {activeTab === 'work'
                      ? getItemTags(currentItem, 'work').map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400"
                          >
                            {skill}
                          </span>
                        ))
                      : getItemTags(currentItem, 'education').map(
                          (achievement) => (
                            <span
                              key={achievement}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
                            >
                              <FaTrophy size={10} />
                              {achievement}
                            </span>
                          )
                        )}
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <HiArrowLeft size={18} />
                    <span className="text-sm">Previous</span>
                  </button>
                  <div className="flex gap-1.5">
                    {currentData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === activeIndex
                            ? `w-8 ${
                                activeTab === 'work'
                                  ? 'bg-blue-400'
                                  : 'bg-green-400'
                              }`
                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="text-sm">Next</span>
                    <HiArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Timeline List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />

              {/* Timeline Items */}
              <div className="space-y-4">
                {currentData.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 8 }}
                      className={`relative w-full text-left pl-16 pr-6 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/5 border border-white/10'
                          : 'hover:bg-white/2'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? activeTab === 'work'
                              ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50'
                              : 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                            : 'bg-neutral-900 border-white/20'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeDot"
                            className="absolute inset-0 rounded-full"
                            initial={false}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`font-medium transition-colors ${
                              isActive ? 'text-white' : 'text-neutral-400'
                            }`}
                          >
                            {getItemTitle(item, activeTab)}
                          </h4>
                          <span
                            className={`text-xs font-mono transition-colors ${
                              isActive ? 'text-neutral-300' : 'text-neutral-600'
                            }`}
                          >
                            {item.period}
                          </span>
                        </div>
                        <p
                          className={`text-sm transition-colors ${
                            isActive ? 'text-neutral-400' : 'text-neutral-600'
                          }`}
                        >
                          {getItemPlace(item, activeTab)}
                        </p>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute right-3 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${
                            activeTab === 'work'
                              ? 'bg-blue-400'
                              : 'bg-green-400'
                          }`}
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-linear-to-r from-white/5 to-transparent rounded-2xl border border-white/5"
              >
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {experiences.length}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">
                      Work Exp
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {education.length}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">
                      Education
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {education.reduce(
                        (acc, edu) => acc + (edu.achievements?.length || 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">
                      Achievements
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
