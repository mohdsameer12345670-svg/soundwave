'use client';

import React, { useEffect, useState } from 'react';
import { DataService } from '@/lib/data/store';
import {
  Users,
  Search,
  Sparkles,
  DollarSign,
  ShoppingBag,
  Calendar,
  Mail,
  Phone,
  Shield,
  UserCheck,
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  role: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await DataService.getCustomersAdmin();
        setCustomers(data);
      } catch (e) {
        console.error('Failed to load customers:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sonic-850">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
             CRM & Audience Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Customer Accounts & Lifetime Value
          </h1>
          <p className="text-xs sm:text-sm text-sonic-400 mt-1">
            Audited profiles, purchase frequency, and cumulative acoustic hardware spending.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-sonic-900 border border-sonic-800 text-xs text-sonic-300">
            Total Customers: <strong className="text-white">{customers.length}</strong>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
            LTV: ₹{totalRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-400" />
        <input
          type="text"
          placeholder="Search by customer name, email, or telephone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-sonic-900 border border-sonic-800 text-white placeholder-sonic-500 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-sonic-900 border border-sonic-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-sonic-400">Loading customer directory...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-sonic-400">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sonic-950/60 border-b border-sonic-800 text-sonic-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Account Tier</th>
                  <th className="py-3.5 px-4 font-semibold">Orders Count</th>
                  <th className="py-3.5 px-4 font-semibold">Cumulative Spend</th>
                  <th className="py-3.5 px-4 font-semibold">Latest Order</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Data Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sonic-800/60">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-sonic-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sonic-800 border border-sonic-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-sonic-500 font-mono">ID: {c.id.substring(0, 12)}...</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-sonic-300">
                      <div className="flex items-center gap-1.5 text-sonic-200">
                        <Mail size={12} className="text-sonic-500" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sonic-400 text-[10px] mt-0.5">
                        <Phone size={11} className="text-sonic-500" />
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                        {c.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-sonic-200">
                      {c.ordersCount} orders
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{c.totalSpent.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-sonic-400">
                      {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-sonic-400 px-2 py-0.5 rounded bg-sonic-950 border border-sonic-800">
                        <Shield size={11} className="text-emerald-400" /> RLS Protected
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
