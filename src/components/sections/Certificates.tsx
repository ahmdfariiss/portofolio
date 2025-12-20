'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  FaCertificate,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface CertificateData {
  id: string;
  name: string;
  issuer: string;
  image: string;
  date: string;
  credential_url: string;
}

// Default certificates
const defaultCertificates: CertificateData[] = [
  {
    id: 'cert1',
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    image: '',
    date: '2024',
    credential_url: 'https://aws.amazon.com/verification',
  },
  {
    id: 'cert2',
    name: 'React Developer Certificate',
    issuer: 'Meta',
    image: '',
    date: '2024',
    credential_url: 'https://coursera.org/verify',
  },
  {
    id: 'cert3',
    name: 'IoT Fundamentals',
    issuer: 'Cisco Networking Academy',
    image: '',
    date: '2023',
    credential_url: '',
  },
];

export default function Certificates() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [certificates, setCertificates] =
    useState<CertificateData[]>(defaultCertificates);

  // Fetch from Supabase
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await supabase
          .from('certificates')
          .select('*')
          .order('order_index');

        if (data && data.length > 0) {
          setCertificates(data);
        }
      } catch (error) {
        console.error('Certificates fetch error:', error);
      }
    };

    fetchCertificates();
  }, []);

  const nextSlide = useCallback(() => {
    if (certificates.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  }, [certificates.length]);

  const prevSlide = useCallback(() => {
    if (certificates.length <= 1) return;
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
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, certificates.length, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const currentCert = certificates[currentIndex] || certificates[0];

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
                transition={{ duration: 0.5 }}
                className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4"
              >
                Achievements
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                Certificates &<br />
                <span className="text-neutral-600">Credentials</span>
              </motion.h2>
            </div>

            {/* Navigation Arrows */}
            {certificates.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="Previous certificate"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="Next certificate"
                >
                  <FaChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </div>

          {/* Certificate Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Certificate Image */}
              <div className="relative h-80 md:h-96 overflow-hidden rounded-3xl bg-neutral-900 border border-white/10">
                <AnimatePresence initial={false} custom={direction} mode="wait">
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
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {currentCert?.image ? (
                      <Image
                        src={currentCert.image}
                        alt={currentCert.name}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-600">
                        <FaCertificate size={80} />
                        <span className="mt-4 text-sm">
                          Certificate Preview
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Certificate Info */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
                      {currentCert?.issuer}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                      {currentCert?.name}
                    </h3>
                    <p className="text-neutral-400 mb-6">
                      Issued: {currentCert?.date}
                    </p>

                    {currentCert?.credential_url && (
                      <a
                        href={currentCert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                      >
                        <span>View Credential</span>
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                {certificates.length > 1 && (
                  <div className="flex gap-2 pt-8">
                    {certificates.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'w-8 bg-white'
                            : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to certificate ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Certificate Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="text-4xl font-bold text-white">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-px bg-white/30" />
              <span className="text-sm">
                {String(certificates.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-8"
          >
            <a
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full text-neutral-400 hover:text-white hover:border-white/40 transition-all duration-300"
            >
              <span>View All Certificates</span>
              <FaExternalLinkAlt size={12} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
