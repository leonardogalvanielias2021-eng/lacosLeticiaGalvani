import { MessageCircle } from "lucide-react";
import { useWhatsAppLink } from "@/lib/cart-store";

export function WhatsAppFloat() {
  const buildLink = useWhatsAppLink();
  const href = buildLink(
    "Olá! Vim pelo site da Laços Letícia Galvani e gostaria de tirar uma dúvida 💗",
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] text-white pl-4 pr-5 py-3.5 rounded-full shadow-elegant hover:scale-105 transition-transform"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="size-5" fill="white" strokeWidth={0} />
      <span className="hidden md:inline text-[11px] font-medium uppercase tracking-widest">
        Fale com a gente
      </span>
    </a>
  );
}
