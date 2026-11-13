'use client';

import { useEffect, useRef } from 'react';

/**
 * Гигантское слово, набранное из живых шевронов-частиц.
 * Оригинальная реализация: canvas-маска текста + анимированные «v»-глифы.
 * Реагирует на курсор (расталкивание), часть частиц — акцентные зелёные.
 */
export default function ChevronWordmark({
  text = 'ПОБЕДА',
  dark = false,
  className = '',
}: {
  text?: string;
  dark?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    type P = {
      x: number; y: number; s: number; a: number;
      phase: number; green: boolean;
    };
    let parts: P[] = [];

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const W = Math.max(320, rect.width);
      const H = Math.max(160, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // маска текста на offscreen-канве
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d')!;
      let fontSize = Math.min(W / (text.length * 0.72), H * 0.92);
      octx.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
      for (let i = 0; i < 24; i++) {
        const w = octx.measureText(text).width;
        if (w <= W * 0.96) break;
        fontSize *= (W * 0.96) / w;
        octx.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
      }
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';
      octx.fillText(text, W / 2, H / 2);

      const data = octx.getImageData(0, 0, W, H).data;
      const step = Math.max(5, Math.round(fontSize / 30));
      parts = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 120) {
            parts.push({
              x: x + (Math.random() - 0.5) * step * 0.6,
              y: y + (Math.random() - 0.5) * step * 0.6,
              s: step * (0.34 + Math.random() * 0.3),
              a: (Math.random() - 0.5) * 0.7,
              phase: Math.random() * Math.PI * 2,
              green: Math.random() < 0.055,
            });
          }
        }
      }
    };

    const draw = (t: number) => {
      if (disposed) return;
      const rect = wrap.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);
      const ink = dark ? '#efeee9' : '#0b0b0a';
      const time = t / 1000;

      for (const p of parts) {
        const wob = Math.sin(time * 1.6 + p.phase);
        let x = p.x + wob * 1.2;
        let y = p.y + Math.cos(time * 1.3 + p.phase) * 1.2;
        let a = p.a + wob * 0.35;

        // отталкивание от курсора
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1;
          const f = ((90 - d) / 90) * 26;
          x += (dx / d) * f;
          y += (dy / d) * f;
          a += (dx / d) * f * 0.04;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a);
        const s = p.s * (1 + wob * 0.08);
        ctx.strokeStyle = p.green ? '#1ec15e' : ink;
        ctx.lineWidth = Math.max(1.1, s * 0.34);
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.85);
        ctx.lineTo(0, s * 0.15);
        ctx.lineTo(s, -s * 0.85);
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    const start = () => {
      if (disposed) return;
      build();
      raf = requestAnimationFrame(draw);
    };

    // дождаться загрузки шрифта для точной маски
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    const ro = new ResizeObserver(() => { if (!disposed) build(); });
    ro.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [text, dark]);

  return (
    <div ref={wrapRef} className={`relative w-full select-none ${className}`} aria-label={text} role="img">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
// v2: particles engine
