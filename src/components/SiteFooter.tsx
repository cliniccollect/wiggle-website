import { Link } from 'react-router-dom';

// Slim footer with no line and no background (design option 3b).
// Copyright on the left, legal link on the right.
export default function SiteFooter({ showLegalLink = true }: { showLegalLink?: boolean }) {
  return (
    <footer className="relative flex flex-col-reverse items-center gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:justify-between sm:px-8 dark:text-gray-400">
      <p className="m-0">© {new Date().getFullYear()} Wiggle Technology Inc. All rights reserved.</p>
      {showLegalLink ? (
        <Link to="/legal" className="transition-colors hover:text-brand-blue">
          Privacy Policy & Terms of Service
        </Link>
      ) : null}
    </footer>
  );
}
