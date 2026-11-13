'use client';

import { useMemo, type ReactNode } from 'react';

type Chev = { dir: number; green: boolean; delay: number; dur: number };

function makeSeq(n: number, seed = 1): Chev[] {
  // детерминированный «случай» для стабильного гидрейта
  let s = seed * 9301;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: n }, () => ({
    dir: rnd() < 0.5 ? 0 : 180,
    green: rnd() < 0.07,
    delay: rnd() * 6,
    dur: 3.5 + rnd() * 5,
  }));
}

function ChevronGlyph({ c, dark }: { c: Chev; dark: boolean }) {
  return (
    <span
      className="inline-block"
      style={{
        transform: `rotate(${c.dir}deg)`,
        animation: `chev-flip ${c.dur}s ease-in-out ${c.delay}s infinite`,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
        <path
          d="M2 1.5 L8.5 6 L2 10.5"
          fill="none"
          stroke={c.green ? '#1ec15e' : dark ? 'rgba(238,237,232,0.85)' : 'rgba(11,11,10,0.8)'}
          strokeWidth="2.2"
        />
      </svg>
    </span>
  );
}

/**
 * Медиа-окно в живой рамке из шевронов — фирменный приём оформления кадров и хроники.
 */
export default function ChevronFrame({
  children,
  dark = true,
  seed = 7,
  className = '',
}: {
  children: ReactNode;
  dark?: boolean;
  seed?: number;
  className?: string;
}) {
  const top = useMemo(() => makeSeq(26, seed), [seed]);
  const bottom = useMemo(() => makeSeq(26, seed + 13), [seed]);
  const left = useMemo(() => makeSeq(7, seed + 5), [seed]);
  const right = useMemo(() => makeSeq(7, seed + 9), [seed]);

  return (
    <div className={`group/chev relative ${className}`}>
      {/* верх/низ */}
      <div className="pointer-events-none absolute -top-6 left-0 right-0 z-10 hidden justify-between sm:flex">
        {top.map((c, i) => (
          <ChevronGlyph key={i} c={c} dark={dark} />
        ))}
      </div>
      <div className="pointer-events-none absolute -bottom-6 left-0 right-0 z-10 hidden justify-between sm:flex">
        {bottom.map((c, i) => (
          <ChevronGlyph key={i} c={{ ...c, dir: c.dir + 180 }} dark={dark} />
        ))}
      </div>
      {/* бока */}
      <div className="pointer-events-none absolute -left-6 bottom-6 top-6 z-10 hidden flex-col justify-between sm:flex">
        {left.map((c, i) => (
          <ChevronGlyph key={i} c={{ ...c, dir: c.dir - 90 }} dark={dark} />
        ))}
      </div>
      <div className="pointer-events-none absolute -right-6 bottom-6 top-6 z-10 hidden flex-col justify-between sm:flex">
        {right.map((c, i) => (
          <ChevronGlyph key={i} c={{ ...c, dir: c.dir + 90 }} dark={dark} />
        ))}
      </div>

      {/* само окно */}
      <div className="relative overflow-hidden border border-black/15 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover/chev:-translate-y-1 dark:border-white/10">
        {children}
      </div>
    </div>
  );
}
