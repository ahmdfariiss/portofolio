'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { socialLinks } from '@/constants';
import { useCMSProfile } from '@/hooks/useCMSData';
import emailjs from '@emailjs/browser';

// ==========================================
// EmailJS Configuration
// Ganti dengan credential dari emailjs.com
// ==========================================
const EMAILJS_SERVICE_ID = 'service_mqp7e52'; // Ganti dengan Service ID kamu
const EMAILJS_TEMPLATE_ID = 'template_y1agy9m'; // Ganti dengan Template ID kamu
const EMAILJS_PUBLIC_KEY = 'pxNqsgOTki_vb8cAb'; // Ganti dengan Public Key kamu

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const profile = useCMSProfile();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Kirim email menggunakan EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
          to_email: 'afarisalaziz201@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );

      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError('Gagal mengirim pesan. Silakan coba lagi.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-32 relative">
      {/* LAYOUT: Right-Aligned Minimal with Left Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors text-lg"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                  className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors text-lg"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors text-lg resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 mt-8"
              >
                <span
                  className={`text-lg font-medium transition-colors ${
                    isSubmitted
                      ? 'text-green-500'
                      : error
                      ? 'text-red-500'
                      : 'text-white'
                  }`}
                >
                  {isSubmitting
                    ? 'Sending...'
                    : isSubmitted
                    ? 'Message Sent! ✓'
                    : 'Send Message'}
                </span>
                <motion.div
                  animate={{ x: isSubmitting ? 10 : 0 }}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <FaPaperPlane
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  )}
                </motion.div>
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4">
                Get in Touch
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Let&apos;s Work
                <br />
                <span className="text-neutral-600">Together</span>
              </h2>

              <p className="text-neutral-500 leading-relaxed mb-12 max-w-md">
                Tertarik untuk berkolaborasi atau punya pertanyaan? Jangan ragu
                untuk menghubungi saya.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 text-neutral-400 hover:text-white transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  <FaEnvelope size={16} />
                </div>
                <span className="text-lg">{profile.email}</span>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 text-neutral-500"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <FaMapMarkerAlt size={16} />
                </div>
                <span className="text-lg">{profile.location}</span>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 pt-8"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-300"
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
