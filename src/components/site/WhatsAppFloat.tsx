import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  const phone = settings?.whatsapp_number || "5511999990000";
  const message = encodeURIComponent("Olá! Vim pelo site da Laços Letícia Galvani e gostaria de tirar uma dúvida 💗");
  const href = `https://wa.me/${phone}?text=${message}`;

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
