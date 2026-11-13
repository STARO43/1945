'use client';

import { useCallback, useState } from 'react';
import { PARTS, getPart } from '@/lib/data';
import Preloader from '@/components/site/Preloader';
import Cursor from '@/components/site/Cursor';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Overview from '@/components/site/Overview';
import PartSection from '@/components/site/PartSection';
import SwarmScene from '@/components/site/SwarmScene';
import Timeline from '@/components/site/Timeline';
import Marquee from '@/components/site/Marquee';
import Footer from '@/components/site/Footer';
import Sheet from '@/components/site/Sheet';

export default function Page() {
  const [open, setOpen] = useState<{ partId: string; subId: string } | null>(null);

  const activePart = open ? getPart(open.partId) ?? null : null;
  const activeSub = activePart?.subsections.find((s) => s.id === open?.subId) ?? null;

  const handleOpen = useCallback((partId: string, subId: string) => {
    setOpen({ partId, subId });
  }, []);
  const handleClose = useCallback(() => setOpen(null), []);

  // тёмность секций частей: I светлая, III тёмная, IV светлая, V тёмная, VI светлая, VII тёмная, VIII светлая
  const darkMap: Record<string, boolean> = {
    'part-i': false,
    'part-iii': true,
    'part-iv': false,
    'part-v': true,
    'part-vi': false,
    'part-vii': true,
    'part-viii': false,
  };

  const byOrder = (n: string) => PARTS.find((p) => p.order === n)!;

  return (
    <main className="relative">
      <Preloader />
      <Cursor />
      <Header />

      <Hero />
      <Marquee />
      <Overview />

      {/* I — нападение (светлая) */}
      <PartSection part={byOrder('01')} dark={darkMap['part-i']} onOpen={handleOpen} />

      {/* сцена-переход: 1941 */}
      <SwarmScene
        id="scene-1941"
        counter="<СЦЕНА/03>"
        order="ОТ НАПАДЕНИЯ — К ВСЕНАРОДНОЙ ВОЙНЕ"
        heading="1941. Всё для фронта"
        body="Блок текста сцены. Здесь — о том, как страна за месяцы превратилась в единый военный лагерь: мобилизация, эвакуация, первый зимний контрудар."
        learn={['МОБИЛИЗАЦИЯ 5,3 МЛН ЧЕЛОВЕК', 'ЭВАКУАЦИЯ 1500 ЗАВОДОВ', 'КОНТРНАСТУПЛЕНИЕ ПОД МОСКВОЙ']}
        shape={{ kind: 'text', value: '1941' }}
      />

      {/* III — тыл (тёмная) */}
      <PartSection part={byOrder('02')} dark={darkMap['part-iii']} onOpen={handleOpen} />

      {/* IV — герои (светлая) */}
      <PartSection part={byOrder('03')} dark={darkMap['part-iv']} onOpen={handleOpen} />

      {/* V — разгром (тёмная) */}
      <PartSection part={byOrder('04')} dark={darkMap['part-v']} onOpen={handleOpen} />

      {/* сцена-переход: звезда — коренной перелом */}
      <SwarmScene
        id="scene-perelom"
        counter="<СЦЕНА/03>"
        order="КОРЕННОЙ ПЕРЕЛОМ В ВЕЛИКОЙ ОТЕЧЕСТВЕННОЙ ВОЙНЕ"
        heading="1943. Перелом"
        body="Блок текста сцены. Сталинград и Курская дуга изменили ход мировой войны: стратегическая инициатива окончательно перешла к Красной армии."
        learn={['200 ДНЕЙ НА ВОЛГЕ', 'ПРОХОРОВКА — 1200 ТАНКОВ', 'ДНЕПР — 2438 ГЕРОЕВ']}
        shape={{ kind: 'star' }}
      />

      {/* VI — единство народов (светлая) */}
      <PartSection part={byOrder('05')} dark={darkMap['part-vi']} onOpen={handleOpen} />

      {/* VII — Победа (тёмная) */}
      <PartSection part={byOrder('06')} dark={darkMap['part-vii']} onOpen={handleOpen} />

      {/* сцена-переход: 9 мая */}
      <SwarmScene
        id="scene-victory"
        counter="<СЦЕНА/03>"
        order="ОТ ЗНАМЕНИ НАД РЕЙХСТАГОМ — ДО САЛЮТА ПОБЕДЫ"
        heading="9 мая. 1945"
        body="Блок текста сцены. Акт о безоговорочной капитуляции подписан в ночь с 8 на 9 мая. Утром страна узнала: война окончена. Победа."
        learn={['ЗНАМЯ ПОБЕДЫ — 30 АПРЕЛЯ', 'КАПИТУЛЯЦИЯ — 8 МАЯ', 'ПАРАД ПОБЕДЫ — 24 ИЮНЯ']}
        shape={{ kind: 'text', value: '9 МАЯ' }}
      />

      {/* VIII — разгром Японии (светлая) */}
      <PartSection part={byOrder('07')} dark={darkMap['part-viii']} onOpen={handleOpen} />

      <Timeline />
      <Footer />

      {/* вылетающий лист для чтения */}
      <Sheet part={activePart} sub={activeSub} onClose={handleClose} />
    </main>
  );
}
