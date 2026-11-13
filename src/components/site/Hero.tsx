'use client';

import { motion } from 'framer-motion';
import ChevronWordmark from './ChevronWordmark';

/** Первый экран: светлая бумага, монолейблы, слово «ПОБЕДА» из шевронов, заголовок. */
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col bg-paper text-ink">
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-5 pt-24 sm:px-8">
        {/* верхняя моно-строка */}
        <div className="flex items-center justify-between gap-3">
          <span className="mono-label bg-ink px-2.5 py-1.5 text-white">ВЕЛИКАЯ ОТЕЧЕСТВЕННАЯ ВОЙНА</span>
          <span className="mono-label hidden text-smoke sm:block">1418 ДНЕЙ И НОЧЕЙ</span>
        </div>

        {/* слово из частиц */}
        <div className="relative mt-8 flex flex-1 items-center sm:mt-10">
          <ChevronWordmark text="ПОБЕДА" className="h-[38vh] min-h-[220px] w-full sm:h-[46vh]" />
        </div>

        {/* заголовок + кнопки */}
        <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <motion.h1
            className="headline text-[clamp(2rem,5.4vw,4.6rem)]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Серьёзная история —{' '}
            <span className="text-grass">живой язык.</span>
            <br />
            Хроника подвига народа:
            <br />
            от нападения — до Победы.
          </motion.h1>

          <motion.div
            className="flex flex-col items-start gap-6 lg:items-end"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mono-label text-smoke">/ХРОНИКА СОБЫТИЙ 1941–1945</p>
            <div className="flex flex-wrap gap-3">
              <a href="#part-i" className="btn-solid">
                <span className="dot-live" /> ЧИТАТЬ ЧАСТЬ I
              </a>
              <a href="#chronicle" className="btn-ghost">
                ХРОНИКА ВОЙНЫ
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* нижняя моно-полоса */}
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 sm:px-8">
          <span className="mono-label text-smoke">22.06.1941 — 02.09.1945</span>
          <span className="mono-label hidden items-center gap-2 text-smoke md:flex">
            <span className="dot-live" /> 7 ЧАСТЕЙ • 34 ПОДРАЗДЕЛА • ЛИСТЫ ДЛЯ ЧТЕНИЯ
          </span>
          <span className="mono-label text-smoke">СССР • ЕВРОПА • АЗИЯ</span>
        </div>
      </div>
    </section>
  );
}
