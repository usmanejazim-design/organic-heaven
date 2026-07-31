import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Leaf, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { signInAdmin } from '@/lib/supabase';
import LeafParticles from '@/components/LeafParticles';

interface Props {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInAdmin(email.trim(), pass);
      onSuccess();
    } catch {
      setError('Invalid email or password');
      setTimeout(() => setError(null), 3000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-950 px-5">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/32746164/pexels-photo-32746164.jpeg?auto=compress&cs=tinysrgb&w=1600)',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/90 to-forest-950/95" />
      <LeafParticles count={12} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className={`relative w-full max-w-md rounded-3xl border border-gold-400/30 bg-gradient-to-br from-forest-900 to-forest-950 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${
          error ? 'animate-shake' : ''
        }`}
      >
        <div className="mb-7 text-center">
          <motion.span
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/5"
          >
            <Leaf className="h-7 w-7 text-gold-400" />
          </motion.span>
          <p className="text-xs tracking-[0.3em] text-gold-400">ORGANIC HEAVEN</p>
          <h1 className="mt-1 font-serif text-3xl text-cream">Admin Panel</h1>
          <p className="mt-2 text-sm font-light text-cream/55">
            Sign in to manage orders and customers
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs text-cream/60">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organicheaven.pk"
                className="input-lux pl-10"
                autoFocus
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-cream/60">Password</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/60" />
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="input-lux pl-10"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-70">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
