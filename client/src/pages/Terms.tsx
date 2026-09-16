import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO title="Terms" description="Terms of use for Caution SA." />
      <h1 className="font-heading text-2xl font-bold text-ink">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-4 text-sm text-ink/80 leading-relaxed">
        <p>
          By using this website and placing an order, you agree to these terms. Caution SA sells
          self-defence products, including pepper spray and tasers, for lawful personal use by
          adults in South Africa.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Eligibility</h2>
        <p>
          You must be 18 years or older to purchase from Caution SA. By checking out, you confirm
          that you meet this requirement and that you intend to use any product purchased for
          lawful self-defence only.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Orders and payment</h2>
        <p>
          All prices are shown in South African Rand and include VAT where applicable. Orders are
          only processed once payment has been confirmed via PayFast. We reserve the right to
          decline or cancel an order, for example where a product is out of stock or payment
          cannot be verified.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Lawful use</h2>
        <p>
          You are responsible for using any product purchased in accordance with South African
          law. Caution SA does not encourage or condone the unlawful use of any product sold on
          this site.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Delivery</h2>
        <p>
          Products are currently delivered via Uber to addresses within Gauteng only, once
          payment has been confirmed. See our{' '}
          <a href="/legal/shipping" className="text-amber-dark underline">
            Shipping &amp; Delivery
          </a>{' '}
          page for details.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>
      </div>
    </div>
  );
}
