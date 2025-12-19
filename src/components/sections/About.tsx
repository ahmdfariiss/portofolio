'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaCode, FaRocket } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface ProfileData {
  name: string;
  bio: string[];
}

interface HighlightData {
  icon: string;
  title: string;
  description: string;
}

interface StatData {
  value: string;
  label: string;
}

// Default data sebagai fallback
const defaultProfile: ProfileData = {
  name: 'Ahmad Faris',
  bio: [
    'Passionate about building web applications and IoT solutions.',
    'Currently pursuing my degree while working on various projects.',
  ],
};

const defaultHighlights: HighlightData[] = [
  { icon: 'FaCode', title: 'Web Development', description: 'Building modern web apps' },
  { icon: 'FaRocket', title: 'IoT Projects', description: 'Smart devices & automation' },
];

const defaultStats: StatData[] = [
  { value: '10+', label: 'Projects' },
  { value: '2+', label: 'Years Experience' },
  { value: '5+', label: 'Technologies' },
];

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCode: FaCode,
  FaRocket: FaRocket,
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [highlights, setHighlights] = useState<HighlightData[]>(defaultHighlights);
  const [stats, setStats] = useState<StatData[]>(defaultStats);

  useEffect(() => {
    // Fetch dari Supabase
    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profile')
          .select('name, bio')
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Fetch highlights
        const { data: highlightsData } = await supabase
          .from('highlights')
          .select('icon, title, description')
          .order('order_index');
        
        if (highlightsData && highlightsData.length > 0) {
          setHighlights(highlightsData);
        }

        // Fetch stats
        const { data: statsData } = await supabase
          .from('stats')
          .select('value, label')
          .order('order_index');
        
        if (statsData && statsData.length > 0) {
          setStats(statsData);
        }
      } catch (error) {
        console.error('About fetch error:', error);
        // Keep default data on error
      }
    };

    fetchData();
  }, []);

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          {/* Left Column - Text Content */}
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

            {/* Main Heading */}
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

            {/* Description */}
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

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {highlights.map((item, index) => {
                const IconComp = iconMap[item.icon] || FaCode;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{
                      y: -4,
                      borderColor: 'rgba(255,255,255,0.3)',
                    }}
                    className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-full"
                  >
                    <IconComp className="text-white/60" />
                    <div>
                      <span className="text-white text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="text-neutral-500 text-xs ml-2">
                        {item.description}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* Stats Card */}
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

                {/* Stats positioned around */}
                <div className="absolute inset-0">
                  {stats.map((stat, index) => {
                    const positions = [
                      'top-8 left-1/2 -translate-x-1/2',
                      'bottom-16 left-8',
                      'bottom-16 right-8',
                    ];
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.2 }}
                        className={`absolute ${positions[index] || ''} text-center`}
                      >
                        <div className="text-3xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
