'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  github?: string;
  demo?: string;
  tech?: string[];
}

// Default projects as fallback
const defaultProjects: ProjectData[] = [
  {
    id: 'proj1',
    title: 'Portfolio Website',
    description:
      'A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion.',
    image: '',
    category: 'Web',
    featured: true,
    github: 'https://github.com',
    demo: 'https://example.com',
    tech: ['Next.js', 'Tailwind', 'Framer Motion'],
  },
  {
    id: 'proj2',
    title: 'IoT Smart Home',
    description: 'Smart home automation system using ESP32 and MQTT protocol.',
    image: '',
    category: 'IoT',
    featured: false,
    github: 'https://github.com',
    tech: ['Arduino', 'ESP32', 'MQTT'],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>(defaultProjects);

  // Fetch from Supabase in background
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('order_index');

        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Projects fetch error:', error);
        // Keep default data on error
      }
    };

    fetchProjects();
  }, []);

  const filters = ['All', 'Web', 'IoT'];
  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-32 relative bg-neutral-950/50">
      {/* LAYOUT: Bento Grid with Varying Card Sizes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref}>
          {/* Header - Center with Filters Below */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4"
            >
              Selected Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 }}
              className="text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              A collection of my recent work spanning web development and IoT
              projects. Each project represents a unique challenge and learning
              experience.
            </motion.p>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 p-1 bg-white/5 rounded-full"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 text-sm rounded-full transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Bento Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => {
              const isHovered = hoveredProject === index;

              return (
                <motion.div
                  key={project.id || project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredProject(index)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group relative"
                >
                  <Link href={project.id ? `/project/${project.id}` : '#'}>
                    <motion.div
                      whileHover={{ scale: 0.98 }}
                      className="h-full bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer"
                    >
                      {/* Project Image - Large & Prominent */}
                      <div className="relative w-full aspect-video bg-neutral-800 overflow-hidden">
                        {project.image ? (
                          <>
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl text-neutral-700">
                              📁
                            </span>
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-xs text-white/80 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full font-mono uppercase tracking-wider">
                            {project.category}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="text-xs text-black bg-white px-3 py-1 rounded-full font-medium">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-neutral-200 transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {project.tech &&
                            project.tech
                              .slice(0, 4)
                              .map((techName, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded"
                                >
                                  {techName}
                                </span>
                              ))}
                          {project.tech && project.tech.length > 4 && (
                            <span className="text-xs text-neutral-600">
                              +{project.tech.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Links - Show on Hover */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 10,
                          }}
                          className="flex items-center gap-4 pt-3 border-t border-white/5"
                        >
                          {project.github && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                if (project.github)
                                  window.open(project.github, '_blank');
                              }}
                              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                              <FaGithub size={14} />
                              Code
                            </span>
                          )}
                          {project.demo && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                if (project.demo)
                                  window.open(project.demo, '_blank');
                              }}
                              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                              <FaExternalLinkAlt size={12} />
                              Demo
                            </span>
                          )}
                          <span className="ml-auto text-sm text-neutral-500">
                            Details →
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="https://github.com/ahmdfariiss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors"
            >
              <FaGithub size={16} />
              View all projects on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
