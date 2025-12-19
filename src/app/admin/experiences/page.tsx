'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiBriefcase,
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
} from 'react-icons/hi';
import { useSupabaseExperiences } from '@/hooks/useSupabase';
import type { DBExperience } from '@/lib/supabase';

type FormData = Omit<DBExperience, 'id' | 'created_at'>;

const defaultForm: FormData = {
  title: '',
  organization: '',
  period: '',
  description: '',
  skills: [],
  order_index: 0,
};

export default function ExperiencesPage() {
  const {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    loading,
  } = useSupabaseExperiences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: (typeof experiences)[0]) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      organization: exp.organization,
      period: exp.period,
      description: exp.description,
      skills: exp.skills,
      order_index: exp.order_index || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await addExperience(formData);
      }
      setIsModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Gagal menyimpan pengalaman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengalaman ini?')) {
      try {
        await deleteExperience(id);
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Gagal menghapus pengalaman');
      }
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
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
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <HiBriefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Work Experience</h1>
            <p className="text-neutral-500">
              {experiences.length} total pengalaman kerja
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <HiPlus size={20} />
          Tambah Pengalaman
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

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <motion.div
            key={exp.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                <HiBriefcase size={24} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <p className="text-neutral-400">{exp.organization}</p>
                    <p className="text-neutral-500 text-sm">{exp.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                      <HiPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm mt-2">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 bg-neutral-800 rounded text-neutral-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
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
                  {editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
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
                    Posisi / Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                    placeholder="Web Developer Intern"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Perusahaan / Organisasi
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organization: e.target.value,
                      }))
                    }
                    required
                    placeholder="Tech Startup XYZ"
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
                    placeholder="Jan 2024 - Present"
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
                    placeholder="Deskripsikan tugas dan pencapaian..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Skills yang Digunakan
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addSkill())
                      }
                      placeholder="React, Node.js, etc..."
                      className="flex-1 px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-sm text-white"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-neutral-500 hover:text-white"
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
