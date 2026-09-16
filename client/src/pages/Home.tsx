import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';
import type { Product } from '../types';

const safetyTips = [
  'Carry your device somewhere you can reach it in under two seconds — a jacket pocket or bag pocket you use often, not the bottom of your bag.',
  'Practice the safety catch at home so it is second nature before you ever need to use it.',
  'Share your live location with someone you trust when walking or taking a lift alone at night.',
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <SEO
        title="Home"
        description="Pepper spray and stun guns for everyday safety, delivered via Uber across Gauteng."
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold">Caution SA</h1>
          <p className="mt-3 text-lg sm:text-xl text-amber font-heading font-semibold">
            Be cautious.
          </p>
          <p className="mt-5 max-w-xl mx-auto text-white/80">
            Practical self-defence tools for everyday life, chosen to be simple to carry and easy
            to use — starting with women across the East Rand and greater Gauteng.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/shop"
              className="rounded-lg bg-amber px-6 py-3 font-semibold text-ink hover:bg-amber-dark"
            >
              Shop now
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid sm:grid-cols-2 gap-4">
        <Link
          to="/shop?category=pepper-spray"
          className="rounded-xl bg-sand p-8 hover:shadow-md transition-shadow"
        >
          <h2 className="font-heading text-xl font-bold text-ink">Pepper spray</h2>
          <p className="mt-2 text-ink/70 text-sm">
            Compact, keyring and home-sized options for quick, confident reach.
          </p>
          <span className="mt-4 inline-block text-amber-dark font-semibold text-sm">
            Shop pepper spray &rarr;
          </span>
        </Link>
        <Link
          to="/shop?category=stun-gun"
          className="rounded-xl bg-sand p-8 hover:shadow-md transition-shadow"
        >
          <h2 className="font-heading text-xl font-bold text-ink">Stun guns</h2>
          <p className="mt-2 text-ink/70 text-sm">
            Rechargeable, slim devices designed to be easy to carry and simple to use.
          </p>
          <span className="mt-4 inline-block text-amber-dark font-semibold text-sm">
            Shop stun guns &rarr;
          </span>
        </Link>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="font-heading text-2xl font-bold text-ink mb-5">Featured products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-ink mb-5">A few practical tips</h2>
        <ul className="grid sm:grid-cols-3 gap-4">
          {safetyTips.map((tip) => (
            <li key={tip} className="rounded-xl bg-sand p-5 text-sm text-ink/80">
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-ink/10 p-6">
            <p className="font-heading font-semibold text-ink">Secure PayFast payment</p>
            <p className="mt-1 text-sm text-ink/70">Your payment details never touch our servers.</p>
          </div>
          <div className="rounded-xl border border-ink/10 p-6">
            <p className="font-heading font-semibold text-ink">Uber delivery in Gauteng</p>
            <p className="mt-1 text-sm text-ink/70">Discreet delivery straight to your door.</p>
          </div>
          <div className="rounded-xl border border-ink/10 p-6">
            <p className="font-heading font-semibold text-ink">WhatsApp support</p>
            <p className="mt-1 text-sm text-ink/70">Real answers from a real person, fast.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
