'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCertificate, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useCMSCertificates } from '@/hooks/useCMSData';
import Image from 'next/image';
import Link from 'next/link';

export default function CertificatesPage() {
  const certificates = useCMSCertificates();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter certificates based on search
  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group certificates by year
  const groupedByYear = filteredCertificates.reduce((acc, cert) => {
    const year = cert.date;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(cert);
    return acc;
  }, {} as Record<string, typeof certificates>);

  // Sort years descending
  const sortedYears = Object.keys(groupedByYear).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/#certificates"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            All Certificates
          </h1>
          <p className="text-neutral-500 max-w-2xl">
            Koleksi lengkap sertifikasi dan pencapaian yang telah saya raih
            sepanjang perjalanan karir.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </motion.div>

        {/* Certificates by Year */}
        {sortedYears.length > 0 ? (
          sortedYears.map((year, yearIndex) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + yearIndex * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">{year}</h2>
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-neutral-500">
                  {groupedByYear[year].length} certificates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedByYear[year].map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="group"
                  >
                    <div className="relative bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500">
                      {/* Certificate Image */}
                      <div className="relative h-48 bg-neutral-800/50 overflow-hidden">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={cert.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-neutral-800 to-neutral-900">
                            <FaCertificate className="w-16 h-16 text-neutral-700 group-hover:text-neutral-600 transition-colors" />
                          </div>
                        )}
                      </div>

                      {/* Certificate Info */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neutral-200 transition-colors">
                          {cert.name}
                        </h3>
                        <p className="text-neutral-500 text-sm mb-3">
                          {cert.issuer}
                        </p>
                        <span className="text-xs text-neutral-600 font-mono">
                          {cert.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FaCertificate className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-500">
              No certificates found matching your search.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
