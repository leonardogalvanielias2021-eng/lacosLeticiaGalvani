import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Truck, MessageSquareHeart, Star, ChevronRight } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import atelierImg from "@/assets/about-atelier.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Laços Letícia Galvani · Ateliê de Laços Artesanais" },
      {
        name: "description",
        content:
          "Laços, tiaras e faixas artesanais criados à mão com carinho. Delicadeza em cada detalhe para meninas de todas as idades.",
      },
    ],
  }),
  component: HomePage,
});

const differentials = [
  { icon: Heart, title: "Feito à mão", desc: "Cada peça produzida artesanalmente no nosso ateliê." },
  { icon: Sparkles, title: "Acabamento impecável", desc: "Costuras revisadas e materiais premium selecionados." },
  { icon: Truck, title: "Envio Brasil todo", desc: "Embalagem afetiva e rastreio em todos os pedidos." },
  { icon: MessageSquareHeart, title: "Atendimento carinhoso", desc: "Suporte direto via WhatsApp para personalizações." },
];

const testimonials = [
  {
    name: "Mariana Souza",
    city: "Curitiba, PR",
    text: "Recebi os laços e fiquei encantada. Dava para sentir o carinho em cada detalhe. Minha filha ficou uma princesa!",
  },
  {
    name: "Ana Beatriz Lima",
    city: "São Paulo, SP",
    text: "Qualidade impressionante. As tiaras aguentam o dia todo na escola sem apertar. Já sou cliente fiel.",
  },
  {
    name: "Fernanda Alves",
    city: "Belo Horizonte, MG",
    text: "A embalagem é linda, chegou rápido e o acabamento é de outro nível. Recomendo de olhos fechados.",
  },
];

function HomePage() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
        
        {/* Left Content (45%) */}
        <div className="w-full md:w-[45%] flex flex-col justify-center items-center md:items-start pt-32 pb-12 md:py-20 px-6 md:pl-[8%] lg:pl-[12%] md:pr-8 relative z-20">
          
          {/* Logo */}
          <img 
            src="/logo-hero.png" 
            alt="Logo Laços Letícia Galvani" 
            className="w-full max-w-[400px] md:max-w-[550px] lg:max-w-[750px] h-auto object-contain mb-8 md:-ml-4 lg:-ml-8"
          />
          
          {/* Phrase & Subtitle */}
          <h2 className="font-display italic text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight tracking-wide mb-3">
            De mãe para mãe
          </h2>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-light mb-8 max-w-[320px] md:max-w-sm text-center md:text-left">
            Laços delicados, feitos com carinho para momentos especiais.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 bg-rose-deep hover:bg-gold hover:text-white text-foreground px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium shadow-elegant transition-all"
            >
              Ver coleção <ChevronRight className="size-3.5" />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center bg-white/80 backdrop-blur border border-border hover:border-gold px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
            >
              Nossa história
            </Link>
          </div>
          
        </div>

        {/* Right Image (55%) */}
        <div className="w-full md:w-[55%] h-[50vh] md:h-auto relative z-10">
          {/* Edge Gradients for smooth blending */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent md:hidden z-10" />
          <div className="hidden md:block absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-background via-background/70 to-transparent z-10" />
          
          <img 
            src="/hero-bg.png" 
            alt="Ensaio fotográfico de mãe e bebê"
            className="w-full h-full object-cover object-[center_right]"
          />
        </div>
        
      </section>

      {/* DIFFERENTIALS */}
      <section className="py-20 bg-sand/40">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {differentials.map((d) => (
            <div key={d.title} className="text-center space-y-3">
              <div className="mx-auto size-14 rounded-full border border-gold/30 grid place-items-center bg-white">
                <d.icon className="size-5 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg">{d.title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="container-page">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
                Explore
              </span>
              <h2 className="font-display italic text-4xl md:text-5xl mt-3">
                Nossas categorias
              </h2>
            </div>
            <Link
              to="/produtos"
              className="text-[11px] uppercase tracking-[0.2em] border-b border-gold pb-1 text-gold hover:text-foreground transition-colors"
            >
              Ver tudo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 4).map((cat) => {
              const product = PRODUCTS.find((p) => p.category === cat.slug);
              if (!product) return null;
              return (
                <Link
                  key={cat.slug}
                  to="/produtos"
                  search={{ cat: cat.slug }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-sand"
                >
                  <img
                    src={product.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-display text-xl italic">{cat.name}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-rose-soft/30">
        <div className="container-page">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
              Os mais amados
            </span>
            <h2 className="font-display italic text-4xl md:text-5xl mt-3">
              Destaques do ateliê
            </h2>
            <p className="text-sm text-foreground/60 mt-4">
              Peças feitas uma a uma com fitas selecionadas e acabamento impecável.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-gold px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
            >
              Ver coleção completa <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24">
        <div className="container-page grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold rounded-3xl" />
            <img
              src={atelierImg}
              alt="Ateliê Letícia Galvani"
              width={1000}
              height={1250}
              loading="lazy"
              className="relative w-full aspect-[4/5] object-cover rounded-3xl"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
              Nossa essência
            </span>
            <h2 className="font-display italic text-4xl md:text-5xl leading-tight">
              Feito à mão, de coração para coração.
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              A Laços Letícia Galvani nasceu do desejo de transformar fitas e tecidos em
              memórias afetivas. Cada peça é confeccionada manualmente em nosso ateliê,
              utilizando apenas os melhores materiais para garantir conforto e beleza para
              quem você mais ama.
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              São mais de 5.000 pedidos entregues, cada um com o mesmo carinho da primeira
              peça.
            </p>
            <Link
              to="/sobre"
              className="inline-block border-b border-foreground pb-2 text-[11px] uppercase tracking-[0.2em] font-medium hover:text-gold hover:border-gold transition-all"
            >
              Conheça nossa história
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-nude/30">
        <div className="container-page">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
              Depoimentos
            </span>
            <h2 className="font-display italic text-4xl md:text-5xl mt-3">
              O que dizem nossas clientes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-8 rounded-2xl shadow-soft space-y-4"
              >
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" strokeWidth={0} />
                  ))}
                </div>
                <p className="font-display italic text-lg leading-relaxed text-foreground/80">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="pt-3 border-t border-border">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">
                    {t.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24">
        <div className="container-page">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
              Nossas princesas
            </span>
            <h2 className="font-display italic text-4xl md:text-5xl mt-3">
              #LacosLeticiaGalvani
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[g1, g2, g3, g4].map((src, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <img
                  src={src}
                  alt={`Cliente ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground text-background">
        <div className="container-page text-center max-w-2xl">
          <h2 className="font-display italic text-4xl md:text-5xl text-background">
            Vamos criar algo único para a sua pequena?
          </h2>
          <p className="mt-6 text-sm text-background/70">
            Fazemos peças personalizadas em cores e tamanhos especiais.
            Fale conosco pelo WhatsApp e criamos junto.
          </p>
          <a
            href="https://wa.me/5511999990000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-8 items-center gap-2 bg-gold hover:bg-rose-deep hover:text-foreground text-white px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
          >
            Falar com o ateliê
          </a>
        </div>
      </section>
    </div>
  );
}
