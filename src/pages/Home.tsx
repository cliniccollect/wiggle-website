import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoEasterEgg from '../components/LogoEasterEgg';

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

function Home() {
  const logoHeight = useLogoHeight();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sofia">
      {/* Header with Login Button */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex justify-end">
        <a
          href="https://app.wiggle.vet"
          className="bg-brand-blue text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
        >
          Login
        </a>
      </div>

      <div className="container mx-auto px-6 flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 flex justify-center">
            <LogoEasterEgg
              height={logoHeight}
              drawHeight={logoHeight * 0.75}
              drawOffsetY={logoHeight * 0.0625}
            />
          </div>

          {/* Contact Section */}
          <div className="mb-16">
            <p className="text-lg md:text-xl text-gray-600">
              Questions? Contact us at <a href="mailto:support@wiggle.vet" className="text-brand-blue font-semibold hover:text-blue-600 transition-colors">support@wiggle.vet</a>
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <Link to="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy & Terms of Service
              </Link>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Wiggle Technology Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
