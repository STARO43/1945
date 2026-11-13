'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** Интро: счёт лет 1941 → 1945, затем шторка уходит вверх. */
export default function Preloader() {
  const [year, setYear] = useState(1941);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      // уважаем reduced-motion: мгновенно убираем шторку
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setGone(true);
        return;
      }
      const p = Math.min(1, (t - t0) / 1500);
      setYear(1941 + Math.round(p * 4));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setGone(true), 240);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="mono-label flex items-center gap-3 text-fog">
            <span className="dot-live" /> ХРОНИКА ОТКРЫВАЕТСЯ
          </div>
          <div className="headline mt-4 font-mono text-7xl text-paper tabular-nums sm:text-8xl">
            {year}
          </div>
          <div className="mt-6 h-px w-40 overflow-hidden bg-white/15">
            <motion.div
              className="h-full bg-grass"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
