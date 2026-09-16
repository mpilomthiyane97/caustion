import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'caution-sa-cookie-notice-dismissed';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-ink text-white/90 px-4 py-4 sm:py-3">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-sm">
          We use minimal cookies to keep the site working and your cart saved. See our{' '}
          <Link to="/legal/privacy" className="underline hover:text-amber">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-ink hover:bg-amber-dark"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
