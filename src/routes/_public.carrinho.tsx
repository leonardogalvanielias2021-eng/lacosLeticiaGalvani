import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import {
  useCart,
  updateQuantity,
  removeFromCart,
  formatBRL,
  useWhatsAppLink,
  clearCart,
} from "@/lib/cart-store";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export const Route = createFileRoute("/_public/carrinho")({
  head: () => ({
    meta: [{ title: "Carrinho · Laços Letícia Galvani" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal } = useCart();
  const [cep, setCep] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"entrega" | "retirada">("entrega");
  const [shipping, setShipping] = useState<number | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  const calcShipping = () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }
    
    // Frete Tubarão (CEPs 88700 a 88714 aprox)
    const isTubarao = cleanCep.startsWith("8870") || cleanCep.startsWith("8871");
    
    let value = 24.9;
    if (subtotal >= 250) {
      value = 0;
    } else if (isTubarao) {
      value = 10.0;
    }

    setShipping(value);
    toast.success(value === 0 ? "Frete grátis liberado!" : `Frete estimado: ${formatBRL(value)}`);
  };

  const total = subtotal + (shipping ?? 0);

  const phone = settings?.whatsapp_number || "5511999990000";
  const message = `Olá! Gostaria de finalizar o pedido abaixo:\n\n${items
    .map(
      (i) =>
        `• ${i.name}${i.color ? ` (${i.color})` : ""} — ${i.quantity}x ${formatBRL(i.price)}`,
    )
    .join("\n")}\n\nSubtotal: ${formatBRL(subtotal)}${
    shipping !== null ? `\nFrete (${deliveryMethod}): ${formatBRL(shipping)}\nTotal: ${formatBRL(total)}` : `\nTotal: ${formatBRL(total)}`
  }`;

  const checkoutWA = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <ShoppingBag className="size-12 mx-auto text-foreground/30 mb-6" strokeWidth={1} />
        <h1 className="font-display italic text-4xl">Seu carrinho está vazio</h1>
        <p className="text-sm text-foreground/60 mt-3">
          Que tal descobrir nossas peças mais amadas?
        </p>
        <Link
          to="/produtos"
          className="inline-block mt-8 bg-rose-deep hover:bg-gold hover:text-white text-foreground px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all"
        >
          Ver coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="text-center mb-12">
        <span className="text-[10px] uppercase tracking-[0.35em] text-gold">Checkout</span>
        <h1 className="font-display italic text-4xl md:text-5xl mt-3">Seu carrinho</h1>
      </div>

      <div className="grid md:grid-cols-[1fr_380px] gap-10">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}`}
              className="flex gap-4 bg-white border border-border rounded-2xl p-4"
            >
              <Link
                to="/produto/$slug"
                params={{ slug: item.slug }}
                className="size-24 rounded-xl overflow-hidden bg-sand shrink-0"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to="/produto/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-lg hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  {item.color && (
                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 mt-1">
                      Cor: {item.color}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.color, item.quantity - 1)
                      }
                      className="p-2 hover:text-gold"
                      aria-label="Diminuir"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.color, item.quantity + 1)
                      }
                      className="p-2 hover:text-gold"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="text-gold font-medium">
                    {formatBRL(item.price * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId, item.color)}
                className="text-foreground/40 hover:text-destructive"
                aria-label="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <button
            onClick={() => clearCart()}
            className="text-xs uppercase tracking-widest text-foreground/50 hover:text-destructive"
          >
            Esvaziar carrinho
          </button>
        </div>

        {/* Summary */}
        <aside className="bg-rose-soft/40 rounded-2xl p-6 space-y-6 h-fit md:sticky md:top-32">
          <h3 className="font-display italic text-2xl">Resumo do pedido</h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2">
                Método de Recebimento
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="delivery_method" 
                    checked={deliveryMethod === "entrega"}
                    onChange={() => setDeliveryMethod("entrega")}
                    className="text-gold focus:ring-gold"
                  />
                  Receber em casa
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="delivery_method" 
                    checked={deliveryMethod === "retirada"}
                    onChange={() => {
                      setDeliveryMethod("retirada");
                      setShipping(0);
                    }}
                    className="text-gold focus:ring-gold"
                  />
                  Retirar na loja (Grátis)
                </label>
              </div>
            </div>

            {deliveryMethod === "entrega" && (
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2">
                  Calcular frete
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 bg-white px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <button
                    onClick={calcShipping}
                    className="bg-foreground text-background text-[10px] uppercase tracking-widest px-4 rounded-full hover:bg-gold"
                  >
                    Calcular
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-border/50 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            {shipping !== null && (
              <div className="flex justify-between">
                <span className="text-foreground/60">
                  {deliveryMethod === "retirada" ? "Retirada" : "Frete"}
                </span>
                <span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-border/50 text-lg font-display italic">
              <span>Total</span>
              <span className="text-gold">{formatBRL(total)}</span>
            </div>
          </div>

          <a
            href={checkoutWA}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (deliveryMethod === "entrega" && shipping === null) {
                e.preventDefault();
                toast.error("Calcule o frete antes de finalizar o pedido.");
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium hover:brightness-95 transition-all"
          >
            <MessageCircle className="size-4" />
            Finalizar pelo WhatsApp
          </a>
          <p className="text-[10px] text-foreground/50 text-center leading-relaxed">
            Você será direcionada para conversar com o ateliê e concluir seu pedido com
            atendimento personalizado.
          </p>
        </aside>
      </div>
    </div>
  );
}
