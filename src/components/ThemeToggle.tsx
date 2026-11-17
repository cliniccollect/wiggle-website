import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Same switch as the web app sidebar (apps/web4/src/components/mode-toggle.tsx).
// On hover, the icon previews the other mode and its name slides in.
// After a click, the name stays until the mouse moves off, and shows the
// new mode.
export default function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const showDark = previewing ? !isDark : isDark;
  const icon = 'absolute inset-0 h-5 w-5 transition-all duration-300';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => {
        onToggle();
        setPreviewing(false);
      }}
      onMouseEnter={() => {
        setHovered(true);
        setPreviewing(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setPreviewing(false);
      }}
      className={`inline-flex min-h-[44px] items-center rounded-md border-0 bg-transparent px-2.5 py-2 text-sm font-medium transition-[color,gap] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
        hovered ? 'gap-2.5 text-brand-blue' : 'gap-0 text-slate-950 dark:text-white'
      }`}
    >
      <span className="relative block h-5 w-5 flex-shrink-0">
        <Sun
          aria-hidden="true"
          className={`${icon} ${showDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
        />
        <Moon
          aria-hidden="true"
          className={`${icon} ${showDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
        />
      </span>
      <span
        className={`block overflow-hidden whitespace-nowrap transition-all duration-300 ${
          hovered ? 'max-w-[60px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        {showDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
