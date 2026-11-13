'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PARTS } from '@/lib/data';
import ChevronFrame from './ChevronFrame';

/**
 * Обзор всех частей — как витрина работ: слева липкий нумерованный список,
 * справа — медиа-окно активной части в шевронной рамке. Синхронизация по скроллу и ховеру.
 */
export default function Overview() {
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);

  return (
    <section id="parts" className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.h2
            className="headline text-[clamp(2.6rem,7vw,6.4rem)] text-paper"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Все части —
            <br />
            <span className="text-fog">один путь к Победе</span>
          </motion.h2>
          <p className="mono-label text-fog">/ОГЛАВЛЕНИЕ • 1941 → 1945</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          {/* липкий список частей */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ul>
              {PARTS.map((p, i) => {
                const isActive = i === active;
                return (
                  <li key={p.id}>
                    <a
                      href={`#${p.id}`}
                      onMouseEnter={() => {
                        lockRef.current = true;
                        setActive(i);
                      }}
                      onMouseLeave={() => { lockRef.current = false; }}
                      onFocus={() => setActive(i)}
                      className="group flex items-baseline gap-3 py-2 sm:gap-5 sm:py-2.5"
                      aria-current={isActive}
                    >
                      <span
                        className={`mono-label w-14 flex-none transition-colors ${
                          isActive ? 'text-grass-bright' : 'text-fog/70'
                        }`}
                      >
                        &lt;{p.order}&gt;
                      </span>
                      <span
                        className={`headline text-3xl transition-all duration-300 sm:text-5xl ${
                          isActive
                            ? 'translate-x-2 text-paper'
                            : 'text-fog/45 group-hover:translate-x-2 group-hover:text-fog'
                        }`}
                      >
                        Часть {p.numeral}. {p.listTitle}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex gap-3">
              <a href="#part-i" className="btn-solid">
                <span className="dot-live" /> НАЧАТЬ ЧТЕНИЕ
              </a>
              <a href="#chronicle" className="mono-label flex items-center border border-white/30 px-5 text-paper transition-colors hover:bg-white hover:text-ink">
                ВСЯ ХРОНИКА
              </a>
            </div>
          </div>

          {/* медиа-окно активной части */}
          <div>
            <div className="relative min-h-[46vh] sm:min-h-[56vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={PARTS[active].id}
                  initial={{ opacity: 0, y: 24, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.99 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChevronFrame dark seed={3 + active}>
                    {PARTS[active].heroVideo ? (
                      <video
                        src={PARTS[active].heroMedia.src}
                        className="aspect-video w-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        data-cursor
                      />
                    ) : (
                      <img
                        src={PARTS[active].heroMedia.src}
                        alt={PARTS[active].heroMedia.caption}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                        data-cursor
                      />
                    )}
                  </ChevronFrame>
                  <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-md">
                      <p className="text-[13.5px] leading-snug text-paper/80">
                        {PARTS[active].heroMedia.caption}
                      </p>
                      <p className="mono-label mt-1.5 text-[9px] text-fog/70">
                        {PARTS[active].heroMedia.credit}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="mono-tag text-paper/80">ЧАСТЬ {PARTS[active].numeral}</span>
                      <span className="mono-tag text-grass-bright">{PARTS[active].dates}</span>
                      <span className="mono-tag text-paper/80">
                        {PARTS[active].subsections.length} ПОДРАЗДЕЛА
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
