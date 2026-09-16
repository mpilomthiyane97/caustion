import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PaymentCancelled() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <SEO title="Payment cancelled" description="Your Caution SA payment was cancelled." />
      <h1 className="font-heading text-2xl font-bold text-ink">Payment cancelled</h1>
      <p className="mt-2 text-ink/70">
        No payment was taken. Your cart is still saved if you&apos;d like to try again.
      </p>
      <Link
        to="/cart"
        className="mt-6 inline-block rounded-lg bg-amber px-6 py-3 font-semibold text-ink hover:bg-amber-dark"
      >
        Back to cart
      </Link>
    </div>
  );
}
