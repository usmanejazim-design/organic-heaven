import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Search,
  LogOut,
  Leaf,
  X,
  Check,
  ChevronDown,
  Smartphone,
  Building2,
  Truck,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Hash,
} from 'lucide-react';
import { fetchOrders, updateOrderStatus, type OrderRow, type OrderStatus } from '@/lib/supabase';
import { useReveal } from '@/lib/hooks';
import StatsCards from './StatsCards';
import Toast from '@/components/Toast';

const statusStyle: Record<OrderStatus, { label: string; badge: string }> = {
  pending: { label: 'Pending', badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  delivered: { label: 'Delivered', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
};

const paymentIcons: Record<string, typeof Smartphone> = {
  jazzcash: Smartphone,
  easypaisa: Smartphone,
  bank: Building2,
  cod: Truck,
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'delivered'];

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { ref, inView } = useReveal(0.05);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchOrders();
        if (!cancelled) setOrders(data);
      } catch (e) {
        if (!cancelled) setError('Could not load orders. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.order_number?.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || o.payment_method === paymentFilter;
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const created = new Date(o.created_at).getTime();
        const now = Date.now();
        const span = dateFilter === 'today' ? 86400000 : 86400000 * 7;
        matchesDate = now - created < span;
      }
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, search, statusFilter, paymentFilter, dateFilter]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const prev = orders;
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    try {
      await updateOrderStatus(id, status);
      setToast(`Order marked as ${statusStyle[status].label}`);
    } catch {
      setOrders(prev);
      setSelected((s) => (s && s.id === id ? { ...s, status: prev.find((o) => o.id === id)!.status } : s));
      setToast('__error__');
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 text-cream" ref={ref}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-gold-400/10 bg-forest-900/60 p-4 md:flex md:flex-col">
          <div className="mb-8 flex items-center gap-2 px-2">
            <Leaf className="h-6 w-6 text-gold-400" />
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] text-gold-400">OH</p>
              <p className="font-serif text-sm text-cream">ORGANIC HEAVEN</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveNav(n.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  activeNav === n.id
                    ? 'border border-gold-400/30 bg-gold-400/10 text-gold-200'
                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>
          <a
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/60 hover:bg-white/5 hover:text-cream"
          >
            <Leaf className="h-4 w-4" /> Back to Store
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Topbar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-serif text-2xl text-cream sm:text-3xl">
                  {navItems.find((n) => n.id === activeNav)?.label ?? 'Dashboard'}
                </h1>
                <p className="text-sm font-light text-cream/55">
                  Welcome back. Here's what's happening in your store.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/"
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-cream/70 hover:border-gold-400/40 hover:text-gold-200 md:hidden"
                >
                  Store
                </a>
                <button
                  onClick={onLogout}
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 md:hidden"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Stats */}
            {activeNav === 'dashboard' && (
              <div className="mb-8">
                <StatsCards orders={orders} active={inView} />
              </div>
            )}

            {/* Orders / Customers / Products */}
            {(activeNav === 'dashboard' || activeNav === 'orders') && (
              <OrdersTable
                orders={filtered}
                loading={loading}
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onSelect={setSelected}
                onStatusChange={handleStatusChange}
              />
            )}

            {activeNav === 'customers' && (
              <CustomersPanel orders={orders} onSelect={setSelected} />
            )}

            {activeNav === 'products' && <ProductsPanel orders={orders} />}

            {activeNav === 'settings' && <SettingsPanel onLogout={onLogout} />}
          </motion.div>
        </main>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end bg-forest-950/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="h-full w-full max-w-md overflow-y-auto border-l border-gold-400/20 bg-gradient-to-b from-forest-900 to-forest-950 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gold-400">ORDER DETAILS</p>
                  <h2 className="mt-1 font-serif text-2xl text-cream">
                    #{selected.order_number ?? 'N/A'}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/70 hover:border-gold-400/40 hover:text-gold-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <DetailRow icon={Hash} label="Order ID" value={selected.order_number ?? 'N/A'} />
              <DetailRow icon={ShoppingBag} label="Product" value={selected.product_name} />
              <DetailRow icon={Package} label="Quantity" value={String(selected.quantity)} />
              <DetailRow
                icon={Hash}
                label="Total"
                value={`Rs ${Number(selected.total_amount).toLocaleString()}`}
                highlight
              />
              <DetailRow
                icon={paymentIcons[selected.payment_method] ?? Smartphone}
                label="Payment Method"
                value={selected.payment_method.toUpperCase()}
              />
              {selected.payment_reference && (
                <DetailRow icon={Hash} label="Payment Ref" value={selected.payment_reference} />
              )}
              <DetailRow icon={Phone} label="Phone" value={selected.phone} />
              <DetailRow icon={MapPin} label="Address" value={selected.address} />
              <DetailRow
                icon={Calendar}
                label="Date"
                value={new Date(selected.created_at).toLocaleString()}
              />

              <div className="mt-6">
                <p className="mb-2 text-xs tracking-[0.2em] text-gold-400/80">UPDATE STATUS</p>
                <div className="flex flex-wrap gap-2">
                  {statusFlow.map((s) => {
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selected.id, s)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all ${
                          isActive
                            ? statusStyle[s].badge + ' ring-2 ring-offset-0'
                            : 'border-white/10 text-cream/60 hover:border-gold-400/40'
                        }`}
                      >
                        {statusStyle[s].label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        show={!!toast}
        orderNumber={toast === '__error__' ? '__error__' : undefined}
        onDone={() => setToast(null)}
      />
    </div>
  );
}

/* ---------- Orders Table ---------- */

function OrdersTable({
  orders,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  dateFilter,
  setDateFilter,
  onSelect,
  onStatusChange,
}: {
  orders: OrderRow[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: 'all' | OrderStatus;
  setStatusFilter: (v: 'all' | OrderStatus) => void;
  paymentFilter: 'all' | string;
  setPaymentFilter: (v: 'all' | string) => void;
  dateFilter: 'all' | 'today' | 'week';
  setDateFilter: (v: 'all' | 'today' | 'week') => void;
  onSelect: (o: OrderRow) => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  return (
    <div className="card-lux overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-white/5 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, order # or product..."
            className="input-lux pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <SelectFilter
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as 'all' | OrderStatus)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'delivered', label: 'Delivered' },
            ]}
          />
          <SelectFilter
            value={paymentFilter}
            onChange={(v) => setPaymentFilter(v as 'all' | string)}
            options={[
              { value: 'all', label: 'All Payment' },
              { value: 'jazzcash', label: 'JazzCash' },
              { value: 'easypaisa', label: 'EasyPaisa' },
              { value: 'bank', label: 'Bank' },
              { value: 'cod', label: 'COD' },
            ]}
          />
          <SelectFilter
            value={dateFilter}
            onChange={(v) => setDateFilter(v as 'all' | 'today' | 'week')}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-cream/40">
            <tr>
              <th className="px-4 py-3 font-light">Order ID</th>
              <th className="px-4 py-3 font-light">Customer</th>
              <th className="px-4 py-3 font-light">Phone</th>
              <th className="px-4 py-3 font-light">Product</th>
              <th className="px-4 py-3 font-light">Payment</th>
              <th className="px-4 py-3 font-light">Total</th>
              <th className="px-4 py-3 font-light">Status</th>
              <th className="px-4 py-3 font-light">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-cream/50">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-cream/50">
                  No orders match your filters.
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const PaymentIcon = paymentIcons[o.payment_method] ?? Smartphone;
              return (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => onSelect(o)}
                  className="cursor-pointer border-b border-white/5 transition-colors hover:bg-gold-400/5"
                >
                  <td className="px-4 py-3 font-medium text-gold-200">
                    {o.order_number ?? 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-cream/90">{o.customer_name}</td>
                  <td className="px-4 py-3 text-cream/70">{o.phone}</td>
                  <td className="px-4 py-3 text-cream/70">
                    <span className="line-clamp-1 max-w-[200px]">{o.product_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-cream/70">
                      <PaymentIcon className="h-3.5 w-3.5 text-gold-300" />
                      {o.payment_method.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-cream/90">
                    Rs {Number(o.total_amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      status={o.status}
                      onChange={(s) => onStatusChange(o.id, s)}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-cream/60">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusDropdown({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle[status].badge}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {statusStyle[status].label}
        <ChevronDown className="h-3 w-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-gold-400/20 bg-forest-900 py-1 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {statusFlow.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-gold-400/10 ${
                  status === s ? 'text-gold-200' : 'text-cream/70'
                }`}
              >
                {statusStyle[s].label}
                {status === s && <Check className="h-3 w-3" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-lux appearance-none py-2 pl-3 pr-9 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-forest-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-3">
      <span className="inline-flex items-center gap-2 text-xs text-cream/50">
        <Icon className="h-3.5 w-3.5 text-gold-400/70" />
        {label}
      </span>
      <span
        className={`max-w-[60%] text-right text-sm ${
          highlight ? 'font-serif text-lg text-gold-200' : 'text-cream/90'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------- Other panels ---------- */

function CustomersPanel({
  orders,
  onSelect,
}: {
  orders: OrderRow[];
  onSelect: (o: OrderRow) => void;
}) {
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; count: number; total: number; last: string }>();
    orders.forEach((o) => {
      const key = o.phone;
      const ex = map.get(key);
      if (ex) {
        ex.count += 1;
        ex.total += Number(o.total_amount);
        if (new Date(o.created_at) > new Date(ex.last)) ex.last = o.created_at;
      } else {
        map.set(key, {
          name: o.customer_name,
          phone: o.phone,
          count: 1,
          total: Number(o.total_amount),
          last: o.created_at,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [orders]);

  if (customers.length === 0) {
    return <EmptyState text="No customers yet." />;
  }
  return (
    <div className="card-lux overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-cream/40">
          <tr>
            <th className="px-4 py-3 font-light">Customer</th>
            <th className="px-4 py-3 font-light">Phone</th>
            <th className="px-4 py-3 font-light">Orders</th>
            <th className="px-4 py-3 font-light">Total Spent</th>
            <th className="px-4 py-3 font-light">Last Order</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.phone} className="border-b border-white/5 hover:bg-gold-400/5">
              <td className="px-4 py-3 text-cream/90">{c.name}</td>
              <td className="px-4 py-3 text-cream/70">{c.phone}</td>
              <td className="px-4 py-3 text-cream/70">{c.count}</td>
              <td className="px-4 py-3 font-medium text-gold-200">Rs {c.total.toLocaleString()}</td>
              <td className="px-4 py-3 text-xs text-cream/60">
                {new Date(c.last).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsPanel({ orders }: { orders: OrderRow[] }) {
  const stats = useMemo(() => {
    const map = new Map<string, { name: string; count: number; revenue: number }>();
    orders.forEach((o) => {
      const ex = map.get(o.product_id);
      if (ex) {
        ex.count += o.quantity;
        ex.revenue += Number(o.total_amount);
      } else {
        map.set(o.product_id, {
          name: o.product_name,
          count: o.quantity,
          revenue: Number(o.total_amount),
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [orders]);

  if (stats.length === 0) return <EmptyState text="No product sales yet." />;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((p) => (
        <div key={p.name} className="card-lux p-5">
          <Package className="h-6 w-6 text-gold-300" />
          <p className="mt-3 font-serif text-lg text-cream">{p.name}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-cream/60">Units sold</span>
            <span className="font-medium text-cream">{p.count}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-cream/60">Revenue</span>
            <span className="font-medium text-gold-200">Rs {p.revenue.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="card-lux max-w-xl p-6">
      <h3 className="font-serif text-xl text-cream">Admin Settings</h3>
      <p className="mt-1 text-sm text-cream/60">
        Manage your admin account and store preferences.
      </p>
      <div className="mt-5 space-y-3 text-sm text-cream/70">
        <div className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
          <span>Username</span>
          <span className="text-gold-200">admin</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
          <span>Currency</span>
          <span className="text-gold-200">PKR (Rs)</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
          <span>Payment methods</span>
          <span className="text-gold-200">JazzCash, EasyPaisa, Bank, COD</span>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/10"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card-lux flex flex-col items-center justify-center gap-3 p-16 text-center">
      <Clock className="h-8 w-8 text-gold-400/60" />
      <p className="text-sm text-cream/60">{text}</p>
    </div>
  );
}
