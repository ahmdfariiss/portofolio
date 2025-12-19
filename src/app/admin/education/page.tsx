'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiAcademicCap,
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
} from 'react-icons/hi';
import { useSupabaseEducation } from '@/hooks/useSupabase';
import type { DBEducation } from '@/lib/supabase';

type FormData = Omit<DBEducation, 'id' | 'created_at'>;

const defaultForm: FormData = {
  degree: '',
  institution: '',
  period: '',
  description: '',
  achievements: [],
  order_index: 0,
};

export default function EducationPage() {
  const { education, addEducation, updateEducation, deleteEducation, loading } =
    useSupabaseEducation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [achievementInput, setAchievementInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: (typeof education)[0]) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
      achievements: edu.achievements,
      order_index: edu.order_index || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateEducation(editingId, formData);
      } else {
        await addEducation(formData);
      }
      setIsModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Gagal menyimpan pendidikan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pendidikan ini?')) {
      try {
        await deleteEducation(id);
      } catch (error) {
        console.error('Error deleting education:', error);
        alert('Gagal menghapus pendidikan');
      }
    }
  };

  const addAchievement = () => {
    if (
      achievementInput.trim() &&
      !formData.achievements.includes(achievementInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievement: string) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a !== achievement),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Education</h1>
            <p className="text-neutral-500">
              {education.length} total riwayat pendidikan
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <HiPlus size={20} />
          Tambah Pendidikan
        </button>
      </div>

      {/* Saved Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg z-50"
          >
            <HiCheck size={20} />
            Tersimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <motion.div
            key={edu.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                <HiAcademicCap size={24} className="text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <p className="text-neutral-400">{edu.institution}</p>
                    <p className="text-neutral-500 text-sm">{edu.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(edu)}
                      className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                      <HiPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm mt-2">
                  {edu.description}
                </p>
                {edu.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {edu.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="text-xs px-2 py-1 bg-green-500/10 rounded text-green-400"
                      >
                        🏆 {achievement}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
                >
                  <HiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Gelar / Program Studi
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        degree: e.target.value,
                      }))
                    }
                    required
                    placeholder="S1 Ilmu Komputer"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Institusi
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        institution: e.target.value,
                      }))
                    }
                    required
                    placeholder="Universitas Indonesia"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Periode
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        period: e.target.value,
                      }))
                    }
                    required
                    placeholder="2022 - Present"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows={3}
                    placeholder="Deskripsi singkat tentang pendidikan..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Pencapaian (Opsional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), addAchievement())
                      }
                      placeholder="IPK 3.9, Cum Laude, etc..."
                      className="flex-1 px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-sm text-green-400"
                      >
                        🏆 {achievement}
                        <button
                          type="button"
                          onClick={() => removeAchievement(achievement)}
                          className="text-green-300 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting
                      ? 'Menyimpan...'
                      : editingId
                      ? 'Update'
                      : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
