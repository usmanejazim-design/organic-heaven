import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  Droplets,
  Sparkles,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import { useReveal } from '@/lib/hooks';

const features: { label: string; icon: LucideIcon }[] = [
  { label: '100% Organic & Pure', icon: Leaf },
  { label: 'Natural Ingredients', icon: Sparkles },
  { label: 'Deep Cleansing', icon: Droplets },
  { label: 'Brightens Skin', icon: ShieldCheck },
  { label: 'Safe for All Skin Types', icon: HeartHandshake },
];

export default function FeaturesBar() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="relative border-y border-gold-400/10 bg-forest-950/60 py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/5 text-gold-300">
                <f.icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="text-xs font-light tracking-wide text-cream/80 sm:text-sm">
                {f.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
