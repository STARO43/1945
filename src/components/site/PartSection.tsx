'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Part } from '@/lib/data';
import ChevronFrame from './ChevronFrame';

/** Широкое медиа-окно внутри части: фото или видеокадр в шевронной рамке. */
function PartMedia({ part }: { part: Part }) {
  if (part.heroVideo) {
    return (
      <ChevronFrame dark seed={11}>
        <div className="relative">
          <video
            src={part.heroMedia.src}
            className="aspect-video w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
          <span className="mono-label absolute left-4 top-4 z-10 bg-grass px-2.5 py-1.5 text-ink">
            КИНОХРОНИКА
          </span>
        </div>
      </ChevronFrame>
    );
  }
  return (
    <ChevronFrame dark seed={11}>
      <div className="relative">
        <img
          src={part.heroMedia.src}
          alt={part.heroMedia.caption}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
        <span className="mono-label absolute left-4 top-4 z-10 bg-paper px-2.5 py-1.5 text-ink">
          КАДР ХРОНИКИ
        </span>
      </div>
    </ChevronFrame>
  );
}

/**
 * Секция одной части: моно-метка, крупный заголовок, вводный блок, статистика,
 * медиа-окно и список подразделов — строк-«листов», открывающихся для чтения.
 */
export default function PartSection({
  part,
  dark,
  onOpen,
}: {
  part: Part;
  dark: boolean;
  onOpen: (partId: string, subId: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id={part.id} className={`relative ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>
      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32">
        {/* метка части */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label flex items-center gap-3">
            <span className="dot-live" /> ЧАСТЬ {part.numeral} • {part.theme}
          </p>
          <span className="mono-tag text-grass">{part.dates}</span>
        </div>

        {/* заголовок */}
        <motion.h2
          className="headline mt-8 text-[clamp(2.6rem,7vw,6.4rem)]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {part.title}
          <br />
          <span className={dark ? 'text-fog' : 'text-smoke'}>{part.titleAccent}</span>
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          {/* левая колонка: вводный текст + статистика */}
          <div>
            <motion.p
              className="max-w-lg border border-dashed border-current/25 p-5 text-[15.5px] leading-relaxed opacity-70"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7 }}
            >
              {part.intro}
            </motion.p>
            <div className="mt-8 grid grid-cols-3 gap-px bg-current/15">
              {part.stats.map((s, i) => (
                <motion.div
                  key={i}
                  className={`px-4 py-5 ${dark ? 'bg-ink' : 'bg-paper'}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i, duration: 0.6 }}
                >
                  <p className="headline font-mono text-xl sm:text-2xl">{s.value}</p>
                  <p className={`mono-label mt-2 text-[9.5px] leading-tight ${dark ? 'text-fog' : 'text-smoke'}`}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className={`mono-label mt-8 hidden lg:block ${dark ? 'text-fog' : 'text-smoke'}`}>
              &gt; ВЫБЕРИТЕ ПОДРАЗДЕЛ — ОТКРОЕТСЯ ЛИСТ ДЛЯ ЧТЕНИЯ
            </p>
          </div>

          {/* правая колонка: медиа-окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <PartMedia part={part} />
            <div className="mt-7 flex items-start justify-between gap-4">
              <p className="max-w-sm text-[13px] leading-snug text-current/75">{part.heroMedia.caption}</p>
              <p className="mono-label hidden max-w-[180px] text-right text-[9px] leading-relaxed text-current/50 sm:block">
                {part.heroMedia.credit}
              </p>
            </div>
          </motion.div>
        </div>

        {/* список подразделов */}
        <div className="mt-16 border-t border-current/15">
          {part.subsections.map((s, i) => {
            const active = hovered === s.id;
            return (
              <motion.button
                key={s.id}
                onClick={() => onOpen(part.id, s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="group flex w-full items-center gap-4 border-b border-current/15 py-5 text-left transition-colors sm:gap-7 sm:py-6"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: 0.04 * i, duration: 0.55 }}
                aria-haspopup="dialog"
              >
                <span className={`mono-label w-12 flex-none ${active ? 'text-grass' : dark ? 'text-fog' : 'text-smoke'}`}>
                  &lt;{String(i + 1).padStart(2, '0')}&gt;
                </span>
                <span
                  className={`headline flex-1 text-2xl transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl ${
                    active ? '' : dark ? 'text-paper' : 'text-ink'
                  }`}
                >
                  {s.title}
                </span>
                <span className={`mono-label hidden flex-none text-[10px] md:block ${dark ? 'text-fog' : 'text-smoke'}`}>
                  {s.meta}
                </span>
                <span
                  className={`flex h-9 w-9 flex-none items-center justify-center border text-sm transition-all duration-300 ${
                    active
                      ? 'rotate-45 border-grass bg-grass text-ink'
                      : dark
                        ? 'border-white/25 text-paper'
                        : 'border-ink/25 text-ink'
                  }`}
                  aria-hidden
                >
                  ↗
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* нижняя строка части */}
        <div className={`mt-6 flex items-center justify-between ${dark ? 'text-fog' : 'text-smoke'}`}>
          <span className="mono-label">ЧАСТЬ {part.numeral} • ПОДРАЗДЕЛОВ: {part.subsections.length}</span>
          <span className="mono-label hidden sm:block">ЛИСТЫ ДЛЯ ЧТЕНИЯ ↓</span>
        </div>
      </div>
    </section>
  );
}
