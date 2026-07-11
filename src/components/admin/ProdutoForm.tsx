import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

type Categoria = { id: string; nome: string };
type Foto = { id?: string; url: string; ordem: number; principal: boolean };

type Props = { id?: string };

export function ProdutoForm({ id }: Props) {
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fotos, setFotos] = useState<Foto[]>([]);

  const [form, setForm] = useState({
    nome: "",
    slug: "",
    descricao_curta: "",
    descricao: "",
    preco: 0,
    preco_promocional: "" as number | "" ,
    categoria_id: "" as string,
    estoque: 0,
    destaque: false,
    novo: false,
    ativo: true,
  });

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("categorias")
      .select("id,nome")
      .order("nome")
      .then(({ data }) => setCategorias((data ?? []) as Categoria[]));
  }, []);

  useEffect(() => {
    if (!supabase || !id) return;
    (async () => {
      const { data } = await supabase.from("produtos").select("*").eq("id", id).single();
      if (data) {
        setForm({
          nome: data.nome ?? "",
          slug: data.slug ?? "",
          descricao_curta: data.descricao_curta ?? "",
          descricao: data.descricao ?? "",
          preco: Number(data.preco ?? 0),
          preco_promocional: data.preco_promocional ?? "",
          categoria_id: data.categoria_id ?? "",
          estoque: data.estoque ?? 0,
          destaque: !!data.destaque,
          novo: !!data.novo,
          ativo: !!data.ativo,
        });
      }
      const { data: f } = await supabase
        .from("produto_fotos")
        .select("id,url,ordem,principal")
        .eq("produto_id", id)
        .order("ordem");
      setFotos((f ?? []) as Foto[]);
    })();
  }, [id]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleUpload(files: FileList | null) {
    if (!supabase || !files || files.length === 0) return;
    setUploading(true);
    const uploaded: Foto[] = [];
    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("produtos").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        alert(`Erro no upload: ${error.message}`);
        continue;
      }
      const { data: pub } = supabase.storage.from("produtos").getPublicUrl(path);
      uploaded.push({ url: pub.publicUrl, ordem: fotos.length + uploaded.length, principal: false });
    }
    setFotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  async function removerFoto(idx: number) {
    const foto = fotos[idx];
    if (foto.id && supabase) {
      await supabase.from("produto_fotos").delete().eq("id", foto.id);
    }
    setFotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function marcarPrincipal(idx: number) {
    setFotos((prev) => prev.map((f, i) => ({ ...f, principal: i === idx })));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.nome),
      preco: Number(form.preco),
      preco_promocional: form.preco_promocional === "" ? null : Number(form.preco_promocional),
      categoria_id: form.categoria_id || null,
    };

    let produtoId = id;
    if (editing) {
      const { error } = await supabase.from("produtos").update(payload).eq("id", id!);
      if (error) { alert(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("produtos").insert(payload).select("id").single();
      if (error || !data) { alert(error?.message ?? "Erro"); setSaving(false); return; }
      produtoId = data.id;
    }

    // Sincronizar fotos: apagar existentes sem id (novas) já não têm; inserir novas.
    const novasFotos = fotos.filter((f) => !f.id);
    if (novasFotos.length > 0) {
      await supabase.from("produto_fotos").insert(
        novasFotos.map((f) => ({ ...f, produto_id: produtoId }))
      );
    }
    // Atualizar principal/ordem das existentes
    const existentes = fotos.filter((f) => f.id);
    for (const f of existentes) {
      await supabase.from("produto_fotos").update({ ordem: f.ordem, principal: f.principal }).eq("id", f.id!);
    }

    setSaving(false);
    navigate({ to: "/admin/produtos" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{editing ? "Editar produto" : "Novo produto"}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Nome">
          <input required value={form.nome} onChange={(e) => set("nome", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slug (URL)">
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="gerado do nome" className={inputCls} />
        </Field>
        <Field label="Descrição curta">
          <input value={form.descricao_curta} onChange={(e) => set("descricao_curta", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Categoria">
          <select value={form.categoria_id} onChange={(e) => set("categoria_id", e.target.value)} className={inputCls}>
            <option value="">— sem categoria —</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Field>
        <Field label="Preço (R$)">
          <input type="number" step="0.01" value={form.preco} onChange={(e) => set("preco", Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Preço promocional (R$)">
          <input type="number" step="0.01" value={form.preco_promocional as any} onChange={(e) => set("preco_promocional", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Estoque">
          <input type="number" value={form.estoque} onChange={(e) => set("estoque", Number(e.target.value))} className={inputCls} />
        </Field>
        <div className="flex gap-4 items-end">
          <Toggle label="Ativo" value={form.ativo} onChange={(v) => set("ativo", v)} />
          <Toggle label="Destaque" value={form.destaque} onChange={(v) => set("destaque", v)} />
          <Toggle label="Novidade" value={form.novo} onChange={(v) => set("novo", v)} />
        </div>
      </div>

      <Field label="Descrição completa">
        <textarea rows={5} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} className={inputCls} />
      </Field>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-foreground/70">Fotos</div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <div className="text-xs text-foreground/60">Enviando…</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fotos.map((f, i) => (
            <div key={i} className="border border-rose-soft rounded overflow-hidden bg-white">
              <img src={f.url} alt="" className="w-full aspect-square object-cover" />
              <div className="p-2 flex items-center justify-between text-xs">
                <button type="button" onClick={() => marcarPrincipal(i)} className={f.principal ? "text-gold font-medium" : "text-foreground/60"}>
                  {f.principal ? "★ Principal" : "☆ Principal"}
                </button>
                <button type="button" onClick={() => removerFoto(i)} className="text-red-600">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-gold text-white text-xs uppercase tracking-widest px-6 py-3 rounded hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/produtos" })} className="text-xs uppercase tracking-widest px-6 py-3 rounded border border-rose-soft">
          Cancelar
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-rose-soft rounded px-3 py-2 text-sm bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-widest text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
