import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cartItemCount } from '../lib/cart';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
    isActive ? 'border-amber text-ink' : 'border-transparent text-ink/70 hover:text-ink'
  }`;

export default function Header() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartItemCount());
    update();
    window.addEventListener('cart-updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-amber font-heading font-bold">
            C
          </span>
          <span className="font-heading font-bold text-lg text-ink">Caution SA</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-5">
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <Link
          to="/cart"
          aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-sand"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="18" cy="20" r="1.4" fill="currentColor" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-semibold text-ink">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
