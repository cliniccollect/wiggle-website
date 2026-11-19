import { useEffect, useState } from 'react';
import LogoEasterEgg from '../components/LogoEasterEgg';
import GlowBackdrop from '../components/GlowBackdrop';
import LoadingBar from '../components/LoadingBar';
import SiteFooter from '../components/SiteFooter';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../theme/useTheme';

function useLogoHeight() {
  const pick = () => {
    if (typeof window === 'undefined') return 96;
    if (window.matchMedia('(min-width: 1024px)').matches) return 128;
    if (window.matchMedia('(min-width: 768px)').matches) return 96;
    return 80;
  };
  const [height, setHeight] = useState(pick);

  useEffect(() => {
    const onResize = () => setHeight(pick());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return height;
}

// Shows the loading bar until the page and its images have loaded.
function usePageLoading() {
  const [loading, setLoading] = useState(() => document.readyState !== 'complete');

  useEffect(() => {
    if (!loading) return;
    const done = () => setLoading(false);
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, [loading]);

  return loading;
}

function Home() {
  const logoHeight = useLogoHeight();
  const loading = usePageLoading();
  const { isDark, toggle } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-sofia">
      <LoadingBar active={loading} />
      <GlowBackdrop isDark={isDark} />

      <div className="relative w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <ThemeToggle isDark={isDark} onToggle={toggle} />
        <a
          href="https://app.wiggle.vet"
          className="bg-brand-blue text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
        >
          Login
        </a>
      </div>

      <div className="relative container mx-auto px-6 flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 flex justify-center">
            <LogoEasterEgg
              height={logoHeight}
              drawHeight={logoHeight * 0.75}
              drawOffsetY={logoHeight * 0.0625}
              isDark={isDark}
            />
          </div>

          <div className="mb-16">
            <p className="text-lg md:text-xl text-gray-600 dark:text-[hsl(0,0%,74%)]">
              Questions? Contact us at <a href="mailto:support@wiggle.vet" className="text-brand-blue font-semibold hover:text-blue-600 transition-colors">support@wiggle.vet</a>
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default Home;
