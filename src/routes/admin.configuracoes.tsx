import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/configuracoes")({
  ssr: false,
  component: Configuracoes,
});

const CAMPOS: { chave: string; label: string; textarea?: boolean }[] = [
  { chave: "whatsapp", label: "WhatsApp (com DDI, ex: 5511999999999)" },
  { chave: "instagram", label: "Instagram (URL)" },
  { chave: "facebook", label: "Facebook (URL)" },
  { chave: "email", label: "E-mail de contato" },
  { chave: "endereco", label: "Endereço" },
  { chave: "sobre_texto", label: "Texto do Sobre", textarea: true },
];

function Configuracoes() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.from("configuracoes_loja").select("chave,valor").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (map[r.chave] = r.valor ?? ""));
      setValues(map);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const rows = CAMPOS.map((c) => ({ chave: c.chave, valor: values[c.chave] ?? "", updated_at: new Date().toISOString() }));
    await supabase.from("configuracoes_loja").upsert(rows, { onConflict: "chave" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl">Configurações</h1>
      {CAMPOS.map((c) => (
        <label key={c.chave} className="block space-y-1">
          <span className="text-xs uppercase tracking-widest text-foreground/70">{c.label}</span>
          {c.textarea ? (
            <textarea rows={4} value={values[c.chave] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [c.chave]: e.target.value }))} className="w-full border border-rose-soft rounded px-3 py-2 text-sm bg-white" />
          ) : (
            <input value={values[c.chave] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [c.chave]: e.target.value }))} className="w-full border border-rose-soft rounded px-3 py-2 text-sm bg-white" />
          )}
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button className="bg-gold text-white text-xs uppercase tracking-widest px-6 py-3 rounded">Salvar</button>
        {saved && <span className="text-sm text-green-700">Salvo!</span>}
      </div>
    </form>
  );
}
