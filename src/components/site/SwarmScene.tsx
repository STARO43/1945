'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type Shape = { kind: 'text'; value: string } | { kind: 'star' };

/**
 * Сцена-«процесс»: липкий экран, слева — текст с счётчиком, справа —
 * роевой canvas, где шевроны по мере скролла собираются в фигуру (текст или звезду)
 * с зелёным свечением. Оригинальная реализация.
 */
export default function SwarmScene({
  id,
  counter,
  heading,
  body,
  learn,
  shape,
  order,
}: {
  id: string;
  counter: string;
  heading: string;
  body: string;
  learn: string[];
  shape: Shape;
  order: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const progress = useTransform(scrollYProgress, [0.12, 0.62], [0, 1]);
  const counterNum = useTransform(
    scrollYProgress,
    (v) => `<0${Math.max(1, Math.min(3, Math.ceil(v * 3)))}/03>`,
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { sx: number; sy: number; tx: number; ty: number; s: number; phase: number; green: boolean };
    let parts: P[] = [];
    let W = 0;
    let H = 0;

    const build = () => {
      const stage = canvas.parentElement!;
      const rect = stage.getBoundingClientRect();
      W = Math.max(320, rect.width);
      H = Math.max(300, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // маска фигуры
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d')!;
      octx.fillStyle = '#fff';
      if (shape.kind === 'text') {
        let fs = Math.min(W / (shape.value.length * 0.62), H * 0.6);
        octx.font = `900 ${fs}px "Inter Tight", sans-serif`;
        for (let i = 0; i < 20; i++) {
          const w = octx.measureText(shape.value).width;
          if (w <= W * 0.9) break;
          fs *= (W * 0.9) / w;
          octx.font = `900 ${fs}px "Inter Tight", sans-serif`;
        }
        octx.textAlign = 'center';
        octx.textBaseline = 'middle';
        octx.fillText(shape.value, W / 2, H / 2);
      } else {
        // пятиконечная звезда
        const cx = W / 2, cy = H / 2 + H * 0.02, R = Math.min(W, H) * 0.42, r = R * 0.42;
        octx.beginPath();
        for (let i = 0; i < 10; i++) {
          const ang = (Math.PI / 5) * i - Math.PI / 2;
          const rad = i % 2 === 0 ? R : r;
          const x = cx + Math.cos(ang) * rad;
          const y = cy + Math.sin(ang) * rad;
          if (i === 0) {
            octx.moveTo(x, y);
          } else {
            octx.lineTo(x, y);
          }
        }
        octx.closePath();
        octx.fill();
      }

      const data = octx.getImageData(0, 0, W, H).data;
      const step = 9;
      parts = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 120) {
            parts.push({
              sx: Math.random() * W,
              sy: Math.random() * H,
              tx: x,
              ty: y,
              s: 3.2 + Math.random() * 2.6,
              phase: Math.random() * Math.PI * 2,
              green: Math.random() < 0.16,
            });
          }
        }
      }
    };

    const draw = (t: number) => {
      if (disposed) return;
      const time = t / 1000;
      const p = progress.get();
      ctx.clearRect(0, 0, W, H);

      // свечение за роем
      if (p > 0.05) {
        const g = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) * 0.42);
        g.addColorStop(0, `rgba(30,193,94,${0.16 * p})`);
        g.addColorStop(1, 'rgba(30,193,94,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      const ease = 1 - Math.pow(1 - p, 3);
      for (const q of parts) {
        const wob = Math.sin(time * 1.4 + q.phase);
        const x = q.sx + (q.tx - q.sx) * ease + (ease > 0.98 ? wob * 0.8 : 0);
        const y = q.sy + (q.ty - q.sy) * ease + (ease > 0.98 ? Math.cos(time * 1.2 + q.phase) * 0.8 : 0);
        const ang = (1 - ease) * Math.PI * 2 * (q.phase > Math.PI ? 1 : -1) + Math.PI / 2 + wob * 0.25 * ease;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.strokeStyle = q.green ? '#3ee87e' : `rgba(238,237,232,${0.35 + 0.6 * ease})`;
        ctx.lineWidth = 1.4;
        const s = q.s * (0.7 + 0.3 * ease);
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.8);
        ctx.lineTo(0, s * 0.2);
        ctx.lineTo(s, -s * 0.8);
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (disposed) return;
      build();
      raf = requestAnimationFrame(draw);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    else start();

    const ro = new ResizeObserver(() => { if (!disposed) build(); });
    ro.observe(canvas.parentElement!);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [shape, progress]);

  return (
    <section id={id} ref={wrapRef} className="relative h-[240vh] bg-ink text-paper">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          {/* левая колонка */}
          <div className="max-w-xl">
            <motion.p className="scene-counter flex items-center gap-3">
              <span>{counter}</span>
              <motion.span>{counterNum}</motion.span>
              <span className="text-grass-bright">{order}</span>
            </motion.p>
            <motion.h3
              className="headline mt-6 text-5xl text-paper sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-30%' }}
            >
              {heading}
            </motion.h3>
            <motion.p
              className="mt-6 max-w-md text-[15px] leading-relaxed text-fog"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-30%' }}
              transition={{ delay: 0.08 }}
            >
              {body}
            </motion.p>
            <motion.hr className="dotted-rule mt-8 border-fog/30" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ margin: '-30%' }} style={{ transformOrigin: 'left' }} />
            <p className="mono-label mt-5 text-fog">Вы узнаете:</p>
            <ul className="mt-3 space-y-2">
              {learn.map((li, i) => (
                <motion.li
                  key={i}
                  className="mono-label flex items-start gap-2 text-[12px] text-paper"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: '-25%' }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <span className="text-grass-bright">&gt;</span> {li}
                </motion.li>
              ))}
            </ul>
          </div>
          {/* роевой canvas */}
          <div className="relative h-[46vh] min-h-[320px] w-full lg:h-[64vh]">
            <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
