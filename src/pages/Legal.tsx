import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrivacyPolicy, getTermsOfService } from '../services/legalContent';
import LoadingBar from '../components/LoadingBar';
import SiteFooter from '../components/SiteFooter';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../theme/useTheme';

function Legal() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('terms');
  const [privacyText, setPrivacyText] = useState<string>('');
  const [termsText, setTermsText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const [privacy, terms] = await Promise.all([
          getPrivacyPolicy(),
          getTermsOfService(),
        ]);
        setPrivacyText(privacy);
        setTermsText(terms);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load legal documents');
        console.error('Error loading legal content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="relative min-h-screen font-sofia flex flex-col">
      {isLoading ? <LoadingBar /> : null}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <ThemeToggle isDark={isDark} onToggle={toggle} />
      </div>
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 pt-20 pb-8 sm:pt-8 max-w-4xl">
          <div className="mb-8 flex justify-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <span
                aria-hidden="true"
                className="relative block h-14 w-[184px] overflow-hidden sm:h-16 sm:w-[210px]"
              >
                <img
                  src="/wiggle-logo.png"
                  alt=""
                  className="absolute max-w-none"
                  style={{
                    left: '-18px',
                    top: '-38px',
                    width: '226px',
                    height: '124px',
                  }}
                />
              </span>
            </Link>
          </div>

          <div className="border-b border-gray-200 dark:border-[hsl(0,0%,20%)] mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 px-2 font-semibold text-base transition-colors ${
                  activeTab === 'terms'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900 dark:text-[hsl(0,0%,74%)] dark:hover:text-white'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-2 font-semibold text-base transition-colors ${
                  activeTab === 'privacy'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900 dark:text-[hsl(0,0%,74%)] dark:hover:text-white'
                }`}
              >
                Privacy Policy
              </button>
            </div>
          </div>

          <div>
            {isLoading ? null : error ? (
              <div className="bg-red-50 border border-red-200 rounded p-6 dark:bg-red-950/40 dark:border-red-900">
                <p className="text-red-700 font-semibold dark:text-red-300">Error loading document</p>
                <p className="text-red-600 text-sm mt-1 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed prose prose-sm max-w-none">
                {activeTab === 'privacy' ? privacyText : termsText}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter showLegalLink={false} />
    </div>
  );
}

export default Legal;
