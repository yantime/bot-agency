const NUMERO_WHATSAPP = "51941990526";
const MENSAJE = "Hola, quiero saber más sobre chatbot para WhatsApp ventas";

export default function WhatsAppButton() {
  const href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MENSAJE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-105"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.79 2.4a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.25-8.25 8.25a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.71-8.24 8.28-8.24Zm-4.55 4.7c-.16 0-.42.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.76 2.79 4.35 3.8 2.15.85 2.59.68 3.06.64.47-.04 1.5-.61 1.71-1.2.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.3-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.25-.65.83-.8 1-.15.17-.29.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.4-.79-1.91-.2-.5-.42-.44-.57-.44Z" />
      </svg>
      Contactar a ventas
    </a>
  );
}
