import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/produtos")({
  ssr: false,
  component: ProdutosList,
});

type Row = {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  estoque: number;
  ativo: boolean;
};

function ProdutosList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("produtos")
      .select("id,nome,slug,preco,estoque,ativo")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAtivo(row: Row) {
    if (!supabase) return;
    await supabase.from("produtos").update({ ativo: !row.ativo }).eq("id", row.id);
    load();
  }

  async function remove(row: Row) {
    if (!supabase) return;
    if (!confirm(`Excluir "${row.nome}"?`)) return;
    await supabase.from("produtos").delete().eq("id", row.id);
    load();
  }

  const filtered = rows.filter((r) => r.nome.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-display text-3xl">Produtos</h1>
        <Link to="/admin/produtos/novo" className="bg-gold text-white text-xs uppercase tracking-widest px-5 py-3 rounded">
          Novo produto
        </Link>
      </div>
      <input
        placeholder="Buscar…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-sm border border-rose-soft rounded px-3 py-2 text-sm"
      />
      <div className="bg-white border border-rose-soft rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-rose-soft/30 text-left text-[11px] uppercase tracking-widest text-foreground/70">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-foreground/60">Carregando…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-foreground/60">Nenhum produto.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-rose-soft/40">
                <td className="px-4 py-3">{r.nome}</td>
                <td className="px-4 py-3">R$ {Number(r.preco).toFixed(2)}</td>
                <td className="px-4 py-3">{r.estoque}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAtivo(r)}
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                      r.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.ativo ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link to="/admin/produtos/$id" params={{ id: r.id }} className="text-gold hover:underline">Editar</Link>
                  <button onClick={() => remove(r)} className="text-red-600 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
