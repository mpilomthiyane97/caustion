import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchProducts } from '../lib/api';
import { getCart, removeFromCart, updateCartQuantity } from '../lib/cart';
import { formatCents } from '../lib/format';
import type { CartLine, Product } from '../types';

interface Line {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const [lines, setLines] = useState<Line[] | null>(null);
  const [missing, setMissing] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    const cartLines: CartLine[] = getCart();
    if (cartLines.length === 0) {
      setLines([]);
      return;
    }
    fetchProducts().then((products) => {
      const bySlug = new Map(products.map((p) => [p.slug, p]));
      const resolved: Line[] = [];
      let anyMissing = false;
      for (const line of cartLines) {
        const product = bySlug.get(line.slug);
        if (product) {
          resolved.push({ product, quantity: line.quantity });
        } else {
          anyMissing = true;
        }
      }
      setMissing(anyMissing);
      setLines(resolved);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const subtotal = lines?.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0) ?? 0;

  if (lines === null) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-ink/60">Loading cart...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SEO title="Cart" description="Review your Caution SA cart." />
      <h1 className="font-heading text-2xl font-bold text-ink">Your cart</h1>

      {missing && (
        <p className="mt-3 text-sm text-amber-dark">
          One or more items in your cart are no longer available and were removed.
        </p>
      )}

      {lines.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-ink/60">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block text-amber-dark font-semibold">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-ink/10">
            {lines.map(({ product, quantity }) => (
              <li key={product.slug} className="flex items-center gap-4 py-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-sand overflow-hidden">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{product.name}</p>
                  <p className="text-sm text-ink/60">{formatCents(product.priceCents)} each</p>
                </div>
                <select
                  aria-label={`Quantity for ${product.name}`}
                  value={quantity}
                  onChange={(e) => {
                    updateCartQuantity(product.slug, Number(e.target.value));
                    load();
                  }}
                  className="rounded-lg border border-ink/20 px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <p className="w-20 text-right font-semibold text-ink">
                  {formatCents(product.priceCents * quantity)}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => {
                    removeFromCart(product.slug);
                    load();
                  }}
                  className="text-ink/40 hover:text-red-700"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
            <span className="font-medium text-ink">Subtotal</span>
            <span className="font-heading text-lg font-bold text-ink">
              {formatCents(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/50">Delivery fee is calculated at checkout.</p>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full rounded-lg bg-amber px-6 py-3 font-semibold text-ink hover:bg-amber-dark"
          >
            Proceed to checkout
          </button>
        </>
      )}
    </div>
  );
}
