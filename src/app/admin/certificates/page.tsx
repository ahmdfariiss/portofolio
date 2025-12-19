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
  HiExternalLink,
  HiPhotograph,
} from 'react-icons/hi';
import { useSupabaseCertificates } from '@/hooks/useSupabase';
import type { DBCertificate } from '@/lib/supabase';
import Image from 'next/image';

type FormData = Omit<DBCertificate, 'id' | 'created_at'>;

const defaultForm: FormData = {
  name: '',
  issuer: '',
  image: '',
  date: new Date().getFullYear().toString(),
  credential_url: '',
  order_index: 0,
};

export default function CertificatesPage() {
  const {
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    loading,
  } = useSupabaseCertificates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: (typeof certificates)[0]) => {
    setEditingId(cert.id);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      image: cert.image || '',
      date: cert.date,
      credential_url: cert.credential_url || '',
      order_index: cert.order_index || 0,
    });
    setImagePreview(cert.image || '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateCertificate(editingId, formData);
      } else {
        await addCertificate(formData);
      }
      setIsModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Gagal menyimpan sertifikat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
      try {
        await deleteCertificate(id);
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Gagal menghapus sertifikat');
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
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sertifikat</h1>
            <p className="text-neutral-500">
              {certificates.length} total sertifikat
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
        >
          <HiPlus size={20} />
          Tambah Sertifikat
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

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group"
          >
            {/* Certificate Image */}
            <div className="relative h-40 bg-neutral-800">
              {cert.image ? (
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <HiAcademicCap className="w-12 h-12 text-neutral-700" />
                </div>
              )}
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEditModal(cert)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <HiPencil className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
                >
                  <HiTrash className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-1 truncate">
                {cert.name}
              </h3>
              <p className="text-neutral-500 text-sm mb-2">{cert.issuer}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-mono">
                  {cert.date}
                </span>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <HiExternalLink size={12} />
                    Verify
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <HiAcademicCap className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-500">Belum ada sertifikat</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-white hover:text-neutral-300 transition-colors"
            >
              + Tambah sertifikat pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Gambar Sertifikat
                    </label>
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData({ ...formData, image: '' });
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                          >
                            <HiX className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                          <HiPhotograph className="w-10 h-10 text-neutral-600 mb-2" />
                          <span className="text-sm text-neutral-500">
                            Klik untuk upload gambar
                          </span>
                          <span className="text-xs text-neutral-600 mt-1">
                            Maks 2MB
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Nama Sertifikat *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                      placeholder="AWS Cloud Practitioner"
                    />
                  </div>

                  {/* Issuer */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Instansi Penerbit *
                    </label>
                    <input
                      type="text"
                      value={formData.issuer}
                      onChange={(e) =>
                        setFormData({ ...formData, issuer: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                      placeholder="Amazon Web Services"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Tahun Diterbitkan *
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                      placeholder="2024"
                    />
                  </div>

                  {/* Credential URL */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Link Verifikasi (Opsional)
                    </label>
                    <input
                      type="url"
                      value={formData.credential_url || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credential_url: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                      placeholder="https://credential.net/..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting
                        ? 'Menyimpan...'
                        : editingId
                        ? 'Update'
                        : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
