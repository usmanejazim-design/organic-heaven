import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  Droplets,
  Sparkles,
  HeartHandshake,
  ShoppingBag,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/products';
import { useReveal } from '@/lib/hooks';
import OrderModal from './OrderModal';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  ShieldCheck,
  Droplets,
  Sparkles,
  HeartHandshake,
};

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { ref, inView } = useReveal();
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold-400/15 bg-forest-900/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-b from-forest-900 to-forest-950">
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent z-10" />
        {product.comingSoon && (
          <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-forest-950/80 px-3 py-1 text-xs font-medium tracking-wide text-gold-200 backdrop-blur">
            <Clock className="h-3 w-3" />
            COMING SOON
          </div>
        )}
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-80 w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute right-4 top-4 z-20 rounded-full border border-gold-400/30 bg-forest-950/70 px-3 py-1 text-sm font-medium text-gold-200 backdrop-blur">
          {product.comingSoon ? 'Soon' : `Rs ${product.price.toLocaleString()}`}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs tracking-[0.2em] text-gold-400/80">ORGANIC HEAVEN</p>
        <h3 className="mt-1 font-serif text-2xl text-cream">{product.shortName}</h3>
        <p className="mt-2 font-light italic text-gold-200/90">"{product.tagline}"</p>
        <p className="mt-4 text-sm font-light leading-relaxed text-cream/65">
          {product.description}
        </p>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          {product.badges.map((b, i) => {
            const Icon = iconMap[b.icon] ?? Leaf;
            return (
              <motion.span
                key={b.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.4 + i * 0.12, type: 'spring', stiffness: 220, damping: 10 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1 text-[0.7rem] text-cream/80"
              >
                <Icon className="h-3 w-3 text-gold-300" />
                {b.label}
              </motion.span>
            );
          })}
        </div>

        <div className="mt-6 flex-1" />

        {product.comingSoon ? (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full border border-gold-400/20 bg-white/5 px-7 py-3 font-medium tracking-wide text-cream/40"
          >
            <Clock className="mr-2 inline h-4 w-4" />
            Coming Soon
          </button>
        ) : (
          <button onClick={() => setOpen(true)} className="btn-gold w-full">
            <ShoppingBag className="h-4 w-4" />
            Shop Now
          </button>
        )}
      </div>

      <OrderModal
        open={open}
        onClose={() => setOpen(false)}
        preselectedProductId={product.id}
      />
    </motion.article>
  );
}
