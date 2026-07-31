import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import LeafParticles from './LeafParticles';
import { useScrollY } from '@/lib/hooks';

const taglines = ['Pure Nature.', 'Pure Care.', 'Pure Confidence.'];

export default function Hero() {
  const y = useScrollY();
  const parallax = Math.min(y * 0.25, 120);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      {/* Background imagery */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/32746164/pexels-photo-32746164.jpeg?auto=compress&cs=tinysrgb&w=1900)',
            transform: `translateY(${parallax}px) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-900/80 to-forest-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-transparent to-forest-950/70" />
      </div>

      <LeafParticles count={14} />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs tracking-[0.25em] text-gold-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            LUXURY ORGANIC SKINCARE
          </motion.div>

          <h1 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl xl:text-7xl">
            <span className="block overflow-hidden">
              {taglines.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.18, duration: 0.7, ease: 'easeOut' }}
                  className="mb-1 block"
                >
                  <span className={i === 1 ? 'gold-shimmer' : 'text-cream'}>{t}</span>
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-6 text-lg font-light text-cream/70 sm:text-xl"
          >
            Experience the Power of Nature.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <a href="#products" className="btn-gold animate-pulse-glow">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              className="text-sm font-light tracking-wide text-cream/70 underline-offset-4 transition-colors hover:text-gold-200 hover:underline"
            >
              Discover our story
            </a>
          </motion.div>
        </div>

        {/* Hero bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
          className="relative flex justify-center"
        >
          <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <motion.div
            animate={{ y: [0, -22, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-gold-400/30 via-transparent to-forest-500/20 blur-2xl" />
            <img
              src="/items/face_cream_item_.jpeg"
              alt="ORGANIC HEAVEN signature product"
              className="relative z-10 w-[300px] rounded-[32px] border border-gold-400/20 object-contain bg-forest-900/40 p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:w-[360px]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-gold-400/40 p-1.5">
          <motion.span
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-gold-300"
          />
        </div>
      </motion.div>
    </section>
  );
}
