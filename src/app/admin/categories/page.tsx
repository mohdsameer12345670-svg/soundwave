'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DataService } from '@/lib/data/store';
import { Category } from '@/types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const cats = await DataService.getAllCategoriesAdmin();
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      is_active: cat.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ text: 'Category name is required.', type: 'error' });
      return;
    }

    const slug =
      formData.slug.trim() ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      await DataService.saveCategory({
        id: editingCategory?.id,
        name: formData.name,
        slug,
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
      });

      setFeedback({
        text: `Category "${formData.name}" saved successfully!`,
        type: 'success',
      });
      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      setFeedback({ text: 'Error saving category.', type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const res = await DataService.deleteCategory(id);
    if (res.success) {
      setFeedback({ text: `Category "${name}" deleted.`, type: 'success' });
      await loadCategories();
    } else {
      setFeedback({ text: res.error || 'Cannot delete category.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sonic-850">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
         Taxonomy & Navigation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-sonic-400 mt-1">
            Manage product classification hierarchies, public slugs, and category cover imagery.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-orange/20 flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-sonic-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-sonic-900 border border-sonic-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-brand-orange/40 transition-all duration-300"
          >
            <div>
              <div className="aspect-[16/9] relative bg-sonic-950 overflow-hidden">
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sonic-900 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      cat.is_active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-sonic-800 text-sonic-400'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Archived'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-brand-orange transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-mono text-sonic-400">/{cat.slug}</p>
                <p className="text-xs text-sonic-300 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description configured.'}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-sonic-850/60 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-sonic-500 font-mono">ID: {cat.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg bg-sonic-800 hover:bg-sonic-750 text-sonic-200 hover:text-white transition-colors"
                  title="Edit Category"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sonic-900 border border-sonic-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sonic-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create Audio Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sonic-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-sonic-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Planar Magnetic Headphones"
                  className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-sonic-300">URL Slug (Optional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. planar-headphones"
                  className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-sonic-300">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-sonic-300">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial overview of this audio product category..."
                  className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sonic-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="accent-brand-orange rounded"
                  />
                  <span>Active in Store Navigation</span>
                </label>
              </div>

              <div className="pt-4 border-t border-sonic-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sonic-800 hover:bg-sonic-750 text-sonic-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
