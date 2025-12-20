'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiGit,
  SiMongodb,
  SiPostgresql,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiExpress,
  SiNestjs,
  SiFlask,
  SiDjango,
  SiGraphql,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiMysql,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiVercel,
  SiNetlify,
  SiLinux,
  SiNginx,
  SiArduino,
  SiRaspberrypi,
  SiFigma,
  SiGithub,
  SiPostman,
  SiPhp,
  SiLaravel,
} from 'react-icons/si';
import {
  FaCode,
  FaMicrochip,
  FaServer,
  FaCloud,
  FaDatabase,
  FaMobile,
  FaHome,
  FaAws,
  FaPython,
} from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';
import { supabase } from '@/lib/supabase';

interface SkillData {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

// Default skills with more comprehensive list
const defaultSkills: SkillData[] = [
  // Frontend
  {
    id: '1',
    name: 'Next.js',
    level: 85,
    category: 'frontend',
    icon: 'SiNextdotjs',
  },
  { id: '2', name: 'React', level: 85, category: 'frontend', icon: 'SiReact' },
  {
    id: '3',
    name: 'TypeScript',
    level: 80,
    category: 'frontend',
    icon: 'SiTypescript',
  },
  {
    id: '4',
    name: 'Tailwind CSS',
    level: 90,
    category: 'frontend',
    icon: 'SiTailwindcss',
  },
  {
    id: '5',
    name: 'JavaScript',
    level: 85,
    category: 'frontend',
    icon: 'SiJavascript',
  },
  { id: '6', name: 'HTML5', level: 95, category: 'frontend', icon: 'SiHtml5' },
  // Backend
  {
    id: '7',
    name: 'Node.js',
    level: 75,
    category: 'backend',
    icon: 'SiNodedotjs',
  },
  { id: '8', name: 'Python', level: 80, category: 'backend', icon: 'SiPython' },
  {
    id: '9',
    name: 'Express',
    level: 70,
    category: 'backend',
    icon: 'SiExpress',
  },
  { id: '10', name: 'PHP', level: 75, category: 'backend', icon: 'SiPhp' },
  {
    id: '11',
    name: 'Laravel',
    level: 70,
    category: 'backend',
    icon: 'SiLaravel',
  },
  // Database
  {
    id: '12',
    name: 'PostgreSQL',
    level: 70,
    category: 'database',
    icon: 'SiPostgresql',
  },
  {
    id: '13',
    name: 'MongoDB',
    level: 65,
    category: 'database',
    icon: 'SiMongodb',
  },
  {
    id: '14',
    name: 'Supabase',
    level: 75,
    category: 'database',
    icon: 'SiSupabase',
  },
  { id: '15', name: 'MySQL', level: 70, category: 'database', icon: 'SiMysql' },
  // IoT
  { id: '16', name: 'Arduino', level: 80, category: 'iot', icon: 'SiArduino' },
  { id: '17', name: 'ESP32', level: 75, category: 'iot', icon: 'FaMicrochip' },
  {
    id: '18',
    name: 'Raspberry Pi',
    level: 70,
    category: 'iot',
    icon: 'SiRaspberrypi',
  },
  // DevOps
  { id: '19', name: 'Git', level: 85, category: 'tools', icon: 'SiGit' },
  { id: '20', name: 'Docker', level: 60, category: 'tools', icon: 'SiDocker' },
];

// Icon mapping - Comprehensive list for web and IoT technologies
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Frontend Frameworks
  SiNextdotjs,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  // Core Web
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  // Backend Frameworks
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPython,
  SiFlask,
  SiDjango,
  SiPhp,
  SiLaravel,
  // API & Data
  SiGraphql,
  SiPrisma,
  // Databases
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiSupabase,
  SiFirebase,
  // DevOps & Cloud
  SiDocker,
  SiKubernetes,
  SiVercel,
  SiNetlify,
  SiLinux,
  SiNginx,
  // IoT
  SiArduino,
  SiRaspberrypi,
  // Tools
  SiGit,
  SiFigma,
  SiGithub,
  SiPostman,
  // FA Icons
  FaCode,
  FaMicrochip,
  FaServer,
  FaCloud,
  FaDatabase,
  FaMobile,
  FaHome,
  FaAws,
  FaPython,
  // VSCode Icon
  VscCode,
  // Aliases for common name variations
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  react: SiReact,
  vue: SiVuedotjs,
  angular: SiAngular,
  svelte: SiSvelte,
  typescript: SiTypescript,
  javascript: SiJavascript,
  html: SiHtml5,
  css: SiCss3,
  tailwind: SiTailwindcss,
  node: SiNodedotjs,
  express: SiExpress,
  nest: SiNestjs,
  python: SiPython,
  fastapi: FaPython,
  flask: SiFlask,
  django: SiDjango,
  php: SiPhp,
  laravel: SiLaravel,
  graphql: SiGraphql,
  prisma: SiPrisma,
  mongodb: SiMongodb,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  redis: SiRedis,
  supabase: SiSupabase,
  firebase: SiFirebase,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  vercel: SiVercel,
  netlify: SiNetlify,
  aws: FaAws,
  gcp: FaCloud,
  linux: SiLinux,
  nginx: SiNginx,
  arduino: SiArduino,
  raspberry: SiRaspberrypi,
  raspberrypi: SiRaspberrypi,
  esp32: FaMicrochip,
  esp8266: FaMicrochip,
  espressif: FaMicrochip,
  mqtt: FaServer,
  homeassistant: FaHome,
  git: SiGit,
  figma: SiFigma,
  github: SiGithub,
  vscode: VscCode,
  postman: SiPostman,
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillData[]>(defaultSkills);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'frontend', 'backend', 'database', 'iot', 'tools'];
  const filteredSkills = activeFilter === 'all' 
    ? skills 
    : skills.filter(s => s.category.toLowerCase() === activeFilter);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await supabase
          .from('skills')
          .select('*')
          .order('order_index');

        if (data && data.length > 0) {
          setSkills(data);
        }
      } catch (error) {
        console.error('Skills fetch error:', error);
        // Keep default data on error
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-32 relative bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref}>
          {/* Header */}
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
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-neutral-500 max-w-md text-right hidden lg:block"
            >
              Constantly learning and adapting to new technologies to build
              better solutions.
            </motion.p>
          </div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {filteredSkills.map((skill, index) => {
              const isHovered = hoveredSkill === skill.id;
              const IconComp = iconMap[skill.icon] || FaCode;

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? 'bg-white/10 border-white/30 scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl mb-3"
                  >
                    <IconComp className="text-neutral-400 group-hover:text-white transition-colors duration-300" />
                  </motion.div>

                  {/* Name */}
                  <span className="text-sm text-neutral-400 group-hover:text-white transition-colors text-center">
                    {skill.name}
                  </span>

                  {/* Level Indicator */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scaleX: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isHovered ? `${skill.level}%` : 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="h-full bg-white"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Category Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2 text-xs tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  activeFilter === category
                    ? 'bg-white text-black font-medium'
                    : 'text-neutral-500 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
