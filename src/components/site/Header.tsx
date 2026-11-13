'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV = [
  { href: '#part-i', label: 'I' },
  { href: '#part-iii', label: 'III' },
  { href: '#part-iv', label: 'IV' },
  { href: '#part-v', label: 'V' },
  { href: '#part-vi', label: 'VI' },
  { href: '#part-vii', label: 'VII' },
  { href: '#part-viii', label: 'VIII' },
];

const SECTION_IDS = [
  'top', 'parts', 'part-i', 'scene-1941', 'part-iii', 'part-iv', 'part-v',
  'scene-perelom', 'part-vi', 'part-vii', 'scene-victory', 'part-viii', 'chronicle',
];

/** Шапка: логотип-шеврон, моно-навигация по частям, CTA. Тема подстраивается под секцию под ней. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const probeY = 40;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          const bg = getComputedStyle(el).backgroundColor;
          const m = bg.match(/\d+/g);
          if (m && m.length >= 3) {
            const [rr, gg, bb] = [Number(m[0]), Number(m[1]), Number(m[2])];
            setDark((0.299 * rr + 0.587 * gg + 0.114 * bb) / 255 < 0.5);
          }
          break;
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const box = dark
    ? 'border-white/35 text-paper hover:bg-paper hover:text-ink hover:border-paper'
    : 'border-ink/35 text-ink hover:bg-ink hover:text-paper hover:border-ink';
  const plain = dark ? 'text-paper' : 'text-ink';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
          {/* логотип */}
          <a href="#top" className="group flex items-center gap-2.5" aria-label="Наверх">
            <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">
              <path d="M2 2 L13 9 L24 2" fill="none" stroke="currentColor" strokeWidth="3.4" className={plain} />
              <path d="M2 10 L13 17 L24 10" fill="none" stroke="#1ec15e" strokeWidth="3.4" />
            </svg>
            <span className={`font-mono text-[15px] font-bold tracking-[0.14em] ${plain}`}>
              1941·1945
            </span>
          </a>

          {/* навигация — десктоп */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Части">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={`mono-label border bg-transparent px-2.5 py-1.5 transition-colors ${box}`}>
                {n.label}
              </a>
            ))}
            <a href="#chronicle" className={`mono-label border bg-transparent px-2.5 py-1.5 transition-colors ${box}`}>
              ХРОНИКА
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#chronicle"
              className={`mono-label hidden items-center gap-2 px-4 py-2.5 transition-colors sm:flex ${
                dark ? 'bg-paper text-ink hover:bg-grass' : 'bg-ink text-paper hover:bg-grass hover:text-ink'
              }`}
            >
              <span className="dot-live" /> ПОМНИМ
            </a>
            <button
              onClick={() => setOpen(true)}
              className={`mono-label flex items-center gap-2 border px-3 py-2 lg:hidden ${box}`}
              aria-label="Открыть меню"
            >
              МЕНЮ +
            </button>
          </div>
        </div>
      </header>

      {/* мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col bg-ink text-paper"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="mono-label text-fog">ОГЛАВЛЕНИЕ</span>
              <button onClick={() => setOpen(false)} className="mono-label border border-white/30 px-3 py-2" aria-label="Закрыть меню">
                ЗАКРЫТЬ ✕
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6 pb-10" aria-label="Части">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="headline border-b border-white/10 py-3 text-4xl text-paper transition-colors hover:text-grass-bright"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <span className="mono-label mr-4 align-middle text-grass-bright">&lt;{String(i + 1).padStart(2, '0')}&gt;</span>
                  Часть {n.label}
                </motion.a>
              ))}
              <motion.a
                href="#chronicle"
                onClick={() => setOpen(false)}
                className="headline border-b border-white/10 py-3 text-4xl text-paper transition-colors hover:text-grass-bright"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.48 }}
              >
                <span className="mono-label mr-4 align-middle text-grass-bright">&lt;08&gt;</span>
                Хроника
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
