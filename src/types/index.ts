export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  shipping_address?: ShippingAddress | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  sku: string;
  price?: number | null; // Variant override price if different from base product
  image_url?: string | null; // Variant specific image
  stock_quantity: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  base_price: number;
  sale_price?: number | null;
  main_image: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  rating: number;
  review_count: number;
  features: string[];
  specifications: Record<string, string>;
  category?: Category;
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderFulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  color_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  payment_status: OrderPaymentStatus;
  payment_method: string;
  payment_id?: string | null;  // Razorpay payment ID after successful online payment
  fulfillment_status: OrderFulfillmentStatus;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  customer_notes?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend?: number;
  max_uses?: number | null;
  used_count: number;
  is_active: boolean;
  expires_at?: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string | null;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}
