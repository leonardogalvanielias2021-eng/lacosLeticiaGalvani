import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/banners")({
  ssr: false,
  component: Banners,
});

type Row = {
  id: string;
  titulo: string | null;
  imagem_desktop: string | null;
  imagem_mobile: string | null;
  link: string | null;
  ordem: number;
  ativo: boolean;
};

function Banners() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from("banners").select("*").order("ordem");
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => { load(); }, []);

  async function upload(file: File) {
    if (!supabase) return null;
    const path = `banners/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("produtos").upload(path, file);
    if (error) { alert(error.message); return null; }
    return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
  }

  async function novo() {
    if (!supabase) return;
    await supabase.from("banners").insert({ titulo: "Novo banner", ordem: rows.length, ativo: true });
    load();
  }
  async function save(r: Row) {
    if (!supabase) return;
    await supabase.from("banners").update({
      titulo: r.titulo, link: r.link, ordem: r.ordem, ativo: r.ativo,
      imagem_desktop: r.imagem_desktop, imagem_mobile: r.imagem_mobile,
    }).eq("id", r.id);
    load();
  }
  async function remove(r: Row) {
    if (!supabase || !confirm("Excluir banner?")) return;
    await supabase.from("banners").delete().eq("id", r.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Banners</h1>
        <button onClick={novo} className="bg-gold text-white text-xs uppercase tracking-widest px-5 py-3 rounded">Novo banner</button>
      </div>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="bg-white border border-rose-soft rounded-xl p-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-foreground/70">Título
                <input value={r.titulo ?? ""} onChange={(e) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, titulo: e.target.value } : x))} className="w-full border border-rose-soft rounded px-3 py-2 text-sm mt-1" />
              </label>
              <label className="block text-xs uppercase tracking-widest text-foreground/70">Link
                <input value={r.link ?? ""} onChange={(e) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, link: e.target.value } : x))} className="w-full border border-rose-soft rounded px-3 py-2 text-sm mt-1" />
              </label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={r.ativo} onChange={(e) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, ativo: e.target.checked } : x))} /> Ativo</label>
                <label className="flex items-center gap-2 text-xs">Ordem <input type="number" value={r.ordem} onChange={(e) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, ordem: Number(e.target.value) } : x))} className="w-16 border border-rose-soft rounded px-2 py-1" /></label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => save(r)} className="bg-gold text-white text-xs uppercase tracking-widest px-4 py-2 rounded">Salvar</button>
                <button onClick={() => remove(r)} className="border border-red-300 text-red-600 text-xs uppercase tracking-widest px-4 py-2 rounded">Excluir</button>
              </div>
            </div>
            <div className="space-y-3">
              <ImgUpload label="Desktop" value={r.imagem_desktop} onChange={async (v) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, imagem_desktop: v } : x))} upload={upload} />
              <ImgUpload label="Mobile" value={r.imagem_mobile} onChange={async (v) => setRows(rs => rs.map(x => x.id === r.id ? { ...x, imagem_mobile: v } : x))} upload={upload} />
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="text-center text-foreground/60 text-sm py-8">Nenhum banner.</div>}
      </div>
    </div>
  );
}

function ImgUpload({ label, value, onChange, upload }: { label: string; value: string | null; onChange: (v: string | null) => void; upload: (f: File) => Promise<string | null> }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-foreground/70 mb-1">{label}</div>
      {value && <img src={value} alt="" className="w-full max-h-32 object-cover rounded border border-rose-soft mb-2" />}
      <input type="file" accept="image/*" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = await upload(f);
        if (url) onChange(url);
      }} className="text-xs" />
    </div>
  );
}
