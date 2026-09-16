import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';
import type { Category, Product } from '../types';

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All products' },
  { value: 'pepper-spray', label: 'Pepper spray' },
  { value: 'stun-gun', label: 'Tasers' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category | null) ?? 'all';

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SEO title="Shop" description="Browse pepper spray and tasers for everyday safety." />
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink">Shop</h1>

      <div className="mt-5 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() =>
              cat.value === 'all'
                ? setSearchParams({})
                : setSearchParams({ category: cat.value })
            }
            className={`rounded-full px-4 py-2 text-sm font-medium border ${
              activeCategory === cat.value
                ? 'bg-ink text-white border-ink'
                : 'border-ink/20 text-ink hover:bg-sand'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-ink/60">Loading products...</p>}
      {error && <p className="mt-8 text-red-700">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="mt-8 text-ink/60">No products found in this category.</p>
      )}

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
