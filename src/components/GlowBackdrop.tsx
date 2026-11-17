import { useEffect, useRef } from 'react';

// Two soft corner glows, blue (top left) and violet (bottom right).
// They follow the mouse. When the mouse stops for 3 seconds, they glide
// into a slow 10 second drift. People who turn on "reduce motion" get
// still glows.
const BLUE = '1, 122, 254';
const VIOLET = '255, 0, 255';
const REST = { x: 0.5, y: 0.42 };
const FOLLOW = 0.5; // how far the glows move with the mouse
const IDLE_MS = 3000; // wait after the last mouse move
const BLEND_MS = 3000; // time to glide from the mouse into the drift
const LOOP_S = 10; // one drift loop
const TICK_MS = 100;

// Glow sizes on the 1280 x 800 design. They scale with the window.
const DESIGN_W = 1280;
const DESIGN_H = 800;

function driftAt(seconds: number) {
  const a = (seconds * 2 * Math.PI) / LOOP_S;
  return {
    x: 0.5 + 0.48 * Math.sin(a),
    y: 0.42 + 0.18 * Math.sin(a * 2 + Math.PI / 2) + 0.18 * Math.cos(a),
  };
}

export default function GlowBackdrop({ isDark }: { isDark: boolean }) {
  const blueRef = useRef<HTMLDivElement>(null);
  const violetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blue = blueRef.current;
    const violet = violetRef.current;
    if (!blue || !violet) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const boost = isDark ? 0.85 : 1;
    const start = performance.now();
    let pos = { ...REST };
    let lastMove = performance.now();
    let blendStart: number | null = null;
    let from = { ...REST };

    const draw = (drifting: boolean) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = Math.max(w / DESIGN_W, h / DESIGN_H);
      const dx = pos.x - REST.x;
      const dy = pos.y - REST.y;
      const a1 = (0.3 + Math.max(0, -dx) * 0.24 + Math.max(0, -dy) * 0.12) * boost;
      const a2 = (0.22 + Math.max(0, dx) * 0.24 + Math.max(0, dy) * 0.12) * boost;
      const ease = drifting ? `${TICK_MS * 1.5}ms linear` : '0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
      const place = (el: HTMLDivElement, size: number, gx: number, gy: number, rgb: string, alpha: number) => {
        const s = size * scale;
        el.style.width = `${s}px`;
        el.style.height = `${s}px`;
        el.style.transform = `translate(${gx * w - s / 2}px, ${gy * h - s / 2}px)`;
        el.style.background = `radial-gradient(closest-side, rgba(${rgb}, ${alpha}), rgba(${rgb}, 0))`;
        el.style.transition = `transform ${ease}`;
      };
      place(blue, 960, dx * FOLLOW, dy * FOLLOW, BLUE, a1);
      place(violet, 1040, 1 + dx * FOLLOW, 0.85 + dy * FOLLOW, VIOLET, a2);
    };

    const onMove = (e: MouseEvent) => {
      lastMove = performance.now();
      blendStart = null;
      pos = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      draw(false);
    };
    const onLeave = () => {
      lastMove = performance.now();
      blendStart = null;
      pos = { ...REST };
      draw(false);
    };
    const onResize = () => draw(false);

    draw(false);
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    let timer: number | undefined;
    if (!still) {
      timer = window.setInterval(() => {
        const now = performance.now();
        if (now - lastMove < IDLE_MS) return;
        if (blendStart === null) {
          blendStart = now;
          from = { ...pos };
        }
        const target = driftAt((now - start) / 1000);
        const t = Math.min(1, (now - blendStart) / BLEND_MS);
        const e = t * t * (3 - 2 * t);
        pos = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e };
        draw(true);
      }, TICK_MS);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [isDark]);

  const glow = 'pointer-events-none absolute left-0 top-0 will-change-transform';
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div ref={blueRef} className={glow} />
      <div ref={violetRef} className={glow} />
    </div>
  );
}
