import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrivacyPolicy, getTermsOfService } from '../services/legalContent';

function Legal() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('terms');
  const [privacyText, setPrivacyText] = useState<string>('');
  const [termsText, setTermsText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-white font-sofia flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
          <div className="mb-8 flex justify-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <span
                aria-hidden="true"
                className="relative block h-14 w-[184px] overflow-hidden sm:h-16 sm:w-[210px]"
              >
                <img
                  src="/wiggle-logo-drawn-light.png"
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

          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 px-2 font-semibold text-base transition-colors ${
                  activeTab === 'terms'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-2 font-semibold text-base transition-colors ${
                  activeTab === 'privacy'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
                }`}
              >
                Privacy Policy
              </button>
            </div>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded p-6">
                <p className="text-red-700 font-semibold">Error loading document</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed prose prose-sm max-w-none">
                {activeTab === 'privacy' ? privacyText : termsText}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Wiggle Technology Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Legal;
