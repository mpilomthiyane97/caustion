import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchOrderStatus } from '../lib/api';
import { clearCart } from '../lib/cart';
import type { OrderStatus } from '../types';

const POLL_INTERVAL_MS = 2500;
const TIMEOUT_MS = 30000;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const [status, setStatus] = useState<OrderStatus | 'checking' | 'timeout' | 'error'>('checking');
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!clearedRef.current) {
      clearCart();
      clearedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!ref) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const result = await fetchOrderStatus(ref);
        if (cancelled) return;
        if (result.status === 'paid' || result.status === 'delivered') {
          setStatus(result.status);
          return;
        }
        if (Date.now() - startedAt >= TIMEOUT_MS) {
          setStatus('timeout');
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        if (Date.now() - startedAt >= TIMEOUT_MS) {
          setStatus('timeout');
        } else {
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [ref]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <SEO title="Payment" description="Confirming your Caution SA payment." />

      {status === 'paid' || status === 'delivered' ? (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success text-2xl">
            &#10003;
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-ink">Payment confirmed</h1>
          <p className="mt-2 text-ink/70">
            Thank you! We&apos;ll WhatsApp you when your Uber delivery is on the way.
          </p>
        </>
      ) : status === 'checking' ? (
        <>
          <h1 className="font-heading text-2xl font-bold text-ink">Confirming your payment...</h1>
          <p className="mt-2 text-ink/70">This usually takes a few seconds.</p>
        </>
      ) : status === 'error' ? (
        <>
          <h1 className="font-heading text-2xl font-bold text-ink">Something went wrong</h1>
          <p className="mt-2 text-ink/70">
            We couldn&apos;t find your order reference. If you were charged, contact us via
            WhatsApp and we&apos;ll sort it out.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-heading text-2xl font-bold text-ink">
            We&apos;re confirming your payment
          </h1>
          <p className="mt-2 text-ink/70">
            You&apos;ll get an email shortly once it&apos;s confirmed. No need to pay again.
          </p>
        </>
      )}

      {ref && <p className="mt-4 text-sm text-ink/50">Order reference: {ref}</p>}

      <Link to="/shop" className="mt-6 inline-block text-amber-dark font-semibold">
        Continue shopping
      </Link>
    </div>
  );
}
