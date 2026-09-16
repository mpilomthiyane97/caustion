import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchProduct } from '../lib/api';
import { addToCart } from '../lib/cart';
import { formatCents } from '../lib/format';
import type { Product } from '../types';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setError(null);
    fetchProduct(slug).catch(() => setError('Product not found.')).then((p) => {
      if (p) setProduct(p);
    });
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink/70">{error}</p>
        <Link to="/shop" className="mt-4 inline-block text-amber-dark font-semibold">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-ink/60">Loading...</div>;
  }

  const handleAdd = () => {
    addToCart(product.slug, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SEO title={product.name} description={product.description} />

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl bg-sand overflow-hidden">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-ink">{formatCents(product.priceCents)}</p>
          <p className="mt-4 text-ink/80 leading-relaxed">{product.description}</p>

          {Object.keys(product.specs).length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-ink/50">{key}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.inStock ? (
            <div className="mt-6 flex items-center gap-3">
              <label htmlFor="quantity" className="sr-only">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-lg border border-ink/20 px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 rounded-lg bg-amber px-6 py-3 font-semibold text-ink hover:bg-amber-dark"
              >
                {added ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-sand px-4 py-3 text-sm text-ink/70">
              This product is currently out of stock.
            </p>
          )}

          <p className="mt-6 text-xs text-ink/50">
            For lawful self-defence use by adults (18+).
          </p>
        </div>
      </div>
    </div>
  );
}
