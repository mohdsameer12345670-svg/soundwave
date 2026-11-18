'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  Volume2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';
  const { user, logout, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please provide both administrator email and passphrase.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage('Supabase authentication is not configured in your environment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with Supabase Auth and update AuthContext
      const res = await login(cleanEmail, password);

      if (!res.success) {
        setErrorMessage(res.error || 'Invalid administrator credentials.');
        setIsSubmitting(false);
        return;
      }

      // 2. Strict Role Verification: Must be 'admin'
      if (res.role !== 'admin') {
        const supabase = createClient();
        await supabase.auth.signOut();
        setErrorMessage(
          'Access Denied: This account does not possess administrator privileges. Admin roles must be assigned directly in the database.'
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Access Granted
      setSuccessMessage('Administrator clearance verified. Loading control center...');
      setTimeout(() => {
        router.replace(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin');
      }, 500);
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sonic-950 flex items-center justify-center px-4 py-16 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,85,0,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-md w-full bg-sonic-900/90 backdrop-blur-xl border border-sonic-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10 overflow-hidden">
        {/* Subtle orange accent top line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span>Restricted Access Console</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-orange/20">
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight pt-1">
            SONIC<span className="text-brand-orange">ADMIN</span>
          </h1>
          <p className="text-xs text-sonic-400 leading-relaxed">
            Enter authorized administrative credentials to access store operations, inventory dispatch, and revenue metrics.
          </p>
        </div>

        {/* Active Customer Session Warning */}
        {user && user.role !== 'admin' && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert size={15} className="text-amber-400 shrink-0" />
              <span>Signed in as Customer ({user.email})</span>
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              This account does not have administrator privileges. Sign out or enter your administrative credentials below.
            </p>
            <button
              type="button"
              onClick={() => logout()}
              className="text-[11px] font-bold text-amber-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              Sign out current customer account
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-sonic-300 block mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@soundwave.audio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-sonic-300">
                Master Security Passphrase
              </label>
              <Link
                href="/forgot-password?admin=true"
                className="text-[11px] text-brand-orange hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-10 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sonic-400 hover:text-white transition-colors p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Verifying Admin Clearance...</span>
              </>
            ) : (
              <>
                <KeyRound size={15} />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer & Storefront Link */}
        <div className="pt-4 border-t border-sonic-800 flex flex-col items-center gap-2.5 text-center">
          <div className="text-[11px] text-sonic-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} className="text-brand-orange" />
            <span>Supabase Auth & Database Role Validation</span>
          </div>
          <Link
            href="/"
            className="text-xs text-sonic-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            Return to Storefront <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sonic-950 flex items-center justify-center text-sonic-400">Loading admin console...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}

