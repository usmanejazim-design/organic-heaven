import { motion } from 'framer-motion';
import { ShoppingBag, Clock, DollarSign, Package, type LucideIcon } from 'lucide-react';
import { useCountUp } from '@/lib/hooks';
import type { OrderRow } from '@/lib/supabase';

interface Props {
  orders: OrderRow[];
  active: boolean;
}

export default function StatsCards({ orders, active }: Props) {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const revenue = orders
    .filter((o) => o.status !== 'pending')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  const cards: {
    label: string;
    value: number;
    icon: LucideIcon;
    format: (v: number) => string;
  }[] = [
    { label: 'Total Orders', value: total, icon: ShoppingBag, format: (v) => Math.round(v).toString() },
    { label: 'Pending Orders', value: pending, icon: Clock, format: (v) => Math.round(v).toString() },
    {
      label: 'Confirmed Revenue',
      value: revenue,
      icon: DollarSign,
      format: (v) => 'Rs ' + Math.round(v).toLocaleString(),
    },
    { label: 'Delivered', value: delivered, icon: Package, format: (v) => Math.round(v).toString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, i) => (
        <StatCard key={c.label} card={c} active={active} delay={i * 0.1} />
      ))}
    </div>
  );
}

function StatCard({
  card,
  active,
  delay,
}: {
  card: { label: string; value: number; icon: LucideIcon; format: (v: number) => string };
  active: boolean;
  delay: number;
}) {
  const count = useCountUp(card.value, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="card-lux relative overflow-hidden p-5"
    >
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gold-400/10 blur-2xl" />
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/5 text-gold-300">
        <card.icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <p className="mt-3 font-serif text-2xl text-cream sm:text-3xl">{card.format(count)}</p>
      <p className="mt-1 text-xs font-light text-cream/55">{card.label}</p>
    </motion.div>
  );
}
