import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastNotification } from '@/components/ui/ToastNotification';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SoundWave | Premium High-Fidelity Audio Electronics',
  description: 'Explore SoundWave studio headphones, wireless ANC earbuds, Dolby Atmos soundbars, and audiophile sound systems engineered for pure acoustic precision.',
  keywords: 'headphones, audiophile, ANC, wireless earbuds, bluetooth speaker, soundbar, Dolby Atmos, gaming headset',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-sonic-950 text-sonic-100 selection:bg-brand-orange selection:text-white">
        <AuthProvider>
          <CartProvider>
          
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <ToastNotification />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
