import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "919909907475";
  const message = "Hello Dr. Nisarg Parmar, I would like to book an appointment.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="font-semibold text-sm hidden sm:inline">WhatsApp</span>
    </a>
  );
}
