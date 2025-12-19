'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useSupabaseProject } from '@/hooks/useSupabase';
import Image from 'next/image';
import Link from 'next/link';

// Hook to check if component is mounted (client-side)
const useIsMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { project, loading } = useSupabaseProject(projectId);
  const [activeImage, setActiveImage] = useState(0);
  const isMounted = useIsMounted();

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl text-white">Project tidak ditemukan</h1>
        <Link
          href="/#projects"
          className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          Kembali ke Projects
        </Link>
      </div>
    );
  }

  const allImages = [project.image, ...(project.gallery || [])].filter(
    (img): img is string => img !== null && img !== undefined && img !== ''
  );

  const nextImage = () => {
    if (allImages.length > 0) {
      setActiveImage((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 0) {
      setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-xs text-neutral-600 font-mono uppercase tracking-wider px-3 py-1 bg-white/5 rounded-full">
              {project.category}
            </span>
            {project.featured && (
              <span className="text-xs text-black bg-white px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl">
            {project.description}
          </p>
        </motion.div>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900/50 border border-white/5">
              <Image
                src={allImages[activeImage]}
                alt={project.title}
                fill
                className="object-cover"
              />

              {/* Gallery Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronLeft className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronRight className="text-white" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeImage ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      i === activeImage
                        ? 'border-white'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Full Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Tentang Project
              </h2>
              <div className="text-neutral-400 leading-relaxed whitespace-pre-line">
                {project.full_description || project.description}
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Fitur Utama
                </h2>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-neutral-400"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges & Solutions */}
            {(project.challenges || project.solutions) && (
              <div className="grid md:grid-cols-2 gap-6">
                {project.challenges && (
                  <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Tantangan
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {project.challenges}
                    </p>
                  </div>
                )}
                {project.solutions && (
                  <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Solusi
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {project.solutions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Links */}
            <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <div className="space-y-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <FaGithub size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Source Code</div>
                      <div className="text-xs text-neutral-600">
                        View on GitHub
                      </div>
                    </div>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <FaExternalLinkAlt size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Live Demo</div>
                      <div className="text-xs text-neutral-600">
                        View website
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((techName: string, i: number) => {
                  const Icon = project.techIcons[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-neutral-400"
                    >
                      {Icon && <Icon />}
                      <span>{techName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tanggal</h3>
              <p className="text-neutral-400 text-sm">
                {project.created_at
                  ? new Date(project.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Tidak tersedia'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
