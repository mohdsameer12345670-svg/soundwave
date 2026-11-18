'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Volume2,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your account email to receive a new OTP.');
      return;
    }

    setIsResending(true);
    setErrorMsg(null);
    setResendNotice(null);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

        if (error) {
          if (error.message?.toLowerCase().includes('rate limit')) {
            setErrorMsg(error.message);
            setIsResending(false);
            return;
          }
        }
      }

      setResendNotice('A fresh 6-digit recovery OTP code has been dispatched to your email.');
      setResendCooldown(60);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Failed to resend recovery OTP.');
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP and Update Password
  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResendNotice(null);

    const cleanEmail = email.trim();
    const cleanOtp = otp.trim().replace(/\s+/g, '');

    if (!cleanEmail) {
      setErrorMsg('Please provide your registered account email.');
      return;
    }

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit recovery OTP code.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg('Supabase authentication is not configured in your environment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Step 1: Verify 6-digit recovery OTP
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: 'recovery',
      });

      if (verifyError) {
        setErrorMsg(
          verifyError.message ||
          'Invalid or expired recovery code. Please check your Gmail or request a fresh OTP.'
        );
        setIsSubmitting(false);
        return;
      }

      if (!verifyData.session && !verifyData.user) {
        setErrorMsg('Recovery session could not be established. Please request a new OTP code.');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Active recovery session established. Update the user password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setErrorMsg(updateError.message || 'Failed to update password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Step 3: Sign out temporary recovery session so user logs in cleanly with new credentials
      await supabase.auth.signOut();

      setIsResetComplete(true);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'An unexpected error occurred during password update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnUrl = isAdmin ? '/admin/login' : '/login';

  return (
    <div className="bg-sonic-950 min-h-screen py-16 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,85,0,0.08) 0%, transparent 60%)',
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
              <Shield size={11} /> Admin Security Verification
            </div>
          ) : null}

          <h1 className="text-2xl font-black text-white tracking-tight">
            Verify OTP & Reset Password
          </h1>
          <p className="text-xs text-sonic-400 leading-relaxed">
            Enter the 6-digit recovery code delivered to your Gmail along with your new security passphrase.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Resend Notice */}
        {resendNotice && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{resendNotice}</span>
          </div>
        )}

        {/* Success Screen */}
        {isResetComplete ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Password Reset Complete!</h3>
              <p className="text-xs text-sonic-300 leading-relaxed">
                Your credentials have been securely updated. You can now sign in using your new password.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(returnUrl)}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyAndUpdate} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-sonic-300 block mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* 6-Digit OTP Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-sonic-300">
                  6-Digit Verification OTP
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isResending}
                  className="text-[11px] font-semibold text-brand-orange hover:underline transition-colors disabled:text-sonic-500 disabled:no-underline flex items-center gap-1"
                >
                  <RefreshCw size={11} className={isResending ? 'animate-spin' : ''} />
                  <span>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={isSubmitting}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-600 pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono tracking-widest text-center font-bold focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-sonic-300 block mb-1.5">
                New Security Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Confirm New Password */}
            <div>
              <label className="text-xs font-semibold text-sonic-300 block mb-1.5">
                Confirm New Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-500 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-10 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sonic-400 hover:text-white transition-colors p-0.5"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying OTP & Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Verify OTP & Save Password</span>
                </>
              )}
            </button>

            {/* Return Link */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="bg-sonic-950 min-h-screen p-12 text-center text-sonic-400">Loading reset portal...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

