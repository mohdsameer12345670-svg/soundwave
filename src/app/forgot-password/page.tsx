'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Volume2, Mail, ArrowLeft, ArrowRight, CheckCircle2, Shield, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

        if (error) {
          // If rate limited or connection failure, alert the user
          if (error.message?.toLowerCase().includes('rate limit') || error.message?.toLowerCase().includes('security purposes')) {
            setErrorMsg(error.message);
            setIsSubmitting(false);
            return;
          }
          // For all other errors, proceed silently to prevent email enumeration
          console.warn('Supabase password recovery notice:', error.message);
        }
      } catch (err: unknown) {
        console.warn('Recovery OTP dispatch error:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const returnUrl = isAdmin ? '/admin/login' : '/login';

  return (
    <div className="bg-sonic-950 min-h-screen py-20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,85,0,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-md w-full bg-sonic-900/90 backdrop-blur-xl border border-sonic-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white shadow-lg shadow-brand-orange/20">
              <Volume2 size={20} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              SONIC<span className="text-brand-orange">WAVE</span>
            </span>
          </Link>

          {isAdmin ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1">
              <Shield size={11} /> Admin Security Recovery
            </div>
          ) : null}

          <h1 className="text-2xl font-black text-white tracking-tight">
            {isAdmin ? 'Administrator Password Recovery' : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-sonic-400 leading-relaxed">
            Enter your account email to receive a 6-digit verification OTP on your registered address.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={34} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Recovery OTP Dispatched</h3>
              <p className="text-xs text-sonic-300 leading-relaxed">
                If an account exists for <strong className="text-white break-all">{email}</strong>, a 6-digit recovery OTP code has been delivered. Please check your inbox and spam folder.
              </p>
            </div>

            <div className="p-3 bg-sonic-950 border border-sonic-800 rounded-xl text-left text-xs text-sonic-400 space-y-1">
              <div className="flex items-center gap-1.5 text-sonic-300 font-semibold">
                <KeyRound size={13} className="text-brand-orange" />
                <span>Next Step: Verify Code</span>
              </div>
              <p className="text-[11px] text-sonic-400">
                Use the 6-digit OTP code received in your email along with your new password on the verification screen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}${isAdmin ? '&admin=true' : ''}`)}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01]"
            >
              <span>Enter 6-Digit OTP & Reset Password</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-2 border-t border-sonic-800/80 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-sonic-400 hover:text-white transition-colors"
              >
                Change Email
              </button>
              <Link
                href={returnUrl}
                className="text-brand-orange hover:underline font-semibold flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-sonic-300 block mb-1.5">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
                />
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
                  <span>Dispatching Recovery OTP...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Send Recovery OTP Code</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-sonic-800 text-center">
              <Link
                href={returnUrl}
                className="text-xs text-sonic-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={13} /> Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="bg-sonic-950 min-h-screen p-12 text-center text-sonic-400">Loading recovery portal...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
