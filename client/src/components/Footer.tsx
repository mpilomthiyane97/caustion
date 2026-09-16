import { Link } from 'react-router-dom';

export default function Footer() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <footer className="bg-ink text-white/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-heading font-bold text-white text-lg">Caution SA</p>
          <p className="mt-1 text-sm">Be cautious.</p>
          <p className="mt-4 text-sm">
            <a href="mailto:hello@cautionsa.co.za" className="hover:text-amber">
              hello@cautionsa.co.za
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber"
            >
              WhatsApp us
            </a>
          </p>
        </div>

        <div>
          <p className="font-semibold text-white text-sm mb-2">Shop</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/shop" className="hover:text-amber">
                All products
              </Link>
            </li>
            <li>
              <Link to="/shop?category=pepper-spray" className="hover:text-amber">
                Pepper spray
              </Link>
            </li>
            <li>
              <Link to="/shop?category=stun-gun" className="hover:text-amber">
                Stun guns
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white text-sm mb-2">Legal</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/legal/terms" className="hover:text-amber">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/legal/returns" className="hover:text-amber">
                Returns &amp; refunds
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy" className="hover:text-amber">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/legal/shipping" className="hover:text-amber">
                Shipping &amp; delivery
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} Caution SA. All rights reserved.
      </div>
    </footer>
  );
}
