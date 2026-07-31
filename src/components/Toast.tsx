import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

interface Props {
  show: boolean;
  orderNumber?: string;
  onDone: () => void;
}

export default function Toast({ show, orderNumber, onDone }: Props) {
  const isError = orderNumber === '__error__';

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="fixed right-5 top-5 z-[200] w-[min(360px,calc(100vw-2.5rem))]"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
              isError
                ? 'border-red-500/40 bg-red-950/80'
                : 'border-emerald-400/40 bg-[#1f7a3d]/95'
            }`}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 10 }}
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                isError ? 'bg-red-500/30 text-red-200' : 'bg-white/20 text-white'
              }`}
            >
              {isError ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" strokeWidth={3} />}
            </motion.span>
            <div className="flex-1">
              <p className="font-medium text-white">
                {isError
                  ? 'Something went wrong. Please try again.'
                  : 'Your order has been placed successfully!'}
              </p>
              {!isError && orderNumber && (
                <p className="mt-0.5 text-sm text-white/80">
                  Order #{orderNumber}. We'll contact you soon.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
