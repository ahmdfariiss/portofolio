'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCog, HiSave, HiCheck, HiTrash, HiPlus } from 'react-icons/hi';
import { supabase } from '@/lib/supabase';

interface HighlightData {
  id: string;
  icon: string;
  title: string;
  description: string;
  order_index: number;
}

interface StatData {
  id: string;
  value: string;
  label: string;
  order_index: number;
}

export default function SettingsPage() {
  const [highlightsData, setHighlightsData] = useState<HighlightData[]>([]);
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch highlights
        const { data: highlights } = await supabase
          .from('highlights')
          .select('*')
          .order('order_index');

        if (highlights) {
          setHighlightsData(highlights);
        }

        // Fetch stats
        const { data: stats } = await supabase
          .from('stats')
          .select('*')
          .order('order_index');

        if (stats) {
          setStatsData(stats);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Save highlights - delete all and insert fresh
      await supabase.from('highlights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (highlightsData.length > 0) {
        const highlightsToInsert = highlightsData.map((h, index) => ({
          icon: h.icon,
          title: h.title,
          description: h.description,
          order_index: index,
        }));
        await supabase.from('highlights').insert(highlightsToInsert);
      }

      // Save stats - delete all and insert fresh
      await supabase.from('stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (statsData.length > 0) {
        const statsToInsert = statsData.map((s, index) => ({
          value: s.value,
          label: s.label,
          order_index: index,
        }));
        await supabase.from('stats').insert(statsToInsert);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addHighlight = () => {
    setHighlightsData([
      ...highlightsData,
      {
        id: Math.random().toString(36).substr(2, 9),
        icon: 'FaCode',
        title: '',
        description: '',
        order_index: highlightsData.length,
      },
    ]);
  };

  const updateHighlight = (id: string, field: string, value: string) => {
    setHighlightsData(
      highlightsData.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const removeHighlight = (id: string) => {
    setHighlightsData(highlightsData.filter((h) => h.id !== id));
  };

  const addStat = () => {
    setStatsData([
      ...statsData,
      {
        id: Math.random().toString(36).substr(2, 9),
        value: '',
        label: '',
        order_index: statsData.length,
      },
    ]);
  };

  const updateStat = (id: string, field: string, value: string) => {
    setStatsData(
      statsData.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeStat = (id: string) => {
    setStatsData(statsData.filter((s) => s.id !== id));
  };

  const iconOptions = [
    { value: 'FaCode', label: 'Code' },
    { value: 'FaRocket', label: 'Rocket' },
    { value: 'FaMicrochip', label: 'Microchip' },
    { value: 'FaLightbulb', label: 'Lightbulb' },
    { value: 'FaGraduationCap', label: 'Graduation Cap' },
    { value: 'FaBriefcase', label: 'Briefcase' },
    { value: 'FaHeart', label: 'Heart' },
    { value: 'FaStar', label: 'Star' },
    { value: 'FaLaptopCode', label: 'Laptop Code' },
    { value: 'FaServer', label: 'Server' },
    { value: 'FaDatabase', label: 'Database' },
    { value: 'FaMobile', label: 'Mobile' },
  ];

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
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-700 rounded-xl flex items-center justify-center">
          <HiCog className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-neutral-500">
            Konfigurasi highlights dan stats untuk about section
          </p>
        </div>
      </div>

      {/* About Highlights */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">About Highlights</h2>
          <button
            onClick={addHighlight}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 transition-colors"
          >
            <HiPlus size={16} />
            Add
          </button>
        </div>
        <div className="space-y-4">
          {highlightsData.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">
              Belum ada highlights. Klik &quot;Add&quot; untuk menambahkan.
            </p>
          ) : (
            highlightsData.map((highlight, index) => (
              <div
                key={highlight.id}
                className="flex items-start gap-4 p-4 bg-black rounded-xl"
              >
                <span className="text-neutral-500 text-sm mt-3">{index + 1}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={highlight.icon}
                    onChange={(e) =>
                      updateHighlight(highlight.id, 'icon', e.target.value)
                    }
                    className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) =>
                      updateHighlight(highlight.id, 'title', e.target.value)
                    }
                    placeholder="Title"
                    className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="text"
                    value={highlight.description}
                    onChange={(e) =>
                      updateHighlight(highlight.id, 'description', e.target.value)
                    }
                    placeholder="Description"
                    className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <button
                  onClick={() => removeHighlight(highlight.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                >
                  <HiTrash size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* About Stats */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">About Stats</h2>
          <button
            onClick={addStat}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 transition-colors"
          >
            <HiPlus size={16} />
            Add
          </button>
        </div>
        <p className="text-neutral-500 text-sm mb-4">
          Stats akan ditampilkan di section About (contoh: 10+ Projects, 2+ Years Experience, 3.8 GPA)
        </p>
        <div className="space-y-4">
          {statsData.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">
              Belum ada stats. Klik &quot;Add&quot; untuk menambahkan.
            </p>
          ) : (
            statsData.map((stat, index) => (
              <div
                key={stat.id}
                className="flex items-center gap-4 p-4 bg-black rounded-xl"
              >
                <span className="text-neutral-500 text-sm">{index + 1}</span>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                    placeholder="Value (e.g., 10+)"
                    className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                    placeholder="Label (e.g., Projects)"
                    className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <button
                  onClick={() => removeStat(stat.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                >
                  <HiTrash size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={handleSave}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          <HiSave size={20} />
          {isSubmitting ? 'Menyimpan...' : 'Simpan Semua'}
        </motion.button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-green-400"
          >
            <HiCheck size={20} />
            Tersimpan ke Database!
          </motion.span>
        )}
      </div>
    </div>
  );
}
