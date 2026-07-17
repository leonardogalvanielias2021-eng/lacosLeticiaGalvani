import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import type { Product } from "./products";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  quantity: number;
};

const STORAGE_KEY = "llg_cart_v1";
let state: CartItem[] = [];
const listeners = new Set<() => void>();

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return state;
}
function getServerSnapshot(): CartItem[] {
  return [];
}

export function addToCart(product: Product, opts: { quantity?: number; color?: string } = {}) {
  const qty = opts.quantity ?? 1;
  const idx = state.findIndex((i) => i.productId === product.id && i.color === opts.color);
  if (idx >= 0) {
    state = state.map((it, i) => (i === idx ? { ...it, quantity: it.quantity + qty } : it));
  } else {
    state = [
      ...state,
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        color: opts.color,
        quantity: qty,
      },
    ];
  }
  persist();
  emit();
}

export function updateQuantity(productId: string, color: string | undefined, qty: number) {
  state = state
    .map((i) => (i.productId === productId && i.color === color ? { ...i, quantity: qty } : i))
    .filter((i) => i.quantity > 0);
  persist();
  emit();
}

export function removeFromCart(productId: string, color: string | undefined) {
  state = state.filter((i) => !(i.productId === productId && i.color === color));
  persist();
  emit();
}

export function clearCart() {
  state = [];
  persist();
  emit();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    state = loadFromStorage();
    setHydrated(true);
    emit();
  }, []);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  return { items: hydrated ? items : [], subtotal, totalItems, hydrated };
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export function useWhatsAppLink() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  return useCallback((message: string) => {
    const phone = settings?.whatsapp_number || "5511999990000";
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }, [settings?.whatsapp_number]);
}
