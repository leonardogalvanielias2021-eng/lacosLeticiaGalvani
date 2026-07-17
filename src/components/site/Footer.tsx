import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  return (
    <footer className="bg-white pt-20 pb-12 border-t border-rose-soft mt-24">
      <div className="container-page grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <div>
            <div className="font-display text-2xl italic">{settings?.store_name || "Letícia Galvani"}</div>
            <div className="text-[9px] uppercase tracking-[0.35em] text-gold mt-1">
              Ateliê de Laços
            </div>
          </div>
          <p className="text-xs font-light leading-relaxed text-foreground/60">
            Acessórios artesanais criados com carinho para eternizar os momentos mais doces
            da infância.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href={settings?.instagram_url || "https://instagram.com"}
              className="size-9 rounded-full border border-rose-deep grid place-items-center hover:bg-rose-deep hover:text-white transition-all"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              className="size-9 rounded-full border border-rose-deep grid place-items-center hover:bg-rose-deep hover:text-white transition-all"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-6 text-foreground">
            Loja
          </h5>
          <ul className="space-y-3 text-sm font-light text-foreground/70">
            <li><Link to="/produtos" className="hover:text-gold">Coleção completa</Link></li>
            <li><Link to="/produtos" search={{ cat: "lancamentos" }} className="hover:text-gold">Lançamentos</Link></li>
            <li><Link to="/produtos" search={{ cat: "promocoes" }} className="hover:text-gold">Promoções</Link></li>
            <li><Link to="/produtos" search={{ cat: "kits" }} className="hover:text-gold">Kits especiais</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-6 text-foreground">
            Institucional
          </h5>
          <ul className="space-y-3 text-sm font-light text-foreground/70">
            <li><Link to="/sobre" className="hover:text-gold">Nossa história</Link></li>
            <li><Link to="/contato" className="hover:text-gold">Perguntas frequentes</Link></li>
            <li><Link to="/contato" className="hover:text-gold">Trocas e devoluções</Link></li>
            <li><Link to="/contato" className="hover:text-gold">Política de privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-6 text-foreground">
            Fale conosco
          </h5>
          <ul className="space-y-3 text-sm font-light text-foreground/70">
            <li className="flex items-center gap-2">
              <Mail className="size-3.5 text-gold" /> {settings?.contact_email || "contato@leticiagalvani.com.br"}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-gold" /> {settings?.whatsapp_number || "(11) 99999-0000"}
            </li>
            <li className="text-xs text-foreground/50 pt-2">Seg a Sex · 09h às 18h</li>
          </ul>
        </div>
      </div>

      <div className="container-page pt-8 border-t border-rose-soft flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        <p>© 2026 Laços Letícia Galvani · Todos os direitos reservados</p>
        <p className="text-right">
          {settings?.address?.split('\n').map((line, index, arr) => (
            <span key={index}>
              {line}
              {index < arr.length - 1 && " · "}
            </span>
          )) || "Feito à mão, com afeto — no Brasil"}
        </p>
      </div>
    </footer>
  );
}
