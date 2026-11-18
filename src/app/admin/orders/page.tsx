'use client';

import React, { useEffect, useState } from 'react';
import { DataService } from '@/lib/data/store';
import { Order } from '@/types';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Package,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Status updates in modal
  const [newFulfillmentStatus, setNewFulfillmentStatus] = useState<Order['fulfillment_status']>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order['payment_status']>('pending');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getAllOrdersAdmin();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewFulfillmentStatus(order.fulfillment_status);
    setNewPaymentStatus(order.payment_status);
    setTrackingCarrier(order.tracking_carrier || 'FedEx Express');
    setTrackingNumber(order.tracking_number || '');
    setFeedback(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const updated = await DataService.updateOrderStatus(selectedOrder.id, {
        fulfillment_status: newFulfillmentStatus,
        payment_status: newPaymentStatus,
        tracking_carrier: trackingCarrier || null,
        tracking_number: trackingNumber || null,
      });

      if (updated) {
        setSelectedOrder(updated);
        setFeedback('Order status & tracking updated successfully.');
        await loadOrders();
      }
    } catch (err) {
      setFeedback('Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q);

    const matchesFulfillment = statusFilter === 'all' || o.fulfillment_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesFulfillment && matchesPayment;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sonic-850">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
           Fulfilment Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Customer Orders & Log
          </h1>
          <p className="text-xs sm:text-sm text-sonic-400 mt-1">
            Inspect line-item snapshots, update shipping carrier tracking, and audit customer payments.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-sonic-900 border border-sonic-800 text-xs font-semibold text-sonic-300">
          Total Logged Orders: <strong className="text-white">{orders.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-400" />
          <input
            type="text"
            placeholder="Search order #, customer, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sonic-900 border border-sonic-800 text-white placeholder-sonic-500 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-sonic-900 border border-sonic-800 text-sonic-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
          >
            <option value="all">All Fulfilment Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-sonic-900 border border-sonic-800 text-sonic-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-sonic-900 border border-sonic-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-sonic-400">Loading order records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-sonic-400">No matching orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sonic-950/60 border-b border-sonic-800 text-sonic-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order Number</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sonic-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sonic-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-orange">
                      {order.order_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.customer_name}</div>
                      <div className="text-[10px] text-sonic-400">{order.customer_email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-sonic-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-sonic-300">
                      {order.items?.length || 1} audio unit(s)
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{order.total_amount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          order.payment_status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          order.fulfillment_status === 'delivered'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : order.fulfillment_status === 'shipped'
                            ? 'bg-blue-500/15 text-blue-400'
                            : order.fulfillment_status === 'cancelled'
                            ? 'bg-rose-500/15 text-rose-400'
                            : 'bg-sonic-800 text-sonic-300'
                        }`}
                      >
                        {order.fulfillment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="px-3 py-1.5 rounded-lg bg-sonic-800 hover:bg-sonic-750 text-white font-medium text-xs flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye size={13} /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Fulfilment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-sonic-900 border border-sonic-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-sonic-800">
              <div>
                <span className="text-[10px] font-bold text-brand-orange uppercase">Order Dossier</span>
                <h3 className="text-xl font-mono font-bold text-white mt-0.5">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-sonic-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {feedback}
              </div>
            )}

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-sonic-950 border border-sonic-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <CreditCard size={14} className="text-brand-orange" /> Customer Information
                </h4>
                <p className="text-sonic-200 font-semibold">{selectedOrder.customer_name}</p>
                <p className="text-sonic-400">{selectedOrder.customer_email}</p>
                <p className="text-sonic-400">{selectedOrder.customer_phone || 'No phone provided'}</p>
              </div>

              <div className="p-4 rounded-xl bg-sonic-950 border border-sonic-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <MapPin size={14} className="text-brand-orange" /> Shipping Destination
                </h4>
                <p className="text-sonic-300">
                  {selectedOrder.shipping_address.street}
                  {selectedOrder.shipping_address.apartment ? `, ${selectedOrder.shipping_address.apartment}` : ''}
                </p>
                <p className="text-sonic-400">
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                  {selectedOrder.shipping_address.postal_code}
                </p>
                <p className="text-sonic-400">{selectedOrder.shipping_address.country}</p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Package size={14} className="text-brand-orange" /> Purchased Line Items
              </h4>
              <div className="divide-y divide-sonic-800 border border-sonic-800 rounded-xl bg-sonic-950/50 overflow-hidden text-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.product_name}</p>
                      <p className="text-[10px] text-sonic-400">
                        Color: <span className="text-sonic-200">{item.color_name}</span> | SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sonic-200">
                        {item.quantity} × ₹{item.unit_price.toFixed(2)}
                      </p>
                      <p className="font-mono font-bold text-white">₹{item.line_total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-3 rounded-xl bg-sonic-950 border border-sonic-800 text-xs space-y-1">
                <div className="flex justify-between text-sonic-400">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({selectedOrder.coupon_code || 'PROMO'})</span>
                    <span>-₹{selectedOrder.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sonic-400">
                  <span>Shipping Fee</span>
                  <span>₹{selectedOrder.shipping_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sonic-400">
                  <span>Tax Amount</span>
                  <span>₹{selectedOrder.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-sonic-800 text-sm">
                  <span>Total Amount</span>
                  <span className="text-brand-orange">₹{selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 rounded-xl bg-sonic-950 border border-sonic-800 space-y-4 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Truck size={14} className="text-brand-orange" /> Update Fulfilment & Payment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-sonic-300">Fulfilment Status</label>
                  <select
                    value={newFulfillmentStatus}
                    onChange={(e) => setNewFulfillmentStatus(e.target.value as Order['fulfillment_status'])}
                    className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sonic-300">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as Order['payment_status'])}
                    className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-sonic-300">Carrier</label>
                  <input
                    type="text"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    placeholder="e.g. DHL Express, FedEx, UPS"
                    className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sonic-300">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TRK-8492049102"
                    className="w-full bg-sonic-900 border border-sonic-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Save Order Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
