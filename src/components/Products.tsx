import { motion } from 'framer-motion';
import { useReveal } from '@/lib/hooks';
import { products } from '@/lib/products';
import ProductCard from './ProductCard';

export default function Products() {
  const { ref, inView } = useReveal();

  return (
    <section id="products" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-gold-400"
          >
            OUR COLLECTION
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-3 font-serif text-4xl text-cream sm:text-5xl"
          >
            Crafted by <span className="gold-shimmer">Nature</span>, Refined for You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 text-sm font-light text-cream/60 sm:text-base"
          >
            Three signature formulations — herbal soap, glow face mask, and miracle hair oil —
            each made with carefully sourced botanical ingredients.
          </motion.p>
        </div>

        <div
          ref={ref}
          className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
