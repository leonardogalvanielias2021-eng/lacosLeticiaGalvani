import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";

export function Header() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-rose-soft">
      <div className="bg-rose-soft/60 py-2 text-center text-[10px] tracking-[0.2em] uppercase text-foreground/70">
        Frete grátis em compras acima de R$ 250 · Envio para todo o Brasil
      </div>

      <div className="container-page h-20 flex items-center justify-between gap-4">
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-foreground/70">
          <Link to="/produtos" className="hover:text-gold transition-colors">
            Coleção
          </Link>
          <Link to="/sobre" className="hover:text-gold transition-colors">
            Sobre nós
          </Link>
          <Link to="/contato" className="hover:text-gold transition-colors">
            Contato
          </Link>
        </nav>

        <Link to="/" className="text-center flex flex-col items-center leading-none">
          <span className="font-display text-2xl md:text-3xl italic tracking-tight">
            Letícia Galvani
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold mt-1">
            Ateliê de Laços
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/produtos"
            className="hidden md:inline-flex text-foreground/70 hover:text-gold transition-colors"
            aria-label="Buscar"
          >
            <Search className="size-4" />
          </Link>
          <Link
            to="/carrinho"
            className="relative inline-flex items-center gap-2 text-foreground/80 hover:text-gold transition-colors"
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] size-4 rounded-full grid place-items-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-rose-soft bg-background">
          <div className="container-page py-4 flex flex-col gap-3 text-sm uppercase tracking-widest">
            <Link to="/produtos" onClick={() => setOpen(false)}>Coleção</Link>
            <Link to="/sobre" onClick={() => setOpen(false)}>Sobre</Link>
            <Link to="/contato" onClick={() => setOpen(false)}>Contato</Link>
          </div>
        </div>
      )}
    </header>
  );
}
