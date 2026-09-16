import SEO from '../components/SEO';

export default function Returns() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO title="Returns & Refunds" description="Returns and refunds policy for Caution SA." />
      <h1 className="font-heading text-2xl font-bold text-ink">Returns &amp; Refunds</h1>
      <div className="mt-6 space-y-4 text-sm text-ink/80 leading-relaxed">
        <p>
          This policy is provided in accordance with the Consumer Protection Act 68 of 2008
          (CPA).
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Faulty or damaged products</h2>
        <p>
          If a product arrives damaged, defective, or not as described, contact us within 7 days
          of delivery via WhatsApp or email with your order reference and photos of the item. We
          will arrange a repair, replacement, or refund as appropriate.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Change of mind</h2>
        <p>
          Due to the safety-related nature of our products, we are unable to accept returns for
          change of mind once a product has left our possession, except where required by law.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Refunds</h2>
        <p>
          Approved refunds are processed to your original payment method via PayFast within a
          reasonable time after approval.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Contact us</h2>
        <p>To start a return or refund request, please reach out via our Contact page.</p>
      </div>
    </div>
  );
}
