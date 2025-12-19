'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, 
  SiNodedotjs, SiPython, SiJavascript, SiHtml5,
  SiCss3, SiGit, SiMongodb, SiPostgresql
} from 'react-icons/si';
import { FaCode } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface SkillData {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

// Default skills
const defaultSkills: SkillData[] = [
  { id: '1', name: 'Next.js', level: 80, category: 'frontend', icon: 'SiNextdotjs' },
  { id: '2', name: 'React', level: 85, category: 'frontend', icon: 'SiReact' },
  { id: '3', name: 'TypeScript', level: 75, category: 'frontend', icon: 'SiTypescript' },
  { id: '4', name: 'Tailwind CSS', level: 90, category: 'frontend', icon: 'SiTailwindcss' },
];

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
  FaCode,
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillData[]>(defaultSkills);

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
              Constantly learning and adapting to new technologies to build better solutions.
            </motion.p>
          </div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {skills.map((skill, index) => {
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

          {/* Category Labels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {['Frontend', 'Backend', 'Database', 'Tools'].map((category) => (
              <span
                key={category}
                className="px-4 py-2 text-xs tracking-wider text-neutral-500 border border-white/10 rounded-full"
              >
                {category}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
