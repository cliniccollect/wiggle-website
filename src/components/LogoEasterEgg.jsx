import React, { useCallback, useEffect, useRef, useState } from 'react';

// Same logo animation as the Wiggle web app login screen
// (apps/web4/src/components/logo-easter-egg.tsx).
// A static solid blue logo. A click plays the dog drawing animation.
// Every click plays it again.
//
// The static logo is one see-through image for light and dark mode.
// The videos have a white (light) or black (dark) background, so they
// blend with the page the same way the web app does.
const LOGO_ANIMATION_LIGHT = '/wiggle-logo-animation-light.mp4';
const LOGO_ANIMATION_DARK = '/wiggle-logo-animation-dark.mp4';
const LOGO = '/wiggle-logo.png';

// The video shows a 1640 x 902 drawing. The static image is the last frame
// of that drawing, in the same box. In the drawing, the word is
// 1335 x 406 at (127, 277).
const ART_W = 1640;
const ART_H = 902;
const LOGO_X = 127;
const LOGO_Y = 277;
const LOGO_W = 1335;
const LOGO_H = 406;

const GROW_AT = 5.15;
const GROW_SECONDS = 1.7;
const SETTLE_MS = 200;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export default function LogoEasterEgg({ height, drawHeight, drawOffsetY = 0, isDark = false, className = '' }) {
  const videoRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const [phase, setPhase] = useState('static'); // static | drawing | growing | settling
  const playWhenReady = useRef(false);

  // Download the video after the page loads, when the browser is idle.
  useEffect(() => {
    if (armed) return;
    let idleId;
    let timer;
    const arm = () => {
      if (window.requestIdleCallback) idleId = window.requestIdleCallback(() => setArmed(true));
      else timer = setTimeout(() => setArmed(true), 200);
    };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      window.removeEventListener('load', arm);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, [armed]);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    const started = video.play();
    const onStart = () => setPhase('drawing');
    if (started && typeof started.then === 'function') started.then(onStart).catch(() => {});
    else onStart();
  }, []);

  // The word grows when the video reaches GROW_AT.
  useEffect(() => {
    if (phase !== 'drawing') return;
    let frame = requestAnimationFrame(function check() {
      const video = videoRef.current;
      if (video && video.currentTime >= GROW_AT) {
        setPhase('growing');
        return;
      }
      frame = requestAnimationFrame(check);
    });
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'settling') return;
    const timer = setTimeout(() => setPhase('static'), SETTLE_MS + 50);
    return () => clearTimeout(timer);
  }, [phase]);

  // iPhones drop the video picture when the page goes to the background.
  // Show the static logo again so the logo never goes blank.
  useEffect(() => {
    const reset = () => {
      videoRef.current?.pause();
      setPhase('static');
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') reset();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', reset);
    window.addEventListener('pageshow', reset);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', reset);
      window.removeEventListener('pageshow', reset);
    };
  }, []);

  useEffect(() => {
    if (armed && playWhenReady.current) {
      playWhenReady.current = false;
      play();
    }
  }, [armed, play]);

  const handleClick = () => {
    if (prefersReducedMotion()) return;
    if (!armed || !videoRef.current) {
      playWhenReady.current = true;
      setArmed(true);
      return;
    }
    play();
  };

  const k = height / LOGO_H;
  const artStyle = {
    left: `${Math.round(-LOGO_X * k)}px`,
    top: `${Math.round(-LOGO_Y * k)}px`,
    width: `${Math.round(ART_W * k)}px`,
    height: `${Math.round(ART_H * k)}px`,
    transformOrigin: `${(LOGO_X + LOGO_W / 2) * k}px ${(LOGO_Y + LOGO_H / 2) * k}px`,
    transform:
      phase === 'drawing' ? `translateY(${drawOffsetY}px) scale(${drawHeight / height})` : 'none',
    transition:
      phase === 'growing' ? `transform ${GROW_SECONDS}s cubic-bezier(0.45, 0, 0.2, 1)` : 'none',
  };
  const showStatic = phase === 'static' || phase === 'settling';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Wiggle"
      className={`relative block w-full cursor-pointer rounded-md border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${className}`}
      style={{ height: `${height}px` }}
    >
      <span
        className="relative mx-auto block"
        style={{ width: `${Math.round(LOGO_W * k)}px`, height: `${height}px` }}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
          style={artStyle}
        >
          {armed ? (
            <video
              key={isDark ? 'dark' : 'light'}
              ref={videoRef}
              src={isDark ? LOGO_ANIMATION_DARK : LOGO_ANIMATION_LIGHT}
              muted
              playsInline
              preload="auto"
              onEnded={() => setPhase('settling')}
              className={`absolute inset-0 block h-full w-full object-fill ${phase === 'static' ? 'invisible' : ''}`}
            />
          ) : null}
          <img
            src={LOGO}
            alt=""
            className={`absolute inset-0 block h-full w-full ${showStatic ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: phase === 'settling' ? `opacity ${SETTLE_MS}ms linear` : 'none' }}
          />
        </span>
      </span>
    </button>
  );
}
