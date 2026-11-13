'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const fineStore = {
  subscribe(cb: () => void) {
    const mq = window.matchMedia('(pointer: fine)');
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  },
  get() {
    return window.matchMedia('(pointer: fine)').matches;
  },
};

/** Кастомный курсор: точка + догоняющее кольцо, зелёный на интерактиве. Только для мыши. */
export default function Cursor() {
  const fine = useSyncExternalStore(fineStore.subscribe, fineStore.get, () => false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add('cursor-none-desktop');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest('a, button, [data-cursor]'));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.classList.remove('cursor-none-desktop');
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-grass"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hover ? 46 : 30,
          height: hover ? 46 : 30,
          borderColor: hover ? '#1ec15e' : 'rgba(11,11,10,0.45)',
          backgroundColor: hover ? 'rgba(30,193,94,0.08)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </>
  );
}
