import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, Package, ShieldCheck, MessageCircle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { addToCart, formatBRL, useWhatsAppLink } from "@/lib/cart-store";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} · Laços Letícia Galvani` : "Produto" },
      {
        name: "description",
        content: loaderData?.product.shortDescription ?? "Acessório artesanal",
      },
      ...(loaderData
        ? [
            { property: "og:title", content: loaderData.product.name },
            { property: "og:description", content: loaderData.product.shortDescription },
            { property: "og:image", content: loaderData.product.image },
          ]
        : []),
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name);
  const [qty, setQty] = useState(1);
  const buildWA = useWhatsAppLink();
  const related = getRelatedProducts(product);

  const handleAdd = () => {
    addToCart(product, { quantity: qty, color });
    toast.success("Adicionado ao carrinho", {
      description: `${product.name} (${color})`,
    });
  };

  const waHref = buildWA(
    `Olá! Tenho interesse no produto *${product.name}* (${color}) — ${formatBRL(product.price)}. Poderia me ajudar?`,
  );

  return (
    <div className="container-page py-12">
      <nav className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-8">
        <Link to="/" className="hover:text-gold">Início</Link>
        <span className="mx-2">/</span>
        <Link to="/produtos" className="hover:text-gold">Coleção</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-sand group">
            <img
              src={product.gallery[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden bg-sand border-2 transition-all ${
                    selectedImage === i ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
              {product.category.replace("-", " ")}
            </span>
            <h1 className="font-display italic text-4xl md:text-5xl mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5"
                    fill={i < product.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-xs text-foreground/50">
                ({product.reviews} avaliações)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-lg text-foreground/40 line-through">
                {formatBRL(product.oldPrice)}
              </span>
            )}
            <span className="font-display italic text-4xl text-gold">
              {formatBRL(product.price)}
            </span>
          </div>

          <p className="text-sm text-foreground/70 leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
              Cor: <span className="text-foreground/60 font-normal">{color}</span>
            </h4>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`size-10 rounded-full border-2 transition-all ${
                    color === c.name ? "border-gold scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
              Quantidade
            </h4>
            <div className="inline-flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 hover:text-gold"
                aria-label="Diminuir"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-3 hover:text-gold"
                aria-label="Aumentar"
              >
                <Plus className="size-3" />
              </button>
            </div>
            <span className="ml-4 text-xs text-foreground/50">
              {product.stock} em estoque
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="bg-rose-deep hover:bg-gold hover:text-white text-foreground py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all shadow-elegant"
            >
              Adicionar ao Carrinho
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="border border-border hover:border-gold flex items-center justify-center gap-2 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
            >
              <MessageCircle className="size-3.5" />
              Comprar pelo WhatsApp
            </a>
          </div>

          {/* Info blocks */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
            <div className="text-center">
              <Truck className="size-4 mx-auto text-gold mb-1" strokeWidth={1.5} />
              <div className="text-[9px] uppercase tracking-widest text-foreground/60">
                Envio Brasil
              </div>
            </div>
            <div className="text-center">
              <Package className="size-4 mx-auto text-gold mb-1" strokeWidth={1.5} />
              <div className="text-[9px] uppercase tracking-widest text-foreground/60">
                Embalagem afetiva
              </div>
            </div>
            <div className="text-center">
              <ShieldCheck className="size-4 mx-auto text-gold mb-1" strokeWidth={1.5} />
              <div className="text-[9px] uppercase tracking-widest text-foreground/60">
                Feito à mão
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pt-6 border-t border-border space-y-4 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-foreground/60 mb-1">
                Materiais
              </div>
              <p className="text-foreground/80">{product.materials}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-foreground/60 mb-1">
                Medidas
              </div>
              <p className="text-foreground/80">{product.measurements}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-foreground/60 mb-1">
                Faixa etária
              </div>
              <p className="text-foreground/80">{product.ageRange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display italic text-3xl md:text-4xl mb-10 text-center">
            Você também vai amar
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
