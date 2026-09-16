export default function WhatsAppButton() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.35 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2Zm5.78 14.02c-.24.68-1.4 1.32-1.94 1.4-.5.07-1.11.1-1.79-.11a16.4 16.4 0 0 1-1.6-.6c-2.82-1.22-4.65-4.06-4.79-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.98-2.35.26-.28.56-.35.75-.35h.53c.17 0 .4-.03.62.48.24.57.8 1.96.87 2.1.07.15.12.32.02.51-.1.19-.15.31-.3.47-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.12.99 2.06 1.3 2.35 1.45.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.63.77 1.9.91.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
