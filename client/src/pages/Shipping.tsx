import SEO from '../components/SEO';

export default function Shipping() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO title="Shipping & Delivery" description="How Caution SA delivers your order." />
      <h1 className="font-heading text-2xl font-bold text-ink">Shipping &amp; Delivery</h1>
      <div className="mt-6 space-y-4 text-sm text-ink/80 leading-relaxed">
        <p>
          We currently deliver exclusively within Gauteng, using Uber, once your payment has been
          confirmed.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">How it works</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>You complete checkout and pay securely via PayFast.</li>
          <li>Once payment is confirmed, we prepare your order for delivery.</li>
          <li>We book an Uber to your delivery address and WhatsApp you when it&apos;s on the way.</li>
          <li>Your order is delivered directly to the address you provided at checkout.</li>
        </ol>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Delivery area</h2>
        <p>
          At this time we only deliver within Gauteng. We hope to expand to other provinces in the
          future.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Delivery fee</h2>
        <p>Delivery within Gauteng is included in the price shown for every product — there is no separate delivery fee at checkout.</p>
      </div>
    </div>
  );
}
