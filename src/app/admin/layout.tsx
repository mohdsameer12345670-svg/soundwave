
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Volume2,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function AdminLoginForm({
  currentEmail,
  isCustomerSession,
  onSignOutCurrent,
}: {
  currentEmail?: string | null;
  isCustomerSession?: boolean;
  onSignOutCurrent?: () => Promise<void>;
}) {
  const router = useRouter();
  const { login } = useAuth();
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
      setErrorMessage('Please provide both administrative email and password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage('Supabase authentication is not configured in your environment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate and update AuthContext immediately
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
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected authentication error occurred.'
      );
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
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(255,85,0,0.08) 0%, transparent 60%)',
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

        {/* Active Customer Session Alert */}
        {isCustomerSession && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert size={15} className="text-amber-400 shrink-0" />
              <span>Signed in as Customer</span>
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Your active account (<strong className="text-white">{currentEmail}</strong>) does not have administrator privileges.
            </p>
            {onSignOutCurrent && (
              <button
                type="button"
                onClick={onSignOutCurrent}
                className="text-[11px] font-bold text-amber-400 hover:text-white underline underline-offset-2 transition-colors"
              >
                Sign out of this customer session
              </button>
            )}
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

        {/* Security Footer & Return Link */}
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading, isSupabaseLive, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await logout();
      router.replace('/admin');
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Redirect authenticated admins from /admin/login to /admin safely in useEffect
  useEffect(() => {
    if (pathname === '/admin/login' && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [pathname, user, router]);

  // Wait until authentication check completes.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sonic-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-sonic-400">
            Verifying administrative credentials...
          </p>
        </div>
      </div>
    );
  }

  // Dedicated /admin/login page should render without dashboard wrapper
  if (pathname === '/admin/login') {
    if (user && user.role === 'admin') {
      return (
        <div className="min-h-screen bg-sonic-950 flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-sonic-400">
              Loading admin control center...
            </p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Only authenticated Supabase admins can access this area.
  // When not logged in or role is not admin, render the professional Admin Login portal!
  if (!isSupabaseLive || !user || user.role !== 'admin') {
    return (
      <AdminLoginForm
        currentEmail={user?.email}
        isCustomerSession={Boolean(user && user.role !== 'admin')}
        onSignOutCurrent={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-sonic-950 text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-sonic-900 border-b border-sonic-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white">
            <Volume2 size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight">
            SONIC<span className="text-brand-orange">ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-orange/15 hover:bg-brand-orange text-brand-orange hover:text-white border border-brand-orange/30 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Store</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-800"
            aria-label="Toggle admin navigation menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sonic-900/95 backdrop-blur-md border-r border-sonic-800 p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2.5"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white">
                <Volume2 className="w-5 h-5" />
              </div>

              <div>
                <span className="text-base font-extrabold tracking-tight flex items-center">
                  SONIC<span className="text-brand-orange">ADMIN</span>
                </span>
                <span className="text-[10px] tracking-wider text-sonic-400 block uppercase font-semibold">
                  Audio Operations
                </span>
              </div>
            </Link>

            <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 flex items-center gap-2">
              <ShieldCheck size={14} />
              <span>Verified Admin Role</span>
            </div>

            {/* Back to Storefront Button right below logo in sidebar */}
            <Link
              href="/"
              className="mt-3 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-sonic-800/90 hover:bg-brand-orange text-sonic-200 hover:text-white border border-sonic-700/60 hover:border-brand-orange transition-all group shadow-sm"
              title="Storefront / Website par wapas jayein"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft size={14} className="text-brand-orange group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
                <span>Back to Store</span>
              </span>
              <Store size={14} className="text-sonic-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href + '/'));

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                      : 'text-sonic-300 hover:text-white hover:bg-sonic-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-sonic-800 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-sonic-300 hover:text-white hover:bg-sonic-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              Public Storefront
            </span>
          </Link>

          <div className="px-3 py-2 rounded-xl bg-sonic-950/80 border border-sonic-800">
            <p className="text-[11px] font-bold text-white truncate">
              {user.full_name || 'Admin'}
            </p>
            <p className="text-[10px] text-sonic-400 truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
          >
            <LogOut size={14} />
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Top persistent action bar with Storefront link */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sonic-850/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-sonic-400">
              SoundWave Admin Portal
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sonic-900 hover:bg-brand-orange text-sonic-200 hover:text-white border border-sonic-800 hover:border-brand-orange text-xs font-bold transition-all shadow-sm group"
          >
            <ArrowLeft size={14} className="text-brand-orange group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <span>Back to Store (Website)</span>
            <Store size={13} className="opacity-80" />
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}

