'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MediaRef, SheetBlock } from '@/lib/data';

/** Один блок листа: текст-плейсхолдер, факты, статистика, фото или видео. */
function Block({ b }: { b: SheetBlock }) {
  if (b.type === 'text') {
    return (
      <div className="border border-dashed border-ink/30 bg-paper-soft p-5">
        <p className="mono-label flex items-center gap-2 text-smoke">
          <span className="text-grass">[ ТЕКСТОВЫЙ БЛОК ]</span> место для вашего текста
        </p>
        <div className="mt-3 space-y-3">
          {b.text.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink/70">{p}</p>
          ))}
        </div>
      </div>
    );
  }
  if (b.type === 'fact') {
    return (
      <div>
        <p className="mono-label text-smoke">/ФАКТЫ И ДАТЫ</p>
        <ul className="mt-3 space-y-2.5 border-l-2 border-grass pl-4">
          {b.items.map((f, i) => (
            <li key={i} className="text-[14.5px] font-medium leading-snug text-ink">{f}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (b.type === 'stats') {
    return (
      <div className="grid grid-cols-3 gap-px border border-ink/15 bg-ink/15">
        {b.items.map((s, i) => (
          <div key={i} className="bg-paper-soft px-3 py-4 text-center">
            <p className="headline font-mono text-lg text-ink sm:text-xl">{s.value}</p>
            <p className="mono-label mt-1.5 text-[9.5px] leading-tight text-smoke">{s.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (b.type === 'photo') {
    return <Figure m={b.media} />;
  }
  return <VideoBlock m={b.media} />;
}

function Figure({ m }: { m: MediaRef }) {
  return (
    <figure>
      <div className="relative border border-ink/15 bg-ink">
        <img src={m.src} alt={m.caption} className="h-auto w-full object-cover" loading="lazy" />
        <span className="mono-label absolute left-3 top-3 bg-ink/85 px-2 py-1 text-white">КАДР ХРОНИКИ</span>
      </div>
      <figcaption className="mt-2.5">
        <p className="text-[13.5px] font-medium leading-snug text-ink">{m.caption}</p>
        <p className="mono-label mt-1 text-[9.5px] text-smoke">{m.credit}</p>
      </figcaption>
    </figure>
  );
}

function VideoBlock({ m }: { m: MediaRef }) {
  return (
    <figure>
      <div className="relative border border-ink/15 bg-ink">
        <video
          src={m.src}
          className="h-auto w-full"
          controls
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="mono-label pointer-events-none absolute left-3 top-3 bg-grass px-2 py-1 text-ink">КИНОХРОНИКА</span>
      </div>
      <figcaption className="mt-2.5">
        <p className="text-[13.5px] font-medium leading-snug text-ink">{m.caption}</p>
        <p className="mono-label mt-1 text-[9.5px] text-smoke">{m.credit}</p>
      </figcaption>
    </figure>
  );
}

/**
 * «Вылетающий лист для чтения» — панель-газета, выезжающая справа.
 * Внутри: мета, заголовок, блоки текста (под вставку автором), факты, медиа.
 */
export default function Sheet({
  part,
  sub,
  onClose,
}: {
  part: { numeral: string; theme: string } | null;
  sub: { id: string; title: string; meta: string; blocks: SheetBlock[] } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!sub) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [sub, onClose]);

  return (
    <AnimatePresence>
      {sub && part && (
        <>
          <motion.button
            aria-label="Закрыть лист"
            className="fixed inset-0 z-[75] bg-ink/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key={sub.id}
            className="fixed bottom-0 right-0 top-0 z-[80] w-full max-w-[680px] border-l-4 border-grass bg-paper shadow-[-40px_0_90px_rgba(0,0,0,0.45)]"
            initial={{ x: '104%' }}
            animate={{ x: 0 }}
            exit={{ x: '104%' }}
            transition={{ type: 'spring', stiffness: 210, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={sub.title}
          >
            <div className="flex h-full flex-col">
              {/* шапка листа */}
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
                <p className="mono-label flex items-center gap-2.5 text-smoke">
                  <span className="dot-live" /> ЧАСТЬ {part.numeral} — {part.theme}
                </p>
                <button
                  onClick={onClose}
                  className="mono-label border border-ink/25 px-3 py-2 text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  ЗАКРЫТЬ ✕
                </button>
              </div>

              {/* содержимое листа */}
              <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-9">
                <p className="mono-label text-grass">{sub.meta}</p>
                <h3 className="headline mt-3 text-4xl text-ink sm:text-[2.6rem]">{sub.title}</h3>
                <hr className="dotted-rule mt-6" />
                <div className="mt-6 space-y-6 pb-10">
                  {sub.blocks.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                  <p className="mono-label border border-dashed border-ink/25 px-4 py-3 text-[10px] leading-relaxed text-smoke">
                    &gt; ТЕКСТ ЭТОГО ЛИСТА БУДЕТ ДОБАВЛЕН АВТОРОМ ПРОЕКТА. ЗАГОЛОВКИ, МЕТА-ДАННЫЕ, ФАКТЫ И МЕДИА УЖЕ РАЗМЕЩЕНЫ.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
