'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TIMELINE } from '@/lib/data';

/** Хронология войны — аккордеон в духе FAQ: строки с датами, раскрытие по клику. */
export default function Timeline() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="chronicle" className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label flex items-center gap-3">
              <span className="dot-live" /> ДВЕНАДЦАТЬ ДАТ, КОТОРЫЕ РЕШАЛИ ВСЁ
            </p>
            <motion.h2
              className="headline mt-8 text-[clamp(2.6rem,7vw,6.4rem)]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Хроника. <span className="text-smoke">1941 → 1945</span>
            </motion.h2>
          </div>
          <p className="mono-label text-smoke">/РАСКРОЙТЕ КАЖДУЮ СТРОКУ</p>
        </div>

        <div className="mt-14 border-t border-ink/15">
          {TIMELINE.map((t, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                className="border-b border-ink/15"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ delay: 0.03 * i, duration: 0.5 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8 sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span className={`mono-label hidden w-32 flex-none sm:block ${isOpen ? 'text-grass' : 'text-smoke'}`}>
                    {t.date}
                  </span>
                  <span className="headline flex-1 text-xl transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                    {t.title}
                    <span className="mono-label ml-3 align-middle text-smoke sm:hidden">{t.date}</span>
                  </span>
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center border text-lg transition-all duration-300 ${
                      isOpen ? 'rotate-45 border-grass bg-grass text-ink' : 'border-ink/25'
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4 pb-7 sm:grid-cols-[8rem_1fr] sm:gap-8 sm:pl-40">
                        <span className="mono-label text-grass sm:hidden">{t.date}</span>
                        <p className="max-w-2xl border-l-2 border-grass pl-4 text-[15px] leading-relaxed text-ink/75">
                          {t.text}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
