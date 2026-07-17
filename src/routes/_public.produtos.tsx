import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { getAllProducts, type Product } from "@/lib/products";
import { CategoriesService } from "@/services/categories.service";
import { ProductCard } from "@/components/site/ProductCard";

const searchSchema = z.object({
  cat: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/_public/produtos")({
  validateSearch: searchSchema,
  loader: async () => {
    const [products, categories] = await Promise.all([
      getAllProducts(),
      CategoriesService.getAll()
    ]);
    return { products, categories };
  },
  head: () => ({
    meta: [
      { title: "Coleção · Laços Letícia Galvani" },
      {
        name: "description",
        content:
          "Explore nossa coleção de laços, tiaras e faixas artesanais. Filtre por categoria, cor, idade e preço.",
      },
    ],
  }),
  component: ProductsPage,
});

type SortKey = "relevant" | "price-asc" | "price-desc" | "new" | "bestseller";

function ProductsPage() {
  const { products, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const [category, setCategory] = useState<string | "todos">(search.cat ?? "todos");
  const [query, setQuery] = useState(search.q ?? "");
  const [sort, setSort] = useState<SortKey>("relevant");
  const [maxPrice, setMaxPrice] = useState(150);

  const filtered = useMemo(() => {
    let items = [...products];
    if (category !== "todos") {
      if (category === "lancamentos") items = items.filter((p) => p.isNew);
      else if (category === "promocoes") items = items.filter((p) => p.oldPrice);
      else items = items.filter((p) => p.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q),
      );
    }
    items = items.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "new":
        items.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
      case "bestseller":
        items.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    return items;
  }, [category, query, sort, maxPrice]);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-20 bg-rose-soft/40 border-b border-border">
        <div className="container-page text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
            Coleção
          </span>
          <h1 className="font-display italic text-5xl md:text-6xl mt-3">
            Nossos acessórios
          </h1>
          <p className="max-w-xl mx-auto mt-4 text-sm text-foreground/60">
            Encontre a peça perfeita para cada ocasião especial da infância.
          </p>
        </div>
      </section>

      <div className="container-page py-12 grid md:grid-cols-[240px_1fr] gap-10">
        {/* Sidebar filters */}
        <aside className="space-y-8 md:sticky md:top-32 self-start">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-sand/60 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4">
              Categorias
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCategory("todos")}
                  className={`transition-colors ${
                    category === "todos" ? "text-gold font-medium" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => setCategory(c.name)}
                    className={`transition-colors ${
                      category === c.name ? "text-gold font-medium" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4">
              Preço máximo
            </h4>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="text-xs text-foreground/60 mt-2">Até R$ {maxPrice}</div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <p className="text-xs uppercase tracking-widest text-foreground/50">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-sand/60 rounded-full px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="relevant">Mais relevantes</option>
              <option value="new">Lançamentos</option>
              <option value="bestseller">Mais vendidos</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-foreground/50">
              <p className="font-display italic text-2xl">Nenhum produto encontrado</p>
              <p className="text-sm mt-2">Tente ajustar seus filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
