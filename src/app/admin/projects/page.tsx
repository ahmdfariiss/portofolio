'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCollection,
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
  HiStar,
  HiPhotograph,
} from 'react-icons/hi';
import { useCMSStore } from '@/store/cms-store';
import type { CMSProject } from '@/types/cms';
import Image from 'next/image';

type FormData = Omit<CMSProject, 'id' | 'createdAt'>;

const defaultForm: FormData = {
  title: '',
  description: '',
  fullDescription: '',
  image: '',
  gallery: [],
  category: 'Web',
  tech: [],
  features: [],
  challenges: '',
  solutions: '',
  github: '',
  demo: '',
  featured: false,
  size: 'small',
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useCMSStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [techInput, setTechInput] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (project: CMSProject) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription || '',
      image: project.image || '',
      gallery: project.gallery || [],
      category: project.category,
      tech: project.tech,
      features: project.features || [],
      challenges: project.challenges || '',
      solutions: project.solutions || '',
      github: project.github,
      demo: project.demo,
      featured: project.featured,
      size: project.size,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
    } else {
      addProject(formData);
    }
    setIsModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      deleteProject(id);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tech),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <HiCollection className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-neutral-500">{projects.length} total projects</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <HiPlus size={20} />
          Tambah Project
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors"
          >
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full h-32">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <HiStar className="text-yellow-400" size={16} />
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.category === 'Web'
                        ? 'bg-blue-500/20 text-blue-400'
                        : project.category === 'IoT'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {project.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
              <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 bg-neutral-800 rounded text-neutral-400"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="text-xs px-2 py-1 bg-neutral-800 rounded text-neutral-400">
                    +{project.tech.length - 4}
                  </span>
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
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Project' : 'Tambah Project'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
                >
                  <HiX size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Project Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-24 rounded-xl bg-neutral-800 border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Project"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <HiPhotograph className="w-8 h-8 text-neutral-600" />
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="project-image"
                      />
                      <label
                        htmlFor="project-image"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                      >
                        <HiPhotograph size={16} />
                        Upload
                      </label>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="ml-2 px-3 py-2 text-red-400 text-sm hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                      <p className="text-xs text-neutral-500 mt-1">Max 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Title
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
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Description (Singkat)
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
                    rows={2}
                    placeholder="Deskripsi singkat untuk card..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Full Description (Detail Page)
                  </label>
                  <textarea
                    value={formData.fullDescription || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullDescription: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Deskripsi lengkap untuk halaman detail project..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as 'Web' | 'IoT' | 'Other',
                        }))
                      }
                      className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="Web">Web</option>
                      <option value="IoT">IoT</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Size (Bento Grid)
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          size: e.target.value as 'small' | 'medium' | 'large',
                        }))
                      }
                      className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addTech())
                      }
                      placeholder="React, Next.js, etc..."
                      className="flex-1 px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-4 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-sm text-white"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
                          className="text-neutral-500 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.demo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          demo: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded bg-black border-neutral-800 text-white focus:ring-white/20"
                  />
                  <span className="text-white">Featured Project</span>
                </label>

                {/* Additional Detail Fields */}
                <div className="border-t border-neutral-800 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-4">
                    Detail Page (Opsional)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Fitur Utama (satu per baris)
                      </label>
                      <textarea
                        value={formData.features?.join('\n') || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            features: e.target.value
                              .split('\n')
                              .filter((f) => f.trim()),
                          }))
                        }
                        rows={3}
                        placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3"
                        className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                          Tantangan
                        </label>
                        <textarea
                          value={formData.challenges || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              challenges: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Tantangan yang dihadapi..."
                          className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                          Solusi
                        </label>
                        <textarea
                          value={formData.solutions || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              solutions: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Solusi yang diterapkan..."
                          className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {editingId ? 'Update' : 'Simpan'}
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
