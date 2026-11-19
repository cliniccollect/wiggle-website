import { useEffect, useState } from 'react';

// How long the bar stays on screen after the load ends: fill to the end, then fade.
const FINISH_MS = 450;

type Phase = 'hidden' | 'loading' | 'finishing';

// The web app loading bar: 2px, blue to pink.
// While `active`, it fills from left to right: fast at first, then slower,
// stopping short of the end. After 2 seconds it also pulses softly. When the
// load ends, it fills to the end and fades out. The motion is in index.css.
export default function LoadingBar({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<Phase>(active ? 'loading' : 'hidden');

  useEffect(() => {
    if (active) {
      setPhase('loading');
    } else {
      setPhase((current) => (current === 'loading' ? 'finishing' : current));
    }
  }, [active]);

  useEffect(() => {
    if (phase !== 'finishing') return;
    const timer = setTimeout(() => setPhase('hidden'), FINISH_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        className={`h-full bg-gradient-to-r from-brand-blue to-brand-purple ${
          phase === 'loading' ? 'loading-bar-fill' : 'loading-bar-finish'
        }`}
      />
    </div>
  );
}
