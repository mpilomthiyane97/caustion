import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatCents } from '../lib/format';

const categoryLabel: Record<Product['category'], string> = {
  'pepper-spray': 'Pepper spray',
  'stun-gun': 'Stun gun',
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col rounded-xl border border-ink/10 bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-sand overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/30 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs font-medium text-amber-dark uppercase tracking-wide">
          {categoryLabel[product.category]}
        </span>
        <h3 className="font-heading font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 font-semibold text-ink">{formatCents(product.priceCents)}</p>
        {!product.inStock && <span className="text-xs text-red-700">Out of stock</span>}
      </div>
    </Link>
  );
}
