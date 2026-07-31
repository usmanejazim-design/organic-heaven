import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import LeafParticles from './LeafParticles';
import { useScrollY } from '@/lib/hooks';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const y = useScrollY();
  const scrolled = y > 40;
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-gold-400/15 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        {scrolled && <LeafParticles count={5} className="hidden md:block" />}
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-light tracking-wide text-cream/80 transition-colors hover:text-cream"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-gold-400 to-gold-200 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 px-4 py-2 text-xs font-medium text-gold-200 transition-all hover:border-gold-400 hover:bg-gold-400/10"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </a>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gold-400/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-cream/80 transition-colors hover:bg-gold-400/10 hover:text-cream"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/admin"
                className="mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gold-200 hover:bg-gold-400/10"
              >
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
