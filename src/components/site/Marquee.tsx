'use client';

const ITEMS = [
  'НАПАДЕНИЕ', 'МОБИЛИЗАЦИЯ', 'МОСКВА', 'ТЫЛ', 'ЭВАКУАЦИЯ', 'ГЕРОИ',
  'СТАЛИНГРАД', 'КУРСК', 'ДНЕПР', 'БАГРАТИОН', 'ЕДИНСТВО НАРОДОВ',
  'ЯЛТА', 'БЕРЛИН', 'ЗНАМЯ ПОБЕДЫ', '9 МАЯ', 'ПАРАД', 'МАНЬЧЖУРИЯ', 'ПОБЕДА',
];

/** Бесконечная моно-бегущая строка с разделителями-шевронами. */
export default function Marquee({ dark = false }: { dark?: boolean }) {
  const row = (key: string) => (
    <div key={key} className="flex flex-none items-center">
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={`mono-label px-6 py-3 ${dark ? 'text-paper/85' : 'text-ink/80'}`}>{t}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
            <path d="M2 1.5 L8.5 6 L2 10.5" fill="none" stroke="#1ec15e" strokeWidth="2.4" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden border-y ${dark ? 'border-white/10 bg-ink' : 'border-ink/10 bg-paper'}`}>
      <div className="marquee-track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
