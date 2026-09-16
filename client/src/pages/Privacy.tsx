import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO title="Privacy Policy" description="How Caution SA handles your personal information." />
      <h1 className="font-heading text-2xl font-bold text-ink">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-ink/80 leading-relaxed">
        <p>
          Caution SA respects your privacy and handles your personal information in accordance
          with the Protection of Personal Information Act (POPIA).
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">What we collect</h2>
        <p>
          To process and deliver your order, we collect your name, WhatsApp number, and delivery
          address. We do not store your card or banking details — these are handled directly by
          PayFast.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">How we use it</h2>
        <p>
          We use your information to process payment, arrange Uber delivery, send order and
          delivery updates via WhatsApp, and to comply with legal requirements.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Who we share it with</h2>
        <p>
          We share only the information necessary with PayFast (for payment) and our delivery
          partners (for delivery). We do not sell your personal information.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal information by
          contacting us. We retain order records only as long as necessary for legal and
          accounting purposes.
        </p>
        <h2 className="font-heading font-semibold text-ink text-base mt-6">Cookies</h2>
        <p>
          We use minimal cookies and browser storage to keep your cart saved between visits. We do
          not use third-party tracking or advertising cookies.
        </p>
      </div>
    </div>
  );
}
