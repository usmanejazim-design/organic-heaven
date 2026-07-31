import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const word = 'ORGANIC HEAVEN'.split(' ');

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-2.5 select-none">
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <motion.span
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Leaf
            className="h-9 w-9 text-gold-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
            strokeWidth={1.4}
          />
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-200 shadow-[0_0_8px_2px_rgba(240,200,105,0.7)]"
        />
      </span>
      <span className={`flex flex-col leading-none ${compact ? 'text-base' : 'text-lg'}`}>
        <span className="font-serif text-[0.7rem] tracking-[0.35em] text-gold-400">OH</span>
        <span className="flex overflow-hidden">
          {word.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              className="gold-shimmer inline-block font-serif text-sm font-semibold tracking-wider"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </span>
    </a>
  );
}
