import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Send, Leaf, Heart } from 'lucide-react';
import { useReveal } from '@/lib/hooks';

export default function Footer() {
  const { ref, inView } = useReveal();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3500);
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest-950 pt-20">
      {/* Gold leaf divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      <motion.div
        initial={{ rotate: 0 }}
        whileInView={{ rotate: 360 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/40 bg-forest-950">
          <Leaf className="h-4 w-4 text-gold-300" />
        </span>
      </motion.div>

      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Slogans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-serif text-3xl text-cream sm:text-4xl">
            <span className="gold-shimmer">Pure Nature. Pure Care. Pure Confidence.</span>
          </p>
          <p className="mt-2 text-sm tracking-[0.2em] text-cream/50">WHERE NATURE MEETS BEAUTY</p>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mx-auto mt-12 max-w-md"
        >
          <p className="mb-3 text-center text-sm font-light text-cream/70">
            Join the ORGANIC HEAVEN circle for botanical rituals & exclusive offers.
          </p>
          <form onSubmit={submit} className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-lux pr-14"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-gold-200 to-gold-400 text-forest-900 transition-transform hover:scale-105"
              aria-label="Subscribe"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center text-xs text-emerald-300"
            >
              Thank you for subscribing!
            </motion.p>
          )}
        </motion.div>

        {/* Links + social */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/5 pt-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-xl text-gold-200">ORGANIC HEAVEN</p>
            <p className="mt-2 text-sm font-light text-cream/60">
              Pure, botanical skincare crafted in small batches with the finest natural ingredients.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="mb-1 text-xs tracking-[0.2em] text-gold-400/80">EXPLORE</p>
            <a href="#home" className="text-cream/70 transition-colors hover:text-gold-200">Home</a>
            <a href="#products" className="text-cream/70 transition-colors hover:text-gold-200">Products</a>
            <a href="#about" className="text-cream/70 transition-colors hover:text-gold-200">About</a>
            <a href="/admin" className="text-cream/70 transition-colors hover:text-gold-200">Admin Panel</a>
          </div>
          <div>
            <p className="mb-3 text-xs tracking-[0.2em] text-gold-400/80">FOLLOW</p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 text-gold-200 transition-colors hover:bg-gold-400/10"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-center text-xs text-cream/40 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} ORGANIC HEAVEN. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 text-gold-400" /> by nature
          </p>
        </div>
      </div>
    </footer>
  );
}
