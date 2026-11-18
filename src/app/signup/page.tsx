'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Volume2, ArrowRight, CheckCircle2, ShieldCheck, Mail, Lock, User, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isSupabaseLive } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Dedicated Thank You Screen State
  const [isSignedUpSuccess, setIsSignedUpSuccess] = useState(false);
  const [verificationNote, setVerificationNote] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const res = await signup(email, password, fullName);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account. Please check your details.');
    } else {
      if (res.message) {
        setVerificationNote(res.message);
      }
      setIsSignedUpSuccess(true);
    }
  };

  // Dedicated Thank You Screen
  if (isSignedUpSuccess) {
    return (
      <div className="bg-sonic-950 min-h-screen py-20 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-sonic-900/80 border border-sonic-750 p-8 sm:p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-18 h-18 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles size={12} /> Membership Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Thank you for joining SoundWave!
            </h1>
            <p className="text-xs sm:text-sm text-sonic-300">
              Your account has been created successfully. Welcome to pure high-fidelity sound.
            </p>
          </div>

          {verificationNote && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left text-xs text-amber-300 space-y-1">
              <strong className="block text-amber-200">Email Verification Required:</strong>
              <p>{verificationNote}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              href="/shop"
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02]"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/account"
              className="w-full bg-sonic-850 hover:bg-sonic-800 text-sonic-200 hover:text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors"
            >
              Go to Your Account Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Join SoundWave Audio</h1>
          <p className="text-xs text-sonic-400">
            Create an acoustic profile to track orders, save wishlists, and receive exclusive listening drops.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-sonic-300 block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-sonic-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="Enter your e mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-sonic-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-sonic-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Account'}
          </button>
        </form>

        <div className="pt-2 border-t border-sonic-800 text-center text-xs text-sonic-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-brand-orange font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
