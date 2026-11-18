'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Volume2,
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronRight,
  ChevronDown,
  Headphones,
  Radio,
  Speaker,
  Tv,
  Gamepad2,
  Music,
  Cable,
  LayoutGrid,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, setIsDrawerOpen, wishlist } = useCart();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 180);
  };

  // Close menus on route change
  useEffect(() => {
    setShopDropdownOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const shopCategories = [
    {
      name: 'All Audio Gear',
      href: '/shop',
      description: 'Explore our complete high-fidelity catalog',
      icon: LayoutGrid,
      badge: 'Catalog',
    },
    {
      name: 'Headphones',
      href: '/shop?category=headphones',
      description: 'Over-ear planar & hybrid active noise cancellation',
      icon: Headphones,
    },
    {
      name: 'Wireless Earbuds',
      href: '/shop?category=wireless-earbuds',
      description: 'True wireless freedom, LDAC & spatial tracking',
      icon: Radio,
      badge: 'Popular',
    },
    {
      name: 'Bluetooth Speakers',
      href: '/shop?category=bluetooth-speakers',
      description: 'Rugged portable sound engineered for 360° acoustics',
      icon: Speaker,
    },
    {
      name: 'Soundbars',
      href: '/shop?category=soundbars',
      description: 'Cinematic multi-channel Dolby Atmos 5.1.2 systems',
      icon: Tv,
    },
    {
      name: 'Gaming Headsets',
      href: '/shop?category=gaming-headsets',
      description: 'Zero-latency lossless 2.4GHz with broadcast mic',
      icon: Gamepad2,
    },
    {
      name: 'Earphones & IEMs',
      href: '/shop?category=earphones',
      description: 'Precision balanced armature reference monitors',
      icon: Music,
    },
    {
      name: 'Audio Accessories',
      href: '/shop?category=accessories',
      description: 'Machined aluminum stands, Qi docks & cables',
      icon: Cable,
    },
  ];

  const isHomeActive = pathname === '/';
  const isShopActive = pathname.startsWith('/shop') || pathname.startsWith('/product');
  const isAboutActive = pathname === '/about';

  // Do not render consumer storefront header on Admin panel pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-sonic-950/95 backdrop-blur-xl border-b border-sonic-850/80 shadow-2xl shadow-black/50' : 'bg-sonic-950/80 backdrop-blur-md border-b border-sonic-850/40'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-brand-orange/20 group-hover:bg-brand-orange/30 blur-md transition-all duration-300 group-hover:scale-110" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-brand-orange/25 group-hover:scale-105 transition-all duration-300">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                SOUND<span className="text-brand-orange">WAVE</span>
              </span>
              <span className="text-[10px] tracking-widest text-sonic-500 block -mt-1 uppercase font-semibold">
                High Fidelity Audio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isHomeActive
                  ? 'text-brand-orange bg-brand-orange/10 font-semibold'
                  : 'text-sonic-300 hover:text-white hover:bg-sonic-900'
              }`}
            >
              Home
            </Link>

            {/* Shop Link with Hover Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/shop"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isShopActive
                    ? 'text-brand-orange bg-brand-orange/10 font-semibold'
                    : 'text-sonic-300 hover:text-white hover:bg-sonic-900'
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    shopDropdownOpen ? 'rotate-180 text-brand-orange' : 'text-sonic-400'
                  }`}
                />
              </Link>

              {/* Hover Dropdown Mega-Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full -left-12 pt-2 z-50 w-[560px] animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-sonic-950/95 border border-sonic-800 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 ring-1 ring-white/5">
                    {/* Header */}
                      <Link
                        href="/shop"
                        onClick={() => setShopDropdownOpen(false)}
                        className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors"
                      >
                        <span>View All</span>
                        <ArrowRight size={11} />
                      </Link>
                  
                    {/* Categories Grid (2 Columns) */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {shopCategories.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-sonic-900/90 border border-transparent hover:border-sonic-800 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sonic-900 group-hover:bg-brand-orange/15 group-hover:text-brand-orange border border-sonic-800 group-hover:border-brand-orange/30 flex items-center justify-center text-sonic-400 transition-colors shrink-0 mt-0.5">
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-sonic-100 group-hover:text-brand-orange transition-colors">
                                  {cat.name}
                                </span>
                                {cat.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-brand-orange/20 text-brand-orange leading-tight">
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-sonic-400 truncate mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Link */}
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAboutActive
                  ? 'text-brand-orange bg-brand-orange/10 font-semibold'
                  : 'text-sonic-300 hover:text-white hover:bg-sonic-900'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-900 transition-colors"
              aria-label="Search audio products"
            >
              <Search size={19} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-900 transition-colors hidden sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sonic-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Admin Dashboard quick link (if admin) */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                title="Admin Control Center"
              >
                <Shield size={13} />
                <span>Admin</span>
              </Link>
            )}

            {/* Account dropdown or link */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-900 transition-colors"
                  aria-label="Customer Account"
                >
                  <div className="w-7 h-7 rounded-full bg-sonic-800 border border-sonic-700 flex items-center justify-center text-xs font-bold text-white">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                    {user.full_name || user.email.split('@')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-900 transition-colors text-xs font-semibold flex items-center gap-1.5"
                aria-label="Login or Sign Up"
              >
                <User size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-sonic-900 hover:bg-sonic-850 text-white border border-sonic-750 hover:border-brand-orange/40 transition-all flex items-center gap-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={19} className="text-brand-orange" />
              {totalItemsCount > 0 && (
                <span className="bg-brand-orange text-white text-[11px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-sonic-300 hover:text-white hover:bg-sonic-900 transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-sonic-850 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 text-sonic-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search studio headphones, wireless earbuds, soundbars..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-sonic-900 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-24 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-orange transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sonic-850 bg-sonic-950 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {/* Mobile Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-sonic-200 hover:text-white hover:bg-sonic-900 transition-colors"
            >
              <span>Home</span>
              <ChevronRight size={15} className="text-sonic-500" />
            </Link>

            {/* Mobile Shop with Accordion */}
            <div className="border border-sonic-850 rounded-xl overflow-hidden bg-sonic-900/40">
              <div className="flex items-center justify-between px-3 py-2.5">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-sonic-200 hover:text-brand-orange flex items-center gap-1.5"
                >
                  <LayoutGrid size={15} className="text-brand-orange" />
                  <span>Shop Catalog</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                  className="p-1 rounded text-sonic-400 hover:text-white"
                  aria-label="Toggle categories"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileShopExpanded ? 'rotate-180 text-brand-orange' : ''}`}
                  />
                </button>
              </div>

              {mobileShopExpanded && (
                <div className="px-2 pb-2 pt-1 border-t border-sonic-850/60 grid grid-cols-1 gap-1">
                  {shopCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-sonic-300 hover:text-white hover:bg-sonic-850 transition-colors"
                      >
                        <Icon size={14} className="text-brand-orange" />
                        <span>{cat.name}</span>
                        {cat.badge && (
                          <span className="ml-auto text-[9px] bg-brand-orange/20 text-brand-orange px-1.5 py-0.2 rounded font-bold">
                            {cat.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile About */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-sonic-200 hover:text-white hover:bg-sonic-900 transition-colors"
            >
              <span>About</span>
              <ChevronRight size={15} className="text-sonic-500" />
            </Link>
          </div>

          <div className="pt-3 border-t border-sonic-850 space-y-2">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sonic-200 hover:bg-sonic-900"
                >
                  <User size={16} className="text-brand-orange" />
                  <span>Account ({user.full_name || user.email})</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-400 bg-amber-500/10 font-semibold"
                  >
                    <Shield size={16} />
                    <span>Admin Control Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 text-left"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-sonic-900 hover:bg-sonic-850 text-white py-2 rounded-xl text-sm font-semibold border border-sonic-800"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-brand-orange hover:bg-brand-orange-hover text-white py-2 rounded-xl text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
