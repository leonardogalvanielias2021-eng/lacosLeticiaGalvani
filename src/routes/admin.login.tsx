import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Credenciais inválidas.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-nude/30 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-rose-soft rounded-xl p-8 space-y-4"
      >
        <div className="text-center mb-2">
          <div className="font-display text-2xl">Painel</div>
          <div className="text-[10px] uppercase tracking-widest text-gold">Acesso restrito</div>
        </div>
        <label className="block text-xs uppercase tracking-widest text-foreground/70">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-rose-soft rounded px-3 py-2 text-sm normal-case tracking-normal text-foreground"
          />
        </label>
        <label className="block text-xs uppercase tracking-widest text-foreground/70">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-rose-soft rounded px-3 py-2 text-sm normal-case tracking-normal text-foreground"
          />
        </label>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white text-sm uppercase tracking-widest py-3 rounded hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
