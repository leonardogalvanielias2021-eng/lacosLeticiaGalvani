import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ produtos: 0, semEstoque: 0, categorias: 0, banners: 0 });

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [p, se, c, b] = await Promise.all([
        supabase.from("produtos").select("*", { count: "exact", head: true }),
        supabase.from("produtos").select("*", { count: "exact", head: true }).eq("estoque", 0),
        supabase.from("categorias").select("*", { count: "exact", head: true }),
        supabase.from("banners").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        produtos: p.count ?? 0,
        semEstoque: se.count ?? 0,
        categorias: c.count ?? 0,
        banners: b.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Bem-vinda</h1>
        <p className="text-sm text-foreground/60">Resumo da sua loja.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Produtos" value={stats.produtos} />
        <Card label="Sem estoque" value={stats.semEstoque} />
        <Card label="Categorias" value={stats.categorias} />
        <Card label="Banners" value={stats.banners} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/produtos/novo" className="bg-gold text-white text-xs uppercase tracking-widest px-5 py-3 rounded hover:opacity-90">
          Novo produto
        </Link>
        <Link to="/admin/produtos" className="border border-rose-soft text-xs uppercase tracking-widest px-5 py-3 rounded hover:bg-rose-soft/30">
          Ver produtos
        </Link>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-rose-soft rounded-xl p-5">
      <div className="text-[10px] uppercase tracking-widest text-foreground/60">{label}</div>
      <div className="font-display text-3xl mt-1">{value}</div>
    </div>
  );
}
