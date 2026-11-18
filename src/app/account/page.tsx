'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { DataService } from '@/lib/data/store';
import { Order, Product } from '@/types';
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'orders' | 'profile' | 'wishlist') || 'orders';

  const { user, logout, updateProfile } = useAuth();
  const { wishlist, toggleWishlist, addItem } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile edit state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.shipping_address?.street || '');
  const [city, setCity] = useState(user?.shipping_address?.city || '');
  const [state, setState] = useState(user?.shipping_address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.shipping_address?.postal_code || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync profile fields when user loads
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setStreet(user.shipping_address?.street || '');
      setCity(user.shipping_address?.city || '');
      setState(user.shipping_address?.state || '');
      setPostalCode(user.shipping_address?.postal_code || '');
    }
  }, [user]);

  // Load orders & wishlist products
  useEffect(() => {
    async function loadAccountData() {
      if (user) {
        const userOrders = await DataService.getOrdersByUser(user.id);
        setOrders(userOrders.length > 0 ? userOrders : await DataService.getAllOrdersAdmin());
      } else {
        // demo fallback
        const all = await DataService.getAllOrdersAdmin();
        setOrders(all.slice(0, 2));
      }

      // Load products in wishlist
      const prods = await DataService.getProducts();
      setWishlistProducts(prods.filter(p => wishlist.includes(p.id)));
    }

    loadAccountData();
  }, [user, wishlist]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      phone,
      shipping_address: {
        first_name: fullName.split(' ')[0] || '',
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone,
        street,
        city,
        state,
        postal_code: postalCode,
        country: 'United States',
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="bg-sonic-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Summary */}
        <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.full_name || 'Valued Listener'}
                </h1>
                <span className="text-[11px] font-semibold text-brand-orange bg-brand-orange/15 px-2 py-0.5 rounded-full capitalize">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-sonic-400 mt-0.5">{user?.email || 'guest@soundwave.audio'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-initial bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-semibold text-center transition-colors"
              >
                Admin Control Center
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-initial bg-sonic-850 hover:bg-sonic-800 text-sonic-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold border border-sonic-750 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 pb-4 mb-8 border-b border-sonic-850 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                : 'text-sonic-400 hover:text-white hover:bg-sonic-900'
            }`}
          >
            <Package size={15} />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                : 'text-sonic-400 hover:text-white hover:bg-sonic-900'
            }`}
          >
            <User size={15} />
            <span>Profile & Delivery Address</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'wishlist'
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                : 'text-sonic-400 hover:text-white hover:bg-sonic-900'
            }`}
          >
            <Heart size={15} />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {selectedOrder ? (
              // Order Detail Subview
              <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sonic-800">
                  <div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs text-brand-orange hover:underline mb-1 inline-block"
                    >
                      ← Back to All Orders
                    </button>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Order #{selectedOrder.order_number}</span>
                    </h2>
                    <span className="text-xs text-sonic-400 font-mono">
                      Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-sonic-800 text-brand-orange">
                      {selectedOrder.fulfillment_status}
                    </span>
                    <div className="text-xs text-sonic-400 mt-1">
                      Payment: <strong className="text-white capitalize">{selectedOrder.payment_status}</strong>
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Items</h3>
                  {selectedOrder.items?.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 bg-sonic-950 rounded-xl border border-sonic-850"
                    >
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-sonic-900 relative shrink-0">
                            <Image src={item.image_url} alt={item.product_name} fill sizes="48px" className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white">{item.product_name}</div>
                          <div className="text-[11px] text-sonic-400">
                            Color: {item.color_name} • SKU: {item.sku}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs sm:text-sm text-white">
                        ₹{item.line_total.toFixed(2)}
                        <div className="text-[10px] text-sonic-400">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking info if dispatched */}
                {selectedOrder.tracking_number && (
                  <div className="p-4 rounded-xl bg-sonic-950 border border-emerald-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold block">Dispatched with Tracking</span>
                      <span className="text-sonic-300 font-mono">{selectedOrder.tracking_carrier || 'UPS'}: {selectedOrder.tracking_number}</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[11px] font-semibold">
                      In Transit
                    </span>
                  </div>
                )}

                {/* Summary total */}
                <div className="p-4 bg-sonic-950 rounded-xl border border-sonic-850 space-y-1.5 text-xs text-sonic-300 max-w-sm ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{selectedOrder.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-sonic-800">
                    <span>Total:</span>
                    <span className="font-mono text-brand-orange">₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-sonic-900/40 border border-sonic-850 rounded-3xl p-8 space-y-3">
                <Package size={36} className="mx-auto text-sonic-500" />
                <h3 className="text-base font-bold text-white">No previous acoustic orders</h3>
                <p className="text-xs text-sonic-400">When you place orders, track live status and dispatch updates right here.</p>
                <Link href="/shop" className="inline-block mt-2 bg-brand-orange text-white text-xs font-bold px-5 py-2.5 rounded-xl">
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-sonic-900/60 border border-sonic-800 hover:border-sonic-700 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-sonic-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">#{order.order_number}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-orange/15 text-brand-orange px-2 py-0.5 rounded-full">
                          {order.fulfillment_status}
                        </span>
                      </div>
                      <div className="text-xs text-sonic-400 mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 1} items
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-white font-mono">
                          ₹{order.total_amount.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-sonic-500 capitalize">{order.payment_method.replace(/_/g, ' ')}</div>
                      </div>
                      <ChevronRight size={16} className="text-sonic-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 max-w-2xl">
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-sonic-800">
              Personal & Delivery Preferences
            </h3>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 size={14} />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs text-sonic-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-xs text-sonic-400 block mb-1">Account Email (Verified)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-sonic-950/50 border border-sonic-850 text-sonic-500 px-3.5 py-2.5 rounded-xl text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs text-sonic-400 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="pt-2 border-t border-sonic-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Saved Shipping Destination</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-sonic-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-sonic-400 block mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-sonic-400 block mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors mt-2"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-sonic-900/40 border border-sonic-850 rounded-3xl p-8 space-y-3">
                <Heart size={36} className="mx-auto text-sonic-500" />
                <h3 className="text-base font-bold text-white">Your wishlist is empty</h3>
                <p className="text-xs text-sonic-400">Save your favorite audio systems here to purchase later.</p>
                <Link href="/shop" className="inline-block mt-2 bg-brand-orange text-white text-xs font-bold px-5 py-2.5 rounded-xl">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-sonic-900/60 border border-sonic-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sonic-950">
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-sonic-950/80 text-red-400 hover:text-white"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <Link href={`/product/${product.slug}`} className="text-sm font-bold text-white hover:text-brand-orange line-clamp-1">
                        {product.name}
                      </Link>
                      <div className="text-xs font-mono text-brand-orange mt-1">
                        ₹{(product.sale_price ?? product.base_price).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const variant = product.variants?.[0] || {
                          id: `v-${product.id}`,
                          product_id: product.id,
                          color_name: 'Standard',
                          color_hex: '#111111',
                          sku: `SW-${product.id.slice(0, 5)}`,
                          stock_quantity: 10,
                          is_active: true,
                        };
                        addItem(product, variant, 1);
                      }}
                      className="w-full bg-sonic-850 hover:bg-brand-orange text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="bg-sonic-950 min-h-screen p-12 text-center text-sonic-400">Loading customer account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
