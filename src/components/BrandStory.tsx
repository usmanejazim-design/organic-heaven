import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Users } from 'lucide-react';
import { useReveal, useCountUp } from '@/lib/hooks';

const stats = [
  { label: 'Natural Ingredients', value: 100, suffix: '%', icon: Leaf },
  { label: 'Chemical Free', value: 100, suffix: '%', icon: FlaskConical },
  { label: 'For Men & Women', value: 2, suffix: 'x', icon: Users, isCount: true },
];

export default function BrandStory() {
  const { ref, inView } = useReveal(0.2);

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950 to-forest-900" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-gold-400/20 to-forest-500/10 blur-2xl" />
          <div className="relative z-10 overflow-hidden rounded-[32px] border border-gold-400/20 bg-forest-900/40 p-4 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]" style={{ aspectRatio: '4 / 5' }}>
            <img
              src="/items/hair_iteam_.jpeg"
              alt="ORGANIC HEAVEN Miracle Hair Oil"
              className="h-full w-full object-contain"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="absolute -bottom-6 -right-4 z-20 rounded-2xl border border-gold-400/30 bg-forest-950/90 px-6 py-4 backdrop-blur sm:-right-6"
          >
            <p className="font-serif text-3xl text-gold-200">Est.</p>
            <p className="text-xs tracking-[0.3em] text-cream/60">PURE NATURE</p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-gold-400"
          >
            OUR STORY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-3 font-serif text-4xl text-cream sm:text-5xl"
          >
            Where Nature Meets <span className="gold-shimmer">Beauty</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-5 text-base font-light leading-relaxed text-cream/70"
          >
            ORGANIC HEAVEN was born from a simple belief: skincare should be as pure as the
            gardens it comes from. We hand-select botanical ingredients, blend them in small
            batches, and never compromise with harsh chemicals. Every bottle carries the
            quiet luxury of nature — gentle, effective, and deeply nourishing.
          </motion.p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <Stat key={s.label} stat={s} active={inView} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  stat,
  active,
  delay,
}: {
  stat: { label: string; value: number; suffix: string; icon: typeof Leaf; isCount?: boolean };
  active: boolean;
  delay: number;
}) {
  const count = useCountUp(stat.value, active);
  const display = stat.isCount ? Math.round(count) : Math.round(count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="rounded-2xl border border-gold-400/15 bg-forest-900/60 p-4 text-center"
    >
      <stat.icon className="mx-auto h-5 w-5 text-gold-300" strokeWidth={1.5} />
      <p className="mt-2 font-serif text-3xl text-gold-200">
        {display}
        {stat.suffix}
      </p>
      <p className="mt-1 text-[0.7rem] leading-tight text-cream/60">{stat.label}</p>
    </motion.div>
  );
}
