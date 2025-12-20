'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiLightningBolt,
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
} from 'react-icons/hi';
import { useSupabaseSkills } from '@/hooks/useSupabase';
import type { DBSkill } from '@/lib/supabase';

type FormData = Omit<DBSkill, 'id' | 'created_at'>;

const defaultForm: FormData = {
  name: '',
  level: 80,
  category: 'frontend',
  icon: 'SiReact',
  order_index: 0,
};

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  backend: 'bg-green-500/20 text-green-400 border-green-500/30',
  iot: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  tools: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const iconOptions = [
  { value: 'SiReact', label: 'React' },
  { value: 'SiNextdotjs', label: 'Next.js' },
  { value: 'SiTypescript', label: 'TypeScript' },
  { value: 'SiJavascript', label: 'JavaScript' },
  { value: 'SiTailwindcss', label: 'Tailwind CSS' },
  { value: 'SiHtml5', label: 'HTML5' },
  { value: 'SiCss3', label: 'CSS3' },
  { value: 'SiNodedotjs', label: 'Node.js' },
  { value: 'SiExpress', label: 'Express' },
  { value: 'SiNestjs', label: 'NestJS' },
  { value: 'SiPhp', label: 'PHP' },
  { value: 'SiLaravel', label: 'Laravel' },
  { value: 'SiPython', label: 'Python' },
  { value: 'SiFlask', label: 'Flask' },
  { value: 'SiDjango', label: 'Django' },
  { value: 'SiMongodb', label: 'MongoDB' },
  { value: 'SiPostgresql', label: 'PostgreSQL' },
  { value: 'SiMysql', label: 'MySQL' },
  { value: 'SiSupabase', label: 'Supabase' },
  { value: 'SiFirebase', label: 'Firebase' },
  { value: 'SiRedis', label: 'Redis' },
  { value: 'SiArduino', label: 'Arduino' },
  { value: 'SiRaspberrypi', label: 'Raspberry Pi' },
  { value: 'FaMicrochip', label: 'ESP32/Microchip' },
  { value: 'SiDocker', label: 'Docker' },
  { value: 'SiKubernetes', label: 'Kubernetes' },
  { value: 'SiGit', label: 'Git' },
  { value: 'SiGithub', label: 'GitHub' },
  { value: 'SiVercel', label: 'Vercel' },
  { value: 'SiNetlify', label: 'Netlify' },
  { value: 'SiLinux', label: 'Linux' },
  { value: 'SiFigma', label: 'Figma' },
  { value: 'SiVuedotjs', label: 'Vue.js' },
  { value: 'SiAngular', label: 'Angular' },
  { value: 'SiSvelte', label: 'Svelte' },
  { value: 'SiGraphql', label: 'GraphQL' },
  { value: 'SiPrisma', label: 'Prisma' },
];

export default function SkillsPage() {
  const { skills, addSkill, updateSkill, deleteSkill, loading } =
    useSupabaseSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSkills =
    filter === 'all' ? skills : skills.filter((s) => s.category === filter);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: (typeof skills)[0]) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon,
      order_index: skill.order_index || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateSkill(editingId, formData);
      } else {
        await addSkill(formData);
      }
      setIsModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Gagal menyimpan skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus skill ini?')) {
      try {
        await deleteSkill(id);
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Gagal menghapus skill');
      }
    }
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
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <HiLightningBolt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Skills</h1>
            <p className="text-neutral-500">{skills.length} total skills</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <HiPlus size={20} />
          Tambah Skill
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'frontend', 'backend', 'iot', 'tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <motion.div
            key={skill.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    skill.category === 'frontend'
                      ? 'bg-blue-500/20'
                      : skill.category === 'backend'
                      ? 'bg-green-500/20'
                      : skill.category === 'iot'
                      ? 'bg-orange-500/20'
                      : 'bg-purple-500/20'
                  }`}
                >
                  <span className="text-lg">
                    {skill.icon === 'SiReact'
                      ? '⚛️'
                      : skill.icon === 'SiNextdotjs'
                      ? '▲'
                      : skill.icon === 'SiTypescript'
                      ? 'TS'
                      : skill.icon === 'SiJavascript'
                      ? 'JS'
                      : skill.icon === 'SiPython'
                      ? '🐍'
                      : skill.icon === 'SiArduino'
                      ? '🔌'
                      : '💻'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      categoryColors[skill.category]
                    }`}
                  >
                    {skill.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                  <HiPencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Level</span>
                <span className="text-white font-medium">{skill.level}%</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full rounded-full ${
                    skill.category === 'frontend'
                      ? 'bg-blue-500'
                      : skill.category === 'backend'
                      ? 'bg-green-500'
                      : skill.category === 'iot'
                      ? 'bg-orange-500'
                      : 'bg-purple-500'
                  }`}
                />
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
              className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Skill' : 'Tambah Skill'}
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as
                          | 'frontend'
                          | 'backend'
                          | 'iot'
                          | 'tools',
                      }))
                    }
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="iot">IoT</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Level: {formData.level}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
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
