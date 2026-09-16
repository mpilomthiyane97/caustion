import SEO from '../components/SEO';

export default function Contact() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <SEO title="Contact" description="Get in touch with Caution SA on WhatsApp." />
      <h1 className="font-heading text-2xl font-bold text-ink">Contact us</h1>
      <p className="mt-2 text-ink/70">We usually reply within a few hours.</p>

      <div className="mt-8 flex justify-center">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-ink/10 p-6 hover:shadow-md transition-shadow max-w-xs w-full"
        >
          <p className="font-heading font-semibold text-ink">WhatsApp</p>
          <p className="mt-1 text-sm text-amber-dark">Chat with us for questions or support</p>
        </a>
      </div>
    </div>
  );
}
