import { supabase } from "./supabase";

export type Category = string;

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
  colors: { name: string; hex: string; image?: string }[];
  ageRange: string;
  materials: string;
  measurements: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
};

// Mapa de categorias mock para manter compatibilidade, mas o ideal é usar do banco
export const CATEGORIES: { slug: string; name: string }[] = [];

async function fetchProductsFromDb() {
  const { data } = await supabase
    .from("produtos")
    .select("*, categorias(name), produto_fotos(image_url), produto_variacoes(*)")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((p: any): Product => {
    const gallery = p.produto_fotos?.map((f: any) => f.image_url) || [];
    const image = p.image || (gallery.length > 0 ? gallery[0] : "https://placehold.co/600x800?text=Sem+Foto");
    
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDescription: p.short_description || "",
      description: p.description || "",
      price: p.price,
      oldPrice: p.old_price,
      image,
      gallery: gallery.length > 0 ? gallery : [image],
      category: p.categorias?.name || "",
      colors: p.produto_variacoes?.map((v: any) => ({
        name: v.name,
        hex: v.hex_code,
        image: v.image_url
      })) || [],
      ageRange: p.age_range || "todas",
      materials: p.materials || "",
      measurements: p.measurements || "",
      stock: p.stock || 0,
      rating: p.rating || 5,
      reviews: p.reviews || 0,
      isNew: p.is_new,
      isBestSeller: p.is_bestseller
    };
  });
}

export async function getAllProducts(): Promise<Product[]> {
  return await fetchProductsFromDb();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await fetchProductsFromDb();
  return products.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await fetchProductsFromDb();
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
