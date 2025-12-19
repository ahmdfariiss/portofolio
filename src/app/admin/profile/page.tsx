'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiSave, HiCheck, HiPhotograph, HiX } from 'react-icons/hi';
import { useSupabaseProfile } from '@/hooks/useSupabase';
import type { DBProfile } from '@/lib/supabase';
import Image from 'next/image';

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useSupabaseProfile();
  const [formData, setFormData] = useState<DBProfile | null>(null);
  const [roleInput, setRoleInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile && !initialized) {
      setFormData(profile);
      setInitialized(true);
    }
  }, [profile, initialized]);

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('social.')) {
      const key = name.replace('social.', '');
      setFormData({
        ...formData,
        social: { ...formData.social, [key]: value },
      });
    } else if (name === 'bio') {
      setFormData({
        ...formData,
        bio: value.split('\n').filter((line) => line.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addRole = () => {
    if (roleInput.trim() && !formData.role.includes(roleInput.trim())) {
      setFormData({
        ...formData,
        role: [...formData.role, roleInput.trim()],
      });
      setRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setFormData({
      ...formData,
      role: formData.role.filter((r) => r !== role),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal menyimpan profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
          <HiUser className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-neutral-500">Kelola informasi personal Anda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Foto Profile
          </h2>
          <div className="flex items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-neutral-800 border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <HiUser className="w-12 h-12 text-neutral-600" />
                )}
              </div>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <HiX size={14} />
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-xl cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                <HiPhotograph size={20} />
                Upload Foto
              </label>
              <p className="text-sm text-neutral-500 mt-2">
                Format: JPG, PNG, GIF. Maksimal 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Informasi Dasar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Universitas
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Tahun
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          {/* Roles */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Role (Typing Animation)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addRole())
                }
                placeholder="Tambah role..."
                className="flex-1 px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="button"
                onClick={addRole}
                className="px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.role.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-sm text-white"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="text-neutral-500 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Bio (pisahkan paragraf dengan enter)
            </label>
            <textarea
              name="bio"
              value={formData.bio.join('\n')}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                GitHub
              </label>
              <input
                type="url"
                name="social.github"
                value={formData.social.github}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="social.linkedin"
                value={formData.social.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            <HiSave size={20} />
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </motion.button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-400"
            >
              <HiCheck size={20} />
              Tersimpan!
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
