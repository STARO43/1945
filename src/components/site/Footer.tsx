'use client';

import { motion } from 'framer-motion';
import ChevronWordmark from './ChevronWordmark';
import { CREDITS_MEDIA } from '@/lib/data';

/** Финал: слово «ПОМНИМ» из шевронов, кредиты медиа-архивов, моно-подвал. */
export default function Footer() {
  return (
    <footer className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <p className="mono-label flex items-center gap-3 text-fog">
          <span className="dot-live" /> 1941 — 1945 • В ПАМЯТИ НАРОДА
        </p>

        <motion.h2
          className="headline mt-8 text-[clamp(2.8rem,8vw,7.5rem)]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Никто не забыт,
          <br />
          <span className="text-fog">ничто не забыто.</span>
        </motion.h2>

        <div className="mt-10">
          <ChevronWordmark text="1941·1945" dark className="h-[22vh] min-h-[140px] w-full opacity-90" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
          {CREDITS_MEDIA.map((c, i) => (
            <div key={i}>
              <p className="mono-label text-grass-bright">{c.label}</p>
              <ul className="mt-4 space-y-2">
                {c.items.map((it, j) => (
                  <li key={j} className="mono-label text-[10.5px] leading-relaxed text-fog">
                    &gt; {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <span className="mono-label text-fog">УЧЕБНЫЙ ИСТОРИЧЕСКИЙ ПРОЕКТ</span>
          <span className="mono-label text-fog">ФОТО И ХРОНИКА: WIKIMEDIA COMMONS (PD / CC)</span>
          <span className="mono-label text-fog">ТЕКСТЫ ДОБАВЛЯЮТСЯ АВТОРОМ</span>
        </div>
      </div>
    </footer>
  );
}
