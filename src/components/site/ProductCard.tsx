import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { formatBRL } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-sand mb-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-medium">
            Novo
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute top-3 right-3 bg-rose-deep text-white px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-medium">
            Oferta
          </span>
        )}
        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-full bg-white/95 backdrop-blur text-center py-3 text-[10px] uppercase tracking-[0.2em] rounded-full shadow-soft">
            Ver produto
          </div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        <p className="text-[10px] uppercase tracking-widest text-foreground/50">
          {product.colors.length} cor{product.colors.length > 1 ? "es" : ""}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          {product.oldPrice && (
            <span className="text-xs text-foreground/40 line-through">
              {formatBRL(product.oldPrice)}
            </span>
          )}
          <span className="text-gold text-sm font-medium">{formatBRL(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
