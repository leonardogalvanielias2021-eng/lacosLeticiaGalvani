import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/categorias")({
  ssr: false,
  component: Categorias,
});

type Row = { id: string; nome: string; slug: string; ordem: number; ativo: boolean };

function Categorias() {
  const [rows, setRows] = useState<Row[]>([]);
  const [nome, setNome] = useState("");

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from("categorias").select("*").order("ordem");
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => { load(); }, []);

  function slugify(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !nome.trim()) return;
    await supabase.from("categorias").insert({ nome, slug: slugify(nome), ordem: rows.length });
    setNome("");
    load();
  }
  async function toggle(r: Row) {
    if (!supabase) return;
    await supabase.from("categorias").update({ ativo: !r.ativo }).eq("id", r.id);
    load();
  }
  async function remove(r: Row) {
    if (!supabase || !confirm(`Excluir "${r.nome}"?`)) return;
    await supabase.from("categorias").delete().eq("id", r.id);
    load();
  }
  async function rename(r: Row) {
    const novo = prompt("Novo nome:", r.nome);
    if (!novo || !supabase) return;
    await supabase.from("categorias").update({ nome: novo, slug: slugify(novo) }).eq("id", r.id);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Categorias</h1>
      <form onSubmit={add} className="flex gap-2 max-w-md">
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nova categoria" className="flex-1 border border-rose-soft rounded px-3 py-2 text-sm" />
        <button className="bg-gold text-white text-xs uppercase tracking-widest px-4 rounded">Adicionar</button>
      </form>
      <ul className="bg-white border border-rose-soft rounded-xl divide-y divide-rose-soft/40">
        {rows.map((r) => (
          <li key={r.id} className="p-4 flex items-center justify-between text-sm">
            <div>
              <div>{r.nome}</div>
              <div className="text-xs text-foreground/50">/{r.slug}</div>
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => toggle(r)} className={r.ativo ? "text-green-700" : "text-foreground/50"}>{r.ativo ? "Ativa" : "Inativa"}</button>
              <button onClick={() => rename(r)} className="text-gold">Editar</button>
              <button onClick={() => remove(r)} className="text-red-600">Excluir</button>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="p-6 text-center text-foreground/60 text-sm">Nenhuma categoria.</li>}
      </ul>
    </div>
  );
}
