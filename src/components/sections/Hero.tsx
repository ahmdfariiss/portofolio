'use client';

import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { HiArrowRight } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useSupabaseProfile } from '@/hooks/useSupabase';

// Icon mapping for social links
const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  twitter: FaTwitter,
};

export default function Hero() {
  const { profile, loading } = useSupabaseProfile();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Default profile for loading state
  const displayProfile = profile || {
    name: 'Ahmad Faris',
    role: ['Web Developer', 'IoT Enthusiast'],
    year: '2024',
    semester: 'Semester 5',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  };

  // Build role animation sequence
  const roleSequence = displayProfile.role.flatMap((role: string) => [
    role,
    2000,
  ]);

  // Build social links from profile
  const socialLinks = Object.entries(displayProfile.social || {})
    .filter(([, url]) => url && url !== '')
    .map(([key, url]) => ({
      key,
      url: url as string,
      icon: socialIconMap[key],
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    .filter((link) => link.icon);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* LAYOUT: Centered Dramatic with Decorative Frame */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Decorative Frame - pointer-events-none to not block clicks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 border border-white/5 -m-12 md:-m-20 pointer-events-none"
        />

        {/* Corner Accents */}
        <div className="absolute -top-12 -left-12 md:-top-20 md:-left-20 w-8 h-8 border-l border-t border-white/20 pointer-events-none" />
        <div className="absolute -top-12 -right-12 md:-top-20 md:-right-20 w-8 h-8 border-r border-t border-white/20 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 md:-bottom-20 md:-left-20 w-8 h-8 border-l border-b border-white/20 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 md:-bottom-20 md:-right-20 w-8 h-8 border-r border-b border-white/20 pointer-events-none" />

        {/* Small Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.4em] text-neutral-500 uppercase">
            Portfolio / {profile.year}
          </span>
        </motion.div>

        {/* Main Name - Extra Large */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          {profile.name}
        </motion.h1>

        {/* Animated Role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl text-neutral-400 mb-12 h-8"
        >
          <TypeAnimation
            sequence={roleSequence}
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Horizontal Line with Text */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <div className="w-16 md:w-24 h-px bg-white/20" />
          <span className="text-[10px] text-neutral-600 tracking-[0.3em]">
            {displayProfile.semester.toUpperCase()}
          </span>
          <div className="w-16 md:w-24 h-px bg-white/20" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 relative z-20"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('#projects')}
            className="group px-8 py-4 bg-white text-black text-sm font-medium flex items-center gap-3 hover:bg-neutral-200 transition-colors cursor-pointer pointer-events-auto"
          >
            View Projects
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('#contact')}
            className="px-8 py-4 border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer pointer-events-auto"
          >
            Get in Touch
          </motion.button>
        </motion.div>

        {/* Social Links from Profile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center justify-center gap-8 relative z-20"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              whileHover={{ y: -3 }}
              className="text-neutral-600 hover:text-white transition-colors cursor-pointer pointer-events-auto"
              title={social.label}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-linear-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
