'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DataService } from '@/lib/data/store';
import { Product, Category, ProductVariant } from '@/types';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Check,
  X,
  Filter,
  DollarSign,
  Tag,
  AlertCircle,
  Images,
  Image as ImageIcon,
  Upload,
  Link2,
} from 'lucide-react';

// Helper to compress and convert images to data URLs for direct upload
const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    sale_price: '',
    main_image: '',
    gallery_images: [] as string[],
    short_description: '',
    description: '',
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    variant_color_name: 'Matte Obsidian',
    variant_color_hex: '#111111',
    variant_stock: '30',
    variant_sku: 'SW-NEW-01',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        DataService.getAllProductsAdmin(),
        DataService.getAllCategoriesAdmin(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load products/categories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      base_price: '',
      sale_price: '',
      main_image: '',
      gallery_images: [],
      short_description: '',
      description: '',
      is_featured: false,
      is_new_arrival: true,
      is_best_seller: false,
      variant_color_name: 'Standard Black',
      variant_color_hex: '#111111',
      variant_stock: '25',
      variant_sku: `SW-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const mainVariant = p.variants?.[0];
    setFormData({
      name: p.name,
      category_id: p.category_id,
      base_price: p.base_price.toString(),
      sale_price: p.sale_price ? p.sale_price.toString() : '',
      main_image: p.main_image,
      gallery_images: p.gallery_images && p.gallery_images.length > 0 ? [...p.gallery_images] : [],
      short_description: p.short_description || '',
      description: p.description || '',
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      is_best_seller: p.is_best_seller,
      variant_color_name: mainVariant?.color_name || 'Standard Black',
      variant_color_hex: mainVariant?.color_hex || '#111111',
      variant_stock: mainVariant?.stock_quantity?.toString() || '20',
      variant_sku: mainVariant?.sku || 'SW-001',
    });
    setIsModalOpen(true);
  };

  const handleMainFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      if (dataUrl) {
        setFormData(prev => ({ ...prev, main_image: dataUrl }));
      }
    } catch (err) {
      console.error('Failed to process cover image:', err);
    }
  };

  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const fileList = Array.from(files);
      const dataUrls = await Promise.all(fileList.map(f => compressImageFile(f)));
      const validUrls = dataUrls.filter(Boolean);
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...validUrls],
      }));
    } catch (err) {
      console.error('Failed to process gallery images:', err);
    }
  };

  const handleAddGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, ''],
    }));
  };

  const handleUpdateGalleryImage = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.gallery_images];
      updated[index] = value;
      return { ...prev, gallery_images: updated };
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.base_price) {
      setFeedbackMessage({ text: 'Please fill in product name and base price.', type: 'error' });
      return;
    }
    if (!formData.main_image.trim()) {
      setFeedbackMessage({ text: 'Please choose or enter a main cover image.', type: 'error' });
      return;
    }

    const baseNum = parseFloat(formData.base_price);
    const saleNum = formData.sale_price ? parseFloat(formData.sale_price) : null;

    if (isNaN(baseNum) || baseNum < 0) {
      setFeedbackMessage({ text: 'Please enter a valid Base / Regular Price (₹0 or higher).', type: 'error' });
      return;
    }

    if (saleNum !== null) {
      if (isNaN(saleNum) || saleNum < 0) {
        setFeedbackMessage({ text: 'Please enter a valid Sale Price.', type: 'error' });
        return;
      }
      if (saleNum >= baseNum) {
        setFeedbackMessage({
          text: `Discount / Sale Price (₹${saleNum}) must be LESS than Regular Price (₹${baseNum}). Agar discount offer nahi hai to Sale Price ko khaali chhod dein.`,
          type: 'error',
        });
        return;
      }
    }

    if (!formData.category_id) {
      setFeedbackMessage({
        text: 'Please select a valid category from Supabase.',
        type: 'error',
      });
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === formData.category_id
    );

    if (!selectedCategory) {
      setFeedbackMessage({
        text: 'Selected category was not found. Please refresh categories.',
        type: 'error',
      });
      return;
    }



    try {
      const variants: Partial<ProductVariant>[] = [
        {
          ...(editingProduct?.variants?.[0]?.id
            ? { id: editingProduct.variants[0].id }
            : {}),
          color_name: formData.variant_color_name,
          color_hex: formData.variant_color_hex,
          sku: formData.variant_sku,
          stock_quantity: parseInt(formData.variant_stock) || 20,
          price: null,
          image_url: formData.main_image,
          is_active: true,
        },
      ];

      await DataService.saveProduct(
        {
          id: editingProduct?.id,
          name: formData.name,
          category_id: formData.category_id,
          base_price: baseNum,
          sale_price: saleNum,
          main_image: formData.main_image,
          gallery_images: formData.gallery_images.map(img => img.trim()).filter(Boolean),
          short_description: formData.short_description,
          description: formData.description,
          is_featured: formData.is_featured,
          is_new_arrival: formData.is_new_arrival,
          is_best_seller: formData.is_best_seller,
        },
        variants
      );

      setFeedbackMessage({
        text: `Product "${formData.name}" successfully ${editingProduct ? 'updated' : 'created'}!`,
        type: 'success',
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Save product error:', err);
      let errMsg = err?.message || 'Error saving product. Please check fields.';
      if (typeof errMsg === 'string') {
        if (errMsg.includes('products_check')) {
          errMsg = 'Sale/Discount price must be LESS than Regular price. (Agar discount nahi hai to Sale Price khaali chhod dein).';
        } else if (errMsg.includes('product_variants_sku_key')) {
          errMsg = `SKU code "${formData.variant_sku}" already exists. Please choose a different SKU.`;
        } else if (errMsg.includes('product_variants_pkey')) {
          errMsg = 'Variant conflict resolved. Please try saving again.';
        }
      }
      setFeedbackMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    await DataService.deleteProduct(id);
    setFeedbackMessage({ text: `Product "${name}" deleted.`, type: 'success' });
    await loadData();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory || p.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sonic-850">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Audio Products & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-sonic-400 mt-1">
            Configure acoustics, price adjustments, promotional tags, and color variants.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-orange/20 flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${feedbackMessage.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
            }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-sonic-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-400" />
          <input
            type="text"
            placeholder="Search audio gear by name or specification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sonic-900 border border-sonic-800 text-white placeholder-sonic-500 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-sonic-900 border border-sonic-800 text-sonic-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-sonic-900 border border-sonic-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-sonic-400">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-sonic-400">
            No audio products match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sonic-950/60 border-b border-sonic-800 text-sonic-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Base Price</th>
                  <th className="py-3.5 px-4 font-semibold">Sale Price</th>
                  <th className="py-3.5 px-4 font-semibold">Variants / Color</th>
                  <th className="py-3.5 px-4 font-semibold">Total Stock</th>
                  <th className="py-3.5 px-4 font-semibold">Tags</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sonic-800/60">
                {filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-sonic-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-sonic-950 border border-sonic-800 overflow-hidden relative shrink-0">
                            <Image
                              src={p.main_image}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-sonic-500 font-mono truncate">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-sonic-300">
                        <span className="px-2 py-0.5 rounded bg-sonic-800 text-[10px] font-semibold text-sonic-200">
                          {p.category?.name || 'Audio System'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-white">
                        ₹{p.base_price.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {p.sale_price ? (
                          <span className="text-emerald-400 font-bold">₹{p.sale_price.toFixed(2)}</span>
                        ) : (
                          <span className="text-sonic-500">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.variants?.map((v, i) => (
                            <span
                              key={i}
                              title={`${v.color_name} (${v.stock_quantity} in stock)`}
                              className="w-4 h-4 rounded-full border border-sonic-700 shadow-sm inline-block"
                              style={{ backgroundColor: v.color_hex }}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${totalStock <= 15
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-400'
                            }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.is_featured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400">
                              Featured
                            </span>
                          )}
                          {p.is_best_seller && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-orange/15 text-brand-orange">
                              Best Seller
                            </span>
                          )}
                          {p.is_new_arrival && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-400">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-sonic-800 hover:bg-sonic-750 text-sonic-200 hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-sonic-900 border border-sonic-800 rounded-2xl max-w-xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pinned Header */}
            <div className="shrink-0 px-5 py-3.5 border-b border-sonic-800 flex items-center justify-between bg-sonic-900">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Audio Product' : 'Add New Audio Product'}
                </h3>
                <p className="text-[11px] text-sonic-400 mt-0.5">
                  Transducer specs, direct device photo upload, and inventory tier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-sonic-400 hover:text-white p-1 rounded-lg hover:bg-sonic-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              {feedbackMessage && (
                <div
                  role="alert"
                  className={`mx-5 mt-3 rounded-xl p-3 text-xs ${feedbackMessage.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                    }`}
                >
                  {feedbackMessage.text}
                </div>
              )}


              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-sonic-300">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange text-xs"
                      placeholder="e.g. Apex Studio Master Headphones"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-sonic-300">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-sonic-300">Regular / Base Price (₹) *</label>
                        <span className="text-[10px] text-sonic-500 font-mono">Original / MRP</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                        className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange text-xs"
                        placeholder="e.g. 2999"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-sonic-300">Sale / Offer Price (₹ Optional)</label>
                        <span className="text-[10px] text-amber-400 font-mono">Must be &lt; Regular</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                        placeholder="Leave empty if no discount"
                        className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange text-xs"
                      />
                    </div>
                  </div>

                  {/* Warning if Sale Price >= Base Price */}
                  {formData.sale_price && formData.base_price && parseFloat(formData.sale_price) >= parseFloat(formData.base_price) && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-1.5">
                      <AlertCircle size={13} className="shrink-0 text-rose-400" />
                      <span>
                        <strong>Note:</strong> Sale Price (₹{formData.sale_price}) must be <strong>LOWER</strong> than Regular Price (₹{formData.base_price}). Discount nahi dena to Sale Price field khaali chhod dein.
                      </span>
                    </div>
                  )}
                </div>

                {/* Main Cover Image (Direct Upload + URL option) */}
                <div className="p-3.5 rounded-xl bg-sonic-950 border border-sonic-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-sonic-200 text-xs flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-brand-orange" /> Main Cover Image *
                    </label>
                    {formData.main_image ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                          <Check size={11} /> Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-sonic-500">No cover image selected</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-sonic-900 border border-dashed border-sonic-700 shrink-0 overflow-hidden relative flex items-center justify-center">
                      {formData.main_image ? (
                        <img
                          src={formData.main_image}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon size={20} className="text-sonic-600" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sonic-800 hover:bg-sonic-750 text-white text-xs font-semibold border border-sonic-700 transition-colors">
                        <Upload size={13} className="text-brand-orange" />
                        <span>{formData.main_image ? 'Change Cover Image' : 'Choose Cover Image from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-sonic-400">Directly pick JPG/PNG from your PC (No URL needed)</p>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-sonic-900">
                    <input
                      type="url"
                      value={formData.main_image.startsWith('data:') ? '' : formData.main_image}
                      onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                      placeholder="Or paste external image URL (optional)"
                      className="w-full bg-sonic-900 border border-sonic-800 text-sonic-300 placeholder-sonic-600 text-[11px] px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                {/* Multiple Gallery Images (Direct Multi-File Upload) */}
                <div className="p-3.5 rounded-xl bg-sonic-950 border border-sonic-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Images size={14} className="text-brand-orange" />
                      <label className="font-bold text-white text-xs">
                        Multiple Product Images Gallery
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sonic-900 border border-sonic-800 text-sonic-400 font-mono">
                        {formData.gallery_images.length} images
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.gallery_images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gallery_images: [] }))}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold transition-colors mr-1"
                        >
                          Clear All
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="text-[10px] text-sonic-400 hover:text-white flex items-center gap-1 transition-colors"
                        title="Add URL field manually"
                      >
                        <Link2 size={11} /> + Add URL
                      </button>
                    </div>
                  </div>

                  {/* Direct Multi-Upload Dropzone/Button */}
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-brand-orange/40 bg-brand-orange/5 hover:bg-brand-orange/10 text-brand-orange transition-all font-semibold text-xs">
                    <Upload size={15} />
                    <span>Upload Multiple Images Directly (Device Se Select Karein)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilesUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Gallery Grid Previews */}
                  {formData.gallery_images.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1 max-h-40 overflow-y-auto pr-1">
                      {formData.gallery_images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square rounded-xl bg-sonic-900 border border-sonic-800 overflow-hidden flex items-center justify-center"
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <input
                              type="url"
                              value=""
                              onChange={(e) => handleUpdateGalleryImage(idx, e.target.value)}
                              placeholder="URL"
                              className="w-full h-full bg-transparent text-[9px] p-1 text-center text-white"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all shadow"
                            title="Remove image"
                          >
                            <X size={10} />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-sonic-300 font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-sonic-500 text-center py-1.5">
                      No additional images yet. Select multiple photos from device above.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sonic-300">Short Summary</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full bg-sonic-950 border border-sonic-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-orange text-xs"
                    placeholder="Short product punchline"
                  />
                </div>

                {/* Primary Variant Fields */}
                <div className="p-3.5 rounded-xl bg-sonic-950 border border-sonic-800 space-y-2.5">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Tag size={13} className="text-brand-orange" /> Default Color Variant & Inventory
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] text-sonic-400 block mb-1">Color Name</label>
                      <input
                        type="text"
                        value={formData.variant_color_name}
                        onChange={(e) => setFormData({ ...formData, variant_color_name: e.target.value })}
                        className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-sonic-400 block mb-1">Hex Code</label>
                      <input
                        type="text"
                        value={formData.variant_color_hex}
                        onChange={(e) => setFormData({ ...formData, variant_color_hex: e.target.value })}
                        className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-sonic-400 block mb-1">SKU</label>
                      <input
                        type="text"
                        value={formData.variant_sku}
                        onChange={(e) => setFormData({ ...formData, variant_sku: e.target.value })}
                        className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-sonic-400 block mb-1">Stock</label>
                      <input
                        type="number"
                        value={formData.variant_stock}
                        onChange={(e) => setFormData({ ...formData, variant_stock: e.target.value })}
                        className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sonic-300 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="accent-brand-orange rounded"
                    />
                    <span>Featured Flagship</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sonic-300 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.is_best_seller}
                      onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                      className="accent-brand-orange rounded"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sonic-300 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.is_new_arrival}
                      onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                      className="accent-brand-orange rounded"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Pinned Bottom Actions */}
              <div className="shrink-0 px-5 py-3 border-t border-sonic-800 bg-sonic-900 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sonic-800 hover:bg-sonic-750 text-sonic-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
