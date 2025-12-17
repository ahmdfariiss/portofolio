'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useCMSProjectsWithId } from '@/hooks/useCMSData';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const projects = useCMSProjectsWithId();

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
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
            >
              Projects
            </motion.h2>

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]"
          >
            {filteredProjects.map((project, index) => {
              const isHovered = hoveredProject === index;
              const gridClass =
                project.size === 'large'
                  ? 'md:col-span-2 md:row-span-2'
                  : project.size === 'medium'
                  ? 'md:row-span-2'
                  : '';

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
                  className={`group relative ${gridClass}`}
                >
                  <Link href={project.id ? `/project/${project.id}` : '#'}>
                    <motion.div
                      whileHover={{ scale: 0.98 }}
                      className="h-full bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer"
                    >
                      {/* Project Image - Clear Display */}
                      {project.image && (
                        <div className="absolute top-4 right-4 w-40 h-24 md:w-56 md:h-32 lg:w-64 lg:h-36 z-10 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-white">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Subtle Background Gradient */}
                      {project.image && (
                        <div className="absolute inset-0 z-0">
                          <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-900 to-neutral-800/80" />
                        </div>
                      )}

                      {/* Background Pattern (when no image) */}
                      {!project.image && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
                        </div>
                      )}

                      {/* Top Section */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-xs text-neutral-600 font-mono uppercase tracking-wider">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="text-[10px] text-black bg-white px-2 py-1 rounded-full font-medium">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl md:text-2xl font-medium text-white mb-2 group-hover:text-neutral-200 transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-neutral-500 text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="relative z-10">
                        {/* Tech Icons */}
                        <div className="flex items-center gap-3 mb-4">
                          {project.tech.map((Icon, techIndex) => {
                            // Check if Icon is a valid React component
                            if (typeof Icon === 'function') {
                              return (
                                <Icon
                                  key={techIndex}
                                  size={16}
                                  className="text-neutral-600 group-hover:text-neutral-400 transition-colors"
                                />
                              );
                            }
                            return null;
                          })}
                        </div>

                        {/* Links - Show on Hover */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 10,
                          }}
                          className="flex items-center gap-4"
                        >
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(project.github, '_blank');
                            }}
                            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                          >
                            <FaGithub size={14} />
                            Code
                          </span>
                          {project.demo && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(project.demo, '_blank');
                              }}
                              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                              <FaExternalLinkAlt size={12} />
                              Demo
                            </span>
                          )}
                          <span className="text-sm text-neutral-500">
                            Click for details →
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
              href="https://github.com"
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
