import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Volume2,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Award,
  Radio,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SoundWave | Precision Acoustic Engineering',
  description:
    'Learn about SoundWave, our commitment to uncompromised acoustic fidelity, ergonomic industrial design, and pure audio performance.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: <Volume2 className="w-6 h-6 text-brand-orange" />,
      title: 'Acoustic Purity',
      description:
        'Every custom beryllium and biocellulose driver is tuned to deliver an expansive soundstage with surgical spatial imaging and zero harmonic distortion.',
    },
    {
      icon: <Sliders className="w-6 h-6 text-brand-orange" />,
      title: 'Precision Architecture',
      description:
        'Precision-machined aircraft-grade aluminum, memory foam ear cups, and acoustic damping chambers engineered for long-session listening fatigue mitigation.',
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-orange" />,
      title: 'Zero-Latency Wireless',
      description:
        'Custom low-latency 2.4GHz RF and lossless Bluetooth 5.4 codecs (LDAC, aptX Adaptive) ensuring seamless, uncompressed audio transmission.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: 'Built For Longevity',
      description:
        'Modular components, replaceable memory cushions, braided Kevlar-reinforced cables, and our comprehensive 2-year manufacturer warranty guarantee peace of mind.',
    },
  ];

  const milestones = [
    {
      title: 'Acoustic Architecture',
      detail: 'Proprietary balanced planar drivers designed to replicate the natural frequency curve of reference master studio monitors.',
    },
    {
      title: 'Materials & Ergonomics',
      detail: 'Lightweight titanium alloys paired with breathable protein leather ensure weight is evenly distributed across cranial contact points.',
    },
    {
      title: 'Active Noise Attenuation',
      detail: 'Dual-feedforward and feedback MEMS microphone arrays cancelling up to 48dB of ambient environmental noise without altering acoustic warmth.',
    },
    {
      title: 'Sustainable Packaging',
      detail: '100% plastic-free recycled pulp packaging and soy-based inks, reflecting our dedication to environmental responsibility.',
    },
  ];

  return (
    <div className="bg-sonic-950 text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-sonic-850">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-semibold tracking-wide uppercase mb-6">
             The SoundWave Philosophy
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
            Engineered for <span className="text-brand-orange">Pure Fidelity</span>.
            <br className="hidden sm:inline" /> Designed for Longevity.
          </h1>

          <p className="text-base sm:text-xl text-sonic-300 max-w-3xl mx-auto leading-relaxed">
            At SoundWave, we build precision audio instruments for music producers, audiophiles, and discerning listeners who demand studio-grade tonal accuracy and tactile craftsmanship.
          </p>
        </div>
      </section>

      {/* Brand Story & Mission */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
              <Radio size={14} /> Our Mission & Vision
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Bridging the gap between master studio monitors and daily listening.
            </h2>

            <p className="text-sonic-300 text-sm sm:text-base leading-relaxed">
              SoundWave was founded on a simple premise: everyday listeners shouldn&apos;t have to compromise between the uncompromising detail of high-end mastering gear and the convenience of wireless modern electronics.
            </p>

            <p className="text-sonic-300 text-sm sm:text-base leading-relaxed">
              We eliminate excessive marketing fluff and inflated markups, investing our resources where sound is born—in acoustic chambers, dynamic driver diaphragms, and bespoke digital signal processing algorithms.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-105"
              >
                Explore The Collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-sonic-800 bg-sonic-900 shadow-2xl group">
            <div className="aspect-[4/3] relative">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
                alt="SoundWave Acoustic Engineering Lab"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sonic-950 via-sonic-950/20 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 bg-sonic-900/90 border-t border-sonic-800">
              <div className="flex items-center justify-between text-xs text-sonic-400">
                <span className="font-semibold text-white">Precision Acoustic Tuning</span>
                <span className="font-mono text-brand-orange">Sub-0.05% THD @ 1kHz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Pillars */}
      <section className="py-20 bg-sonic-900/50 border-y border-sonic-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              What Defines Every SoundWave Device
            </h2>
            <p className="text-sonic-300 text-sm mt-3">
              We design every transducer, circuit board, and enclosure with purposeful acoustic intent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-sonic-900/80 border border-sonic-800 hover:border-brand-orange/40 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5 group-hover:bg-brand-orange/20 transition-colors">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs text-sonic-300 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Specifications & Milestones */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-sonic-800 bg-sonic-900 shadow-2xl order-2 lg:order-1">
            <div className="aspect-[4/3] relative">
              <Image
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
                alt="SoundWave Driver Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sonic-950 via-transparent to-transparent" />
            </div>
            <div className="p-6 bg-sonic-900/90 border-t border-sonic-800">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-sonic-300 font-medium">Beryllium Composite Diaphragm Driver</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Industrial Craftsmanship
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Acoustic Architecture Without Compromise
              </h2>
            </div>

            <div className="space-y-5">
              {milestones.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-sonic-300 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-b from-sonic-900/60 to-sonic-950 border-t border-sonic-850">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange mx-auto mb-6">
            <Headphones size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Experience the SoundWave Difference?
          </h2>
          <p className="text-sonic-300 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Every audio system ships with our 30-day acoustic trial and free express shipping over ₹999.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/shop"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              SEE All Audio Systems <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
