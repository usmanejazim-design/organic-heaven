import { useMemo } from 'react';

interface LeafParticle {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  hue: number;
}

/** Slow drifting leaf/particle layer for header & hero backgrounds. */
export default function LeafParticles({ count = 10, className = '' }: { count?: number; className?: string }) {
  const leaves = useMemo<LeafParticle[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 14 + Math.random() * 16,
      size: 8 + Math.random() * 14,
      drift: (Math.random() - 0.5) * 80,
      hue: i % 3,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {leaves.map((l, i) => (
        <span
          key={i}
          className="absolute top-[-40px] animate-leaf-drift"
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            ['--drift' as string]: `${l.drift}px`,
          }}
        >
          <svg
            width={l.size}
            height={l.size}
            viewBox="0 0 24 24"
            fill="none"
            className={
              l.hue === 0
                ? 'text-gold-400/40'
                : l.hue === 1
                ? 'text-forest-500/40'
                : 'text-gold-200/30'
            }
          >
            <path
              d="M11 20A7 7 0 0 1 4 13c0-3.5 2-6 4-8 1.6-1.6 3.4-2.7 5-3a9 9 0 0 0-1 4c0 2.5 1.5 4 3 5.5A6 6 0 0 1 11 20Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
