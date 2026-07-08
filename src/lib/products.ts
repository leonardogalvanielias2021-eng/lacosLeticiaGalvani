import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Category =
  | "lacos-boutique"
  | "lacos-escolares"
  | "faixas-bebe"
  | "tiaras"
  | "kits"
  | "promocoes"
  | "lancamentos";

export const CATEGORIES: { slug: Category; name: string }[] = [
  { slug: "lacos-boutique", name: "Laços Boutique" },
  { slug: "lacos-escolares", name: "Laços Escolares" },
  { slug: "faixas-bebe", name: "Faixas para Bebê" },
  { slug: "tiaras", name: "Tiaras" },
  { slug: "kits", name: "Kits" },
  { slug: "lancamentos", name: "Lançamentos" },
  { slug: "promocoes", name: "Promoções" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  category: Category;
  colors: { name: string; hex: string }[];
  ageRange: "0-12m" | "1-3a" | "3-6a" | "6-10a" | "todas";
  materials: string;
  measurements: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "laco-aurora-rosa",
    name: "Laço Aurora Rosa Quartzo",
    shortDescription: "Laço em cetim rosa com pérola central",
    description:
      "Laço confeccionado à mão em cetim de alta qualidade, com detalhe de pérola natural no centro. Presilha francesa antialérgica para conforto absoluto.",
    price: 48.9,
    image: p1,
    gallery: [p1, p6, p5],
    category: "lacos-boutique",
    colors: [
      { name: "Rosa Quartzo", hex: "#F8C8D3" },
      { name: "Branco", hex: "#FFFFFF" },
      { name: "Nude", hex: "#EED9C4" },
    ],
    ageRange: "3-6a",
    materials: "Cetim, pérola natural, presilha francesa",
    measurements: "10 cm x 8 cm",
    stock: 12,
    rating: 5,
    reviews: 48,
    isBestSeller: true,
  },
  {
    id: "2",
    slug: "faixa-baby-chiffon",
    name: "Faixa Baby Chiffon Flores",
    shortDescription: "Faixa elástica com flores em chiffon",
    description:
      "Faixa delicada em elástico macio revestido, com flores de chiffon rosa e detalhe dourado. Ideal para os primeiros meses.",
    price: 35.0,
    image: p2,
    gallery: [p2, p1],
    category: "faixas-bebe",
    colors: [
      { name: "Rosa Bebê", hex: "#FDE4EA" },
      { name: "Marfim", hex: "#F5EFE6" },
    ],
    ageRange: "0-12m",
    materials: "Chiffon, elástico revestido, mini pérolas",
    measurements: "Circunferência ajustável 34-42 cm",
    stock: 20,
    rating: 5,
    reviews: 63,
    isNew: true,
  },
  {
    id: "3",
    slug: "tiara-veludo-perolizada",
    name: "Tiara Veludo Perolizada",
    shortDescription: "Tiara em veludo rosa com pérolas e dourado",
    description:
      "Tiara sofisticada em veludo importado, adornada com pérolas naturais e detalhes em fio dourado. Perfeita para ocasiões especiais.",
    price: 72.0,
    oldPrice: 89.0,
    image: p3,
    gallery: [p3, p1],
    category: "tiaras",
    colors: [
      { name: "Rosa Pink", hex: "#C43A5A" },
      { name: "Rosa Quartzo", hex: "#F8C8D3" },
    ],
    ageRange: "3-6a",
    materials: "Veludo, pérolas naturais, arame revestido",
    measurements: "Ajuste universal",
    stock: 8,
    rating: 5,
    reviews: 27,
    isBestSeller: true,
  },
  {
    id: "4",
    slug: "kit-escolar-classico",
    name: "Kit Escolar Clássico",
    shortDescription: "Trio de laços em cores escolares",
    description:
      "Kit com três laços elegantes em cores clássicas: marinho, bordô e marfim. Acabamento impecável para o uniforme.",
    price: 89.9,
    image: p4,
    gallery: [p4],
    category: "lacos-escolares",
    colors: [
      { name: "Marinho", hex: "#1E2A56" },
      { name: "Bordô", hex: "#7A1F2F" },
      { name: "Marfim", hex: "#F5EFE6" },
    ],
    ageRange: "6-10a",
    materials: "Gorgurão premium, presilha bico de pato",
    measurements: "8 cm x 6 cm cada",
    stock: 15,
    rating: 5,
    reviews: 34,
  },
  {
    id: "5",
    slug: "tiara-festa-cetim",
    name: "Tiara Festa Cetim Branco",
    shortDescription: "Tiara com laço grande em cetim branco",
    description:
      "Uma verdadeira peça de estilo. Tiara dourada com laço amplo em cetim branco off, ideal para batizado, aniversários e primeira comunhão.",
    price: 58.0,
    image: p5,
    gallery: [p5, p1],
    category: "tiaras",
    colors: [
      { name: "Branco Off", hex: "#F8F5EF" },
      { name: "Nude", hex: "#EED9C4" },
    ],
    ageRange: "1-3a",
    materials: "Cetim, base dourada revestida",
    measurements: "Laço 14 cm; arco universal",
    stock: 10,
    rating: 5,
    reviews: 41,
    isNew: true,
  },
  {
    id: "6",
    slug: "kit-mini-delicadeza",
    name: "Kit Mini Delicadeza",
    shortDescription: "Trio de mini laços em tons pastéis",
    description:
      "Kit com três mini laços em cetim: pêssego, verde sálvia e rosa antigo. Presilha bico de pato mini para primeiros fios.",
    price: 65.0,
    oldPrice: 79.9,
    image: p6,
    gallery: [p6, p2],
    category: "kits",
    colors: [
      { name: "Pêssego", hex: "#F7C6A7" },
      { name: "Verde Sálvia", hex: "#B8CBB0" },
      { name: "Rosa Antigo", hex: "#E2A6A4" },
    ],
    ageRange: "0-12m",
    materials: "Cetim, presilha bico de pato mini",
    measurements: "5 cm x 4 cm cada",
    stock: 25,
    rating: 5,
    reviews: 89,
    isBestSeller: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(
    0,
    limit,
  );
}
