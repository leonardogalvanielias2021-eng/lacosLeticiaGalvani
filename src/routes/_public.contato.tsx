import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { useWhatsAppLink } from "@/lib/cart-store";

import { SettingsService } from "@/services/settings.service";

export const Route = createFileRoute("/_public/contato")({
  loader: () => SettingsService.getSettings(),
  head: () => ({
    meta: [
      { title: "Contato & FAQ · Laços Letícia Galvani" },
      {
        name: "description",
        content:
          "Fale com o ateliê Letícia Galvani. Dúvidas sobre envio, prazo, formas de pagamento, trocas e personalização.",
      },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  {
    q: "Qual o prazo de produção?",
    a: "Como nossas peças são artesanais, pedimos até 5 dias úteis para a confecção antes do envio. Peças em pronta entrega saem em 24h.",
  },
  {
    q: "Vocês fazem laços personalizados?",
    a: "Sim! Trabalhamos com cores, tamanhos e temas exclusivos. Entre em contato pelo WhatsApp com sua ideia que criamos junto.",
  },
  {
    q: "Como funciona o envio?",
    a: "Enviamos para todo o Brasil via Correios e Transportadoras, com rastreio. O prazo varia de 3 a 10 dias úteis conforme a região.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos Pix, cartão de crédito em até 6x sem juros e boleto bancário. Pagamentos pelo WhatsApp com link seguro.",
  },
  {
    q: "Posso trocar ou devolver um produto?",
    a: "Sim, você tem 7 dias após o recebimento para solicitar troca ou devolução. O produto deve estar sem uso e na embalagem original.",
  },
  {
    q: "As peças machucam a cabeça da criança?",
    a: "De forma alguma. Utilizamos apenas materiais antialérgicos, presilhas revestidas e elásticos macios pensados no conforto infantil.",
  },
];

function ContactPage() {
  const buildWA = useWhatsAppLink();
  const settings = Route.useLoaderData();

  const whatsappNumber = settings?.whatsapp_number || "5511999990000";
  const email = settings?.contact_email || "contato@leticiagalvani.com.br";
  const businessHours = settings?.business_hours || "Segunda a Sexta · 09h às 18h\nSábados · 09h às 13h";

  return (
    <div>
      <section className="py-16 bg-rose-soft/40 border-b border-border">
        <div className="container-page text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold">Contato</span>
          <h1 className="font-display italic text-5xl md:text-6xl mt-3">Fale conosco</h1>
          <p className="text-sm text-foreground/60 mt-4 max-w-lg mx-auto">
            Estamos aqui para tirar dúvidas, criar peças personalizadas e ajudar em cada
            passo do seu pedido.
          </p>
        </div>
      </section>

      <section className="container-page py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: MessageCircle,
            title: "WhatsApp",
            value: `+${whatsappNumber}`,
            href: buildWA("Olá! Vim pelo site."),
          },
          {
            icon: Mail,
            title: "E-mail",
            value: email,
            href: `mailto:${email}`,
          },
          {
            icon: Clock,
            title: "Atendimento",
            value: "Seg a Sex · 09h às 18h",
          },
        ].map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href?.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className={`bg-white border border-border rounded-2xl p-8 text-center space-y-3 ${
              c.href ? "hover:border-gold hover:shadow-soft transition-all" : ""
            }`}
          >
            <div className="mx-auto size-12 rounded-full bg-rose-soft/60 grid place-items-center">
              <c.icon className="size-5 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl">{c.title}</h3>
            <p className="text-sm text-foreground/70">{c.value}</p>
          </a>
        ))}
      </section>

      <section className="py-16 bg-nude/30">
        <div className="container-page max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">FAQ</span>
            <h2 className="font-display italic text-4xl md:text-5xl mt-3">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-white rounded-2xl border border-border overflow-hidden"
              >
                <summary className="cursor-pointer list-none p-6 flex items-center justify-between gap-4 font-display text-lg">
                  <span>{f.q}</span>
                  <span className="text-gold text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-sm text-foreground/70 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid md:grid-cols-2 gap-8 items-center max-w-4xl">
          <div>
            <MapPin className="size-5 text-gold mb-4" strokeWidth={1.5} />
            <h3 className="font-display italic text-3xl mb-3">Nosso ateliê</h3>
            {settings?.address ? (
              <p className="text-sm text-foreground/70 leading-relaxed">
                {settings.address.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm text-foreground/70 leading-relaxed">
                Rua das Fitas, 123 · Vila Delicada
                <br />
                São Paulo, SP · CEP 00000-000
              </p>
            )}
            <p className="text-xs text-foreground/50 mt-4">
              Visitas somente com agendamento prévio.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="size-5 text-gold mt-1" strokeWidth={1.5} />
            <div>
              <h3 className="font-display italic text-3xl mb-3">Atendimento</h3>
              {businessHours.split('\n').map((line, index) => (
                <p key={index} className="text-sm text-foreground/70">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
