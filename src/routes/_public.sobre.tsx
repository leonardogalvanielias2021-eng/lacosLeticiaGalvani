import { createFileRoute, Link } from "@tanstack/react-router";
import atelierImg from "@/assets/about-atelier.jpg";
import heroImg from "@/assets/hero-girl-bow.jpg";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export const Route = createFileRoute("/_public/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós · Laços Letícia Galvani" },
      {
        name: "description",
        content:
          "A história do ateliê Letícia Galvani — laços artesanais feitos à mão com carinho para eternizar a delicadeza da infância.",
      },
      { property: "og:title", content: "Sobre nós · Laços Letícia Galvani" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  const aboutText = settings?.about_text || "Tudo começou em 2018 quando, na expectativa da minha primeira filha, comecei a criar peças exclusivas para ela. As amigas se apaixonaram, os pedidos vieram, e o ateliê nasceu como uma extensão desse afeto.\n\nHoje somos uma pequena equipe de mulheres artesãs que produzem cada peça com o mesmo carinho da primeira. Selecionamos pessoalmente cada fita, cada pérola, cada elástico, para garantir o conforto e a qualidade que nossas princesas merecem.\n\nMais de 5.000 pedidos entregues em todo o Brasil, e o mesmo compromisso: fazer com o coração.";
  const aboutImage = settings?.about_image_url || atelierImg;

  return (
    <div>
      <section className="py-20 bg-rose-soft/40 border-b border-border">
        <div className="container-page text-center max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
            Nossa história
          </span>
          <h1 className="font-display italic text-5xl md:text-6xl mt-3">
            Feito à mão, com afeto
          </h1>
          <p className="text-sm text-foreground/70 mt-6 leading-relaxed">
            O ateliê Letícia Galvani nasceu da vontade de transformar fitas, cetim e sonhos
            em memórias afetivas. Cada laço, tiara e faixa é feito individualmente, com o
            mesmo cuidado que colocamos nos nossos.
          </p>
        </div>
      </section>

      <section className="container-page py-20 grid md:grid-cols-2 gap-16 items-center">
        <img
          src={aboutImage}
          alt="Letícia Galvani no ateliê"
          loading="lazy"
          className="rounded-3xl w-full aspect-[4/5] object-cover"
        />
        <div className="space-y-5">
          <h2 className="font-display italic text-4xl">Como tudo começou</h2>
          {aboutText.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} className="text-sm text-foreground/70 leading-relaxed">
                {paragraph}
              </p>
            ) : null
          ))}
        </div>
      </section>

      <section className="py-20 bg-nude/30">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "5000+", label: "Pedidos entregues" },
            { value: "100%", label: "Feito à mão" },
            { value: "8 anos", label: "De ateliê" },
            { value: "Brasil", label: "Envio nacional" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display italic text-4xl md:text-5xl text-gold">
                {s.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 mt-3">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-page text-center max-w-xl">
          <h2 className="font-display italic text-4xl">Vamos criar juntas?</h2>
          <p className="text-sm text-foreground/60 mt-4">
            Explore nossa coleção ou fale conosco para uma peça personalizada.
          </p>
          <Link
            to="/produtos"
            className="inline-block mt-8 bg-rose-deep hover:bg-gold hover:text-white text-foreground px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
          >
            Ver coleção
          </Link>
        </div>
      </section>
    </div>
  );
}
