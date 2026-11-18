  'use client';

  import React, { useState, Suspense } from 'react';
  import Link from 'next/link';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { useAuth } from '@/context/AuthContext';
  import { Volume2, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, UserCheck, Shield, Eye, EyeOff } from 'lucide-react';

  function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/account';
    const { login, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');

      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      } else {
        setSuccessMsg('Welcome back to SoundWave!');
        setTimeout(() => {
          if (res.role === 'admin') {
            // Admin signed in from customer login: safely redirect to admin console
            router.push('/admin');
          } else {
            // Customer signed in: strictly prevent unauthorized redirect to /admin
            const safeRedirect = redirectUrl.startsWith('/admin') ? '/account' : redirectUrl;
            router.push(safeRedirect);
          }
        }, 800);
      }
    };

    

    return (
      <div className="bg-sonic-950 min-h-screen py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-sonic-900/60 border border-sonic-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white">
                <Volume2 size={20} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                SONIC<span className="text-brand-orange">WAVE</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to SoundWave</h1>
            <p className="text-xs text-sonic-400">
              Access your order history, manage account preferences, and explore your acoustic setup.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}


          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-sonic-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-sonic-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-brand-orange hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-10 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
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
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-2 border-t border-sonic-800 text-center text-xs text-sonic-400">
            <span>New to ? </span>
            <Link href="/signup" className="text-brand-orange font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  export default function LoginPage() {
    return (
      <Suspense fallback={<div className="bg-sonic-950 min-h-screen p-12 text-center text-sonic-400">Loading sign in...</div>}>
        <LoginContent />
      </Suspense>
    );
  }
