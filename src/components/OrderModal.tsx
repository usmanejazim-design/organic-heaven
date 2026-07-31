import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Building2, Truck, Check, Loader2, ShoppingBag } from 'lucide-react';
import { products, paymentMethods, paymentAccounts, getProduct } from '@/lib/products';
import { placeOrder, type PaymentMethod } from '@/lib/supabase';
import Toast from './Toast';

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

interface FormState {
  name: string;
  phone: string;
  address: string;
  productId: string;
  quantity: number;
  payment: PaymentMethod;
  reference: string;
}

const orderableProducts = products.filter((p) => !p.comingSoon);

const initial: FormState = {
  name: '',
  phone: '',
  address: '',
  productId: orderableProducts[0].id,
  quantity: 1,
  payment: 'jazzcash',
  reference: '',
};

const paymentIcon: Record<PaymentMethod, typeof Smartphone> = {
  jazzcash: Smartphone,
  easypaisa: Smartphone,
  bank: Building2,
  cod: Truck,
};

export default function OrderModal({ open, onClose, preselectedProductId }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ orderNumber: string } | null>(null);

  useEffect(() => {
    if (open && preselectedProductId) {
      setForm((f) => ({ ...f, productId: preselectedProductId, quantity: 1 }));
      setErrors({});
    }
  }, [open, preselectedProductId]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const selected = getProduct(form.productId)!;
  const total = useMemo(() => selected.price * form.quantity, [selected, form.quantity]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, boolean>> = {};
    if (!form.name.trim()) next.name = true;
    if (!/^\d{10,15}$/.test(form.phone.replace(/[\s-]/g, ''))) next.phone = true;
    if (form.address.trim().length < 8) next.address = true;
    if (form.quantity < 1) next.quantity = true;
    if (form.payment !== 'cod' && form.reference.trim().length < 4) next.reference = true;
    setErrors(next);
    setShakeKey((k) => k + 1);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { orderNumber } = await placeOrder({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        product_id: selected.id,
        product_name: selected.name,
        quantity: form.quantity,
        unit_price: selected.price,
        total_amount: total,
        payment_method: form.payment,
        payment_reference: form.payment === 'cod' ? null : form.reference.trim(),
      });
      setToast({ orderNumber: orderNumber ?? 'N/A' });
      setForm(initial);
      onClose();
    } catch (err) {
      setToast({ orderNumber: '__error__' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-forest-950/80 p-4 backdrop-blur-sm sm:items-center"
            onClick={onClose}
          >
            <motion.div
              key={shakeKey}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative my-8 w-full max-w-2xl rounded-3xl border border-gold-400/30 bg-gradient-to-br from-forest-900 to-forest-950 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/70 transition-all hover:border-gold-400/40 hover:text-gold-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6">
                <p className="text-xs tracking-[0.3em] text-gold-400">CHECKOUT</p>
                <h3 className="mt-1 font-serif text-3xl text-cream">Place Your Order</h3>
                <p className="mt-2 text-sm font-light text-cream/60">
                  Fill in your details and choose a payment method. We'll confirm by phone.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer details */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name" error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className={`input-lux ${errors.name ? 'animate-shake border-red-500/70' : ''}`}
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      className={`input-lux ${errors.phone ? 'animate-shake border-red-500/70' : ''}`}
                    />
                  </Field>
                </div>

                <Field label="Complete Address" error={errors.address}>
                  <textarea
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    rows={2}
                    placeholder="House #, Street, City"
                    className={`input-lux resize-none ${errors.address ? 'animate-shake border-red-500/70' : ''}`}
                  />
                </Field>

                {/* Product & quantity */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Product" className="sm:col-span-2">
                    <select
                      value={form.productId}
                      onChange={(e) => update('productId', e.target.value)}
                      className="input-lux"
                    >
                      {orderableProducts.map((p) => (
                        <option key={p.id} value={p.id} className="bg-forest-900">
                          {p.shortName} — Rs {p.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Quantity">
                    <select
                      value={form.quantity}
                      onChange={(e) => update('quantity', Number(e.target.value))}
                      className="input-lux"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n} className="bg-forest-900">
                          {n}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Payment methods */}
                <div>
                  <p className="mb-3 text-xs tracking-[0.2em] text-gold-400">PAYMENT METHOD</p>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((m) => {
                      const Icon = paymentIcon[m.id];
                      const active = form.payment === m.id;
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => update('payment', m.id)}
                          className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                            active
                              ? 'border-gold-400 bg-gold-400/10 shadow-[0_0_0_3px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 hover:border-gold-400/40'
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              active ? 'bg-gold-400 text-forest-900' : 'bg-white/5 text-gold-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-medium text-cream">{m.label}</span>
                            <span className="text-[0.7rem] font-light text-cream/50">
                              {m.subtitle}
                            </span>
                          </span>
                          {active && (
                            <motion.span
                              layoutId="pay-glow"
                              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-forest-900"
                            >
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </motion.span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment details / account info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={form.payment}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {form.payment !== 'cod' && (
                      <div className="rounded-xl border border-gold-400/15 bg-ink/40 p-4">
                        <p className="mb-3 text-xs tracking-[0.2em] text-gold-400/80">
                          SEND PAYMENT TO
                        </p>
                        <div className="space-y-1.5">
                          {paymentAccounts[form.payment].map((acc) => (
                            <div
                              key={acc.label}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="text-cream/50">{acc.label}</span>
                              <span className="font-medium text-gold-200">{acc.merchant}</span>
                            </div>
                          ))}
                        </div>
                        <Field label="Payment Reference / Sender Number" error={errors.reference} className="mt-4">
                          <input
                            type="text"
                            value={form.reference}
                            onChange={(e) => update('reference', e.target.value)}
                            placeholder="Transaction ID or your sender number"
                            className={`input-lux ${errors.reference ? 'animate-shake border-red-500/70' : ''}`}
                          />
                        </Field>
                      </div>
                    )}
                    {form.payment === 'cod' && (
                      <div className="rounded-xl border border-gold-400/15 bg-ink/40 p-4 text-sm text-cream/70">
                        Pay <span className="font-medium text-gold-200">Rs {total.toLocaleString()}</span> in cash
                        when your order is delivered to your door.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Summary */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-cream/70">Order Total</span>
                  <span className="font-serif text-2xl text-gold-200">
                    Rs {total.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full animate-pulse-glow disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Confirm Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        show={!!toast}
        orderNumber={toast?.orderNumber}
        onDone={() => setToast(null)}
      />
    </>
  );
}

function Field({
  label,
  error,
  className = '',
  children,
}: {
  label: string;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`mb-1.5 block text-xs tracking-wide ${error ? 'text-red-400' : 'text-cream/60'}`}>
        {label}
      </span>
      {children}
    </label>
  );
}
