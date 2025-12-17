'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  FaCertificate,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from 'react-icons/fa';
import { useCMSCertificates } from '@/hooks/useCMSData';
import Image from 'next/image';
import Link from 'next/link';

export default function Certificates() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const certificates = useCMSCertificates();

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  }, [certificates.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? certificates.length - 1 : prev - 1
    );
  }, [certificates.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || certificates.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, certificates.length, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (certificates.length === 0) {
    return null;
  }

  const currentCert = certificates[currentIndex];

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section id="certificates" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4"
              >
                Achievements
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                Certificates
              </motion.h2>
            </div>

            {/* See All Link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/certificates"
                className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <span>See all certificates</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Main Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Carousel Container */}
            <div className="relative h-[400px] md:h-[450px] overflow-hidden rounded-3xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full bg-neutral-900/80 border border-white/10 rounded-3xl overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {currentCert.image ? (
                        <Image
                          src={currentCert.image}
                          alt={currentCert.name}
                          fill
                          className="object-cover opacity-30"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-neutral-900" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col md:flex-row items-center justify-center gap-8 p-8 md:p-12">
                      {/* Certificate Image */}
                      <div className="relative w-full md:w-1/2 h-48 md:h-80 rounded-2xl overflow-hidden border border-white/10 bg-neutral-800/50">
                        {currentCert.image ? (
                          <Image
                            src={currentCert.image}
                            alt={currentCert.name}
                            fill
                            className="object-contain p-4"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaCertificate className="w-24 h-24 text-neutral-700" />
                          </div>
                        )}
                      </div>

                      {/* Certificate Info */}
                      <div className="w-full md:w-1/2 text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-neutral-400 font-mono mb-4">
                          {currentCert.date}
                        </span>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                          {currentCert.name}
                        </h3>
                        <p className="text-lg text-neutral-400">
                          {currentCert.issuer}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <FaChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <FaChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {certificates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar (auto-play indicator) */}
            {isAutoPlaying && certificates.length > 1 && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    key={currentIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white/50"
                  />
                </div>
              </div>
            )}

            {/* Counter */}
            <div className="text-center mt-4">
              <span className="text-sm text-neutral-500">
                <span className="text-white font-medium">
                  {currentIndex + 1}
                </span>
                {' / '}
                {certificates.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
