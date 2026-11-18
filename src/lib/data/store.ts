
import { Category, Product, Order, Coupon, Review, ProductVariant } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_REVIEWS } from './initial-data';
import { isSupabaseConfigured, createClient as getSupabaseClient } from '@/lib/supabase/client';

// In-memory runtime persistence
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryOrders: Order[] = [...INITIAL_ORDERS];
let memoryCoupons: Coupon[] = [...INITIAL_COUPONS];
let memoryReviews: Review[] = [...INITIAL_REVIEWS];
let memorySubscribers: string[] = ['vip@soundwave.audio'];

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'featured';
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export const DataService = {
  // 1. CATEGORIES

  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch categories fallback to memory:', err);
      }
    }

    return memoryCategories.filter(c => c.is_active);
  },


async getAllCategoriesAdmin(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Admin categories fetch error:', error);
      throw error;
    }

    // Never use fake in-memory category IDs for Supabase products.
    return (data || []) as Category[];
  }

  return memoryCategories;
},

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cats = await this.getCategories();
    return cats.find(c => c.slug === slug) || null;
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        if (category.id) {
          const { data, error } = await supabase
            .from('categories')
            .update({
              name: category.name,
              slug: category.slug,
              description: category.description,
              image_url: category.image_url,
              is_active: category.is_active,
              sort_order: category.sort_order,
            })
            .eq('id', category.id)
            .select()
            .single();

          if (error) throw error;
          if (data) return data as Category;
        } else {
          const { data, error } = await supabase
            .from('categories')
            .insert({
              name: category.name || 'New Category',
              slug: category.slug || `cat-${Date.now()}`,
              description: category.description || '',
              image_url: category.image_url || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
              is_active: category.is_active ?? true,
              sort_order: category.sort_order ?? 99,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) return data as Category;
        }
      } catch (err) {
        console.error('Supabase saveCategory error:', err);
        throw err;
      }
    }

    if (category.id) {
      const idx = memoryCategories.findIndex(c => c.id === category.id);

      if (idx !== -1) {
        memoryCategories[idx] = {
          ...memoryCategories[idx],
          ...category,
        } as Category;

        return memoryCategories[idx];
      }
    }

    const newCat: Category = {
      id: `c-${Date.now()}`,
      name: category.name || 'New Category',
      slug: category.slug || `cat-${Date.now()}`,
      description: category.description || '',
      image_url: category.image_url || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      is_active: category.is_active ?? true,
      sort_order: category.sort_order ?? memoryCategories.length + 1,
    };

    memoryCategories.push(newCat);
    return newCat;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', id)
          .limit(1);

        if (productsError) throw productsError;

        if (products && products.length > 0) {
          return {
            success: false,
            error: 'Cannot delete category that contains products. Reassign products first.',
          };
        }

        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Failed to delete category.',
        };
      }
    }

    const isUsed = memoryProducts.some(p => p.category_id === id);

    if (isUsed) {
      return {
        success: false,
        error: 'Cannot delete category that contains products. Reassign products first.',
      };
    }

    memoryCategories = memoryCategories.filter(c => c.id !== id);
    return { success: true };
  },

  // 2. PRODUCTS

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let list: Product[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
          `)
          .eq('is_active', true);

        if (filters.featured) query = query.eq('is_featured', true);
        if (filters.newArrival) query = query.eq('is_new_arrival', true);
        if (filters.bestSeller) query = query.eq('is_best_seller', true);

        const { data, error } = await query;

        if (error) throw error;
        if (data) list = data as Product[];
      } catch (err) {
        console.warn('Supabase fetch products fallback to memory:', err);
      }
    }

    if (list.length === 0) {
      list = [...memoryProducts].filter(p => p.is_active);
    }

    list = list.map(p => {
      if (!p.category) {
        p.category = memoryCategories.find(c => c.id === p.category_id);
      }
      return p;
    });

    if (filters.category) {
      list = list.filter(
        p => p.category?.slug === filters.category || p.category_id === filters.category
      );
    }

    if (filters.search) {
      const normalized = filters.search.toLowerCase().trim().replace(/\bwirless\b/g, 'wireless');
      const terms = normalized.split(/\s+/).filter(Boolean);

      list = list.filter(p => {
        const text = [
          p.name || '',
          p.short_description || '',
          p.description || '',
          p.category?.name || '',
          p.category?.slug || '',
          ...(p.variants?.map(v => `${v.color_name || ''} ${v.sku || ''}`) || []),
        ]
          .join(' ')
          .toLowerCase();

        return terms.every(term => text.includes(term));
      });
    }

    if (filters.minPrice !== undefined) {
      list = list.filter(
        p => (p.sale_price ?? p.base_price) >= (filters.minPrice ?? 0)
      );
    }

    if (filters.maxPrice !== undefined) {
      list = list.filter(
        p => (p.sale_price ?? p.base_price) <= (filters.maxPrice ?? Infinity)
      );
    }

    if (filters.featured) {
      list = list.filter(p => p.is_featured);
    }

    if (filters.newArrival) {
      list = list.filter(p => p.is_new_arrival);
    }

    if (filters.bestSeller) {
      list = list.filter(p => p.is_best_seller);
    }

    switch (filters.sort) {
      case 'price-asc':
        list.sort(
          (a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price)
        );
        break;

      case 'price-desc':
        list.sort(
          (a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price)
        );
        break;

      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;

      case 'newest':
      default:
        break;
    }

    return list;
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from('products')
          .select(`*, category:categories(*), variants:product_variants(*)`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) return data as Product[];
      } catch (err) {
        console.warn('Supabase fetch admin products fallback:', err);
      }
    }

    return memoryProducts.map(p => ({
      ...p,
      category: memoryCategories.find(c => c.id === p.category_id),
    }));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from('products')
          .select(`*, category:categories(*), variants:product_variants(*)`)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (data) return data as Product;
      } catch (err) {
        console.warn('Supabase getProductBySlug fallback:', err);
      }
    }

    const found = memoryProducts.find(p => p.slug === slug);

    if (!found) return null;

    return {
      ...found,
      category: memoryCategories.find(c => c.id === found.category_id),
    };
  },

  async saveProduct(
    product: Partial<Product>,
    variants: Partial<ProductVariant>[] = []
  ): Promise<Product> {
    const slug =
      product.slug ||
      (product.name
        ? product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : `prod-${Date.now()}`);

    // Supabase-first
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        // Sanitize base_price and sale_price to satisfy DB check constraint:
        // CHECK (sale_price IS NULL OR sale_price < base_price)
        const basePriceNum = Number(product.base_price) >= 0 ? Number(product.base_price) : 99.99;
        let salePriceNum =
          product.sale_price !== null && product.sale_price !== undefined && !isNaN(Number(product.sale_price))
            ? Number(product.sale_price)
            : null;

        if (salePriceNum !== null && (isNaN(salePriceNum) || salePriceNum >= basePriceNum)) {
          console.warn(`[saveProduct] sale_price (${salePriceNum}) >= base_price (${basePriceNum}). Nullifying sale_price to satisfy database check constraint.`);
          salePriceNum = null;
        }

        if (product.id) {
          // UPDATE existing product
          const { data: updatedProd, error } = await supabase
            .from('products')
            .update({
              name: product.name,
              slug,
              category_id: product.category_id,
              short_description: product.short_description,
              description: product.description,
              base_price: basePriceNum,
              sale_price: salePriceNum,
              main_image: product.main_image,
              gallery_images: product.gallery_images,
              is_active: product.is_active,
              is_featured: product.is_featured,
              is_new_arrival: product.is_new_arrival,
              is_best_seller: product.is_best_seller,
              features: product.features,
              specifications: product.specifications,
              updated_at: new Date().toISOString(),
            })
            .eq('id', product.id)
            .select(`*, category:categories(*), variants:product_variants(*)`)
            .single();

          if (error) throw error;

          if (updatedProd) {
            if (variants.length > 0) {
              for (const v of variants) {
                if (v.id) {
                  // Existing variant: update directly to avoid primary key conflict
                  const { id: varId, product_id: _pid, ...varFields } = v;
                  const { error: updateVarError } = await supabase
                    .from('product_variants')
                    .update({
                      ...varFields,
                      product_id: product.id,
                      updated_at: new Date().toISOString(),
                    })
                    .eq('id', varId);

                  if (updateVarError) {
                    console.warn('Variant update fallback to upsert:', updateVarError);
                    await supabase
                      .from('product_variants')
                      .upsert({
                        id: varId,
                        ...varFields,
                        product_id: product.id,
                        updated_at: new Date().toISOString(),
                      }, { onConflict: 'id' });
                  }
                } else {
                  // New variant: strip any id so PostgreSQL gen_random_uuid() creates a unique primary key
                  const { id: _ignored, product_id: _pid, ...insertFields } = v;
                  const { error: insertVarError } = await supabase
                    .from('product_variants')
                    .insert({
                      ...insertFields,
                      product_id: product.id,
                    });

                  if (insertVarError) throw insertVarError;
                }
              }
            }

            // Fetch product with fresh variants
            const { data: fullProduct } = await supabase
              .from('products')
              .select(`*, category:categories(*), variants:product_variants(*)`)
              .eq('id', product.id)
              .maybeSingle();

            return (fullProduct || updatedProd) as Product;
          }
        } else {
          // INSERT new product
          const { data: newProd, error } = await supabase
            .from('products')
            .insert({
              name: product.name || 'Untitled Audio Device',
              slug,
              category_id: product.category_id,
              short_description: product.short_description || '',
              description: product.description || '',
              base_price: basePriceNum,
              sale_price: salePriceNum,
              main_image:
                product.main_image ||
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
              gallery_images: product.gallery_images || [],
              is_active: product.is_active ?? true,
              is_featured: product.is_featured ?? false,
              is_new_arrival: product.is_new_arrival ?? true,
              is_best_seller: product.is_best_seller ?? false,
              rating: 5.0,
              review_count: 0,
              features: product.features || ['Premium High-Fidelity Audio Drivers'],
              specifications: product.specifications || { Warranty: '2 Years' },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select(`*, category:categories(*)`)
            .single();

          if (error) throw error;

          if (newProd) {
            const variantRows =
              variants.length > 0
                ? variants
                : [
                    {
                      color_name: 'Standard Black',
                      color_hex: '#111111',
                      sku: `SW-${Math.floor(Math.random() * 90000 + 10000)}`,
                      price: null,
                      image_url: product.main_image || '',
                      stock_quantity: 25,
                      is_active: true,
                    },
                  ];

            // Always strip any passed id so fresh unique primary keys are generated
            const cleanRows = variantRows.map(v => {
              const { id: _ignored, product_id: _pid, ...cleanVariant } = v;
              return {
                ...cleanVariant,
                product_id: newProd.id,
              };
            });

            const { data: insertedVariants, error: variantsError } = await supabase
              .from('product_variants')
              .insert(cleanRows)
              .select();

            if (variantsError) throw variantsError;

            return {
              ...newProd,
              variants: insertedVariants || [],
            } as Product;
          }
        }
      } 
     catch (err: any) {
  console.error("========== SAVE PRODUCT ERROR ==========");

  console.error("Original Error:", err);

  console.error("Message:", err?.message);
  console.error("Code:", err?.code);
  console.error("Details:", err?.details);
  console.error("Hint:", err?.hint);

  console.error(
    "Full Error:",
    JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
  );

  console.error("=========================================");

  throw err;
}
    }

    // Memory fallback
    if (product.id) {
      const idx = memoryProducts.findIndex(p => p.id === product.id);

      if (idx !== -1) {
        const existing = memoryProducts[idx];

        const updated: Product = {
          ...existing,
          ...product,
          slug,
          variants:
            variants.length > 0
              ? (variants as ProductVariant[])
              : existing.variants,
          updated_at: new Date().toISOString(),
        };

        memoryProducts[idx] = updated;
        return updated;
      }
    }

    const newId = `p-${Date.now()}`;

    const defaultVariants: ProductVariant[] =
      variants.length > 0
        ? (variants as ProductVariant[])
        : [
            {
              id: `v-${Date.now()}-1`,
              product_id: newId,
              color_name: 'Standard Black',
              color_hex: '#111111',
              sku: `SW-${Math.floor(Math.random() * 90000 + 10000)}`,
              price: null,
              image_url: product.main_image || '',
              stock_quantity: 25,
              is_active: true,
            },
          ];

    const newProduct: Product = {
      id: newId,
      category_id: product.category_id || memoryCategories[0]?.id || 'cat-1',
      name: product.name || 'Untitled Audio Device',
      slug,
      short_description: product.short_description || '',
      description: product.description || '',
      base_price: Number(product.base_price) || 99.99,
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      main_image:
        product.main_image ||
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
      gallery_images:
        product.gallery_images ||
        [
          product.main_image ||
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
        ],
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_new_arrival: product.is_new_arrival ?? true,
      is_best_seller: product.is_best_seller ?? false,
      rating: 5.0,
      review_count: 0,
      features:
        product.features ||
        ['Premium High-Fidelity Audio Drivers', 'Ergonomic Acoustic Design'],
      specifications:
        product.specifications ||
        { Frequency: '20Hz - 20,000Hz', Warranty: '2 Years' },
      variants: defaultVariants,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryProducts.unshift(newProduct);
    return newProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { error: variantError } = await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', id);

        if (variantError) throw variantError;

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return true;
      } catch (err) {
        console.error('Supabase deleteProduct error:', err);
        throw err;
      }
    }

    memoryProducts = memoryProducts.filter(p => p.id !== id);
    return true;
  },

  // 3. COUPONS

  async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discount: number; message?: string; coupon?: Coupon }> {
    const trimmed = code.trim().toUpperCase();
    const coupon = memoryCoupons.find(c => c.code === trimmed && c.is_active);

    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: 'Invalid or expired promo code.',
      };
    }

    if (coupon.min_spend && subtotal < coupon.min_spend) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order of ₹${coupon.min_spend.toFixed(2)} required for this code.`,
      };
    }

    let discount = 0;

    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else {
      discount = Math.min(coupon.discount_value, subtotal);
    }

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      coupon,
    };
  },

  // 4. ORDERS & CHECKOUT

  async createOrder(
    orderInput: Omit<Order, 'id' | 'order_number' | 'created_at'>
  ): Promise<Order> {
    const orderNumber = `SW-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };

    if (newOrder.items) {
      for (const item of newOrder.items) {
        if (item.product_id && item.variant_id) {
          const product = memoryProducts.find(p => p.id === item.product_id);

          if (product && product.variants) {
            const variant = product.variants.find(v => v.id === item.variant_id);

            if (variant) {
              variant.stock_quantity = Math.max(
                0,
                variant.stock_quantity - item.quantity
              );
            }
          }
        }
      }
    }

    memoryOrders.unshift(newOrder);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { error } = await supabase.from('orders').insert({
          order_number: newOrder.order_number,
          user_id: newOrder.user_id,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address,
          subtotal: newOrder.subtotal,
          discount_amount: newOrder.discount_amount,
          shipping_fee: newOrder.shipping_fee,
          tax_amount: newOrder.tax_amount,
          total_amount: newOrder.total_amount,
          coupon_code: newOrder.coupon_code,
          payment_status: newOrder.payment_status,
          payment_method: newOrder.payment_method,
          payment_id: newOrder.payment_id || null,
          fulfillment_status: newOrder.fulfillment_status,
          customer_notes: newOrder.customer_notes,
        });

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase order insert fallback:', err);
      }
    }

    return newOrder;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const found = memoryOrders.find(
      o => o.order_number.toUpperCase() === orderNumber.toUpperCase()
    );

    return found || null;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return memoryOrders.filter(o => o.user_id === userId);
  },

  async getAllOrdersAdmin(): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) return data as Order[];
      } catch (err) {
        console.warn('Supabase getAllOrdersAdmin fallback:', err);
      }
    }

    return memoryOrders;
  },

  async updateOrderStatus(
    orderId: string,
    updates: {
      fulfillment_status?: Order['fulfillment_status'];
      payment_status?: Order['payment_status'];
      tracking_number?: string | null;
      tracking_carrier?: string | null;
    }
  ): Promise<Order | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from('orders')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .select()
          .single();

        if (error) throw error;
        if (data) return data as Order;
      } catch (err) {
        console.error('Supabase updateOrderStatus error:', err);
        throw err;
      }
    }

    const idx = memoryOrders.findIndex(o => o.id === orderId);

    if (idx === -1) return null;

    memoryOrders[idx] = {
      ...memoryOrders[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return memoryOrders[idx];
  },

  // 5. REVIEWS

  async getReviews(productId: string): Promise<Review[]> {
    return memoryReviews.filter(
      r => r.product_id === productId && r.is_approved
    );
  },

  async submitReview(
    review: Omit<Review, 'id' | 'created_at' | 'is_approved'>
  ): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_approved: true,
    };

    memoryReviews.unshift(newRev);

    const prod = memoryProducts.find(p => p.id === review.product_id);

    if (prod) {
      const prodReviews = memoryReviews.filter(
        r => r.product_id === review.product_id
      );

      const avg =
        prodReviews.reduce((sum, r) => sum + r.rating, 0) /
        prodReviews.length;

      prod.rating = Math.round(avg * 10) / 10;
      prod.review_count = prodReviews.length;
    }

    return newRev;
  },

  // 6. NEWSLETTER

  async subscribeNewsletter(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    if (memorySubscribers.includes(trimmed)) {
      return {
        success: true,
        message: "You're already subscribed to acoustic drops!",
      };
    }

    memorySubscribers.push(trimmed);

    return {
      success: true,
      message: 'Welcome to SoundWave! Enjoy your 10% welcome coupon code: SONIC10',
    };
  },

  // 7. ADMIN KPIS

  async getAdminStats() {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        const { count: activeProducts, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (productsError) throw productsError;

        const { count: uniqueCustomers, error: customersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        if (customersError) throw customersError;

        const { data: lowStockVariants, error: stockError } = await supabase
          .from('product_variants')
          .select('*, product:products(name)')
          .lte('stock_quantity', 15)
          .eq('is_active', true);

        if (stockError) throw stockError;

        const orderList = (orders || []) as Order[];

        const validOrders = orderList.filter(
          o =>
            o.payment_status === 'paid' ||
            o.payment_method === 'cash_on_delivery'
        );

        const totalSales = validOrders.reduce(
          (sum, o) => sum + o.total_amount,
          0
        );

        const lowStockAlerts = (lowStockVariants || []).map((v: any) => ({
          product: v.product?.name || 'Unknown Product',
          variant: v.color_name,
          stock: v.stock_quantity,
          sku: v.sku,
        }));

        return {
          totalOrders: orderList.length,
          totalSales,
          activeProducts: activeProducts || 0,
          uniqueCustomers: uniqueCustomers || 0,
          lowStockAlerts,
          recentOrders: orderList.slice(0, 5),
        };
      } catch (err) {
        console.warn('Supabase getAdminStats fallback:', err);
      }
    }

    const totalOrders = memoryOrders.length;

    const validOrders = memoryOrders.filter(
      o =>
        o.payment_status === 'paid' ||
        o.payment_method === 'cash_on_delivery'
    );

    const totalSales = validOrders.reduce(
      (sum, o) => sum + o.total_amount,
      0
    );

    const activeProducts = memoryProducts.filter(p => p.is_active).length;

    const lowStockAlerts: {
      product: string;
      variant: string;
      stock: number;
      sku: string;
    }[] = [];

    for (const p of memoryProducts) {
      if (p.variants) {
        for (const v of p.variants) {
          if (v.stock_quantity <= 15) {
            lowStockAlerts.push({
              product: p.name,
              variant: v.color_name,
              stock: v.stock_quantity,
              sku: v.sku,
            });
          }
        }
      }
    }

    const uniqueCustomers = new Set(
      memoryOrders.map(o => o.customer_email)
    ).size;

    return {
      totalOrders,
      totalSales,
      activeProducts,
      uniqueCustomers,
      lowStockAlerts,
      recentOrders: memoryOrders.slice(0, 5),
    };
  },

  async getCustomersAdmin() {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('user_id, customer_email, customer_name, customer_phone, total_amount, created_at');

        if (ordersError) throw ordersError;

        const orderList = orders || [];

        return (profiles || []).map((profile: any) => {
          const userOrders = orderList.filter(
            (o: any) =>
              o.user_id === profile.id ||
              o.customer_email === profile.email
          );

          const totalSpent = userOrders.reduce(
            (sum: number, o: any) => sum + (o.total_amount || 0),
            0
          );

          const lastOrder = userOrders.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )[0];

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.email,
            phone: profile.phone || '—',
            ordersCount: userOrders.length,
            totalSpent,
            lastOrderDate: lastOrder?.created_at || profile.created_at,
            role: profile.role || 'customer',
          };
        });
      } catch (err) {
        console.warn('Supabase getCustomersAdmin fallback:', err);
      }
    }

    const customerMap = new Map<
      string,
      {
        id: string;
        email: string;
        name: string;
        phone: string;
        ordersCount: number;
        totalSpent: number;
        lastOrderDate: string;
        role: string;
      }
    >();

    for (const order of memoryOrders) {
      const email = order.customer_email.toLowerCase();
      const existing = customerMap.get(email);

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += order.total_amount;

        if (order.created_at > existing.lastOrderDate) {
          existing.lastOrderDate = order.created_at;
        }
      } else {
        customerMap.set(email, {
          id: order.user_id || `cust-${Math.random().toString(36).substring(2, 9)}`,
          email: order.customer_email,
          name: order.customer_name,
          phone: order.customer_phone || '—',
          ordersCount: 1,
          totalSpent: order.total_amount,
          lastOrderDate: order.created_at,
          role: 'customer',
        });
      }
    }

    return Array.from(customerMap.values());
  },
};
