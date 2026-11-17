// The web app loading bar: 2px, blue to violet, with a slow pulse.
export default function LoadingBar() {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-gradient-to-r from-brand-blue to-brand-purple"
    >
      <div className="h-full animate-pulse bg-gradient-to-r from-brand-blue to-brand-purple" />
    </div>
  );
}
