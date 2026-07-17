import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Limpar tokens sensíveis da URL caso a pessoa caia aqui vindo de um link de confirmação do Supabase
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes("access_token")) {
      // O Supabase processa a sessão automaticamente por baixo dos panos graças ao detectSessionInUrl.
      // Damos um pequeno delay e limpamos a URL para segurança.
      const timer = setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("DIAGNÓSTICO COMPLETO - SUPABASE AUTH ERROR:");
        console.error("error.message:", error.message);
        console.error("error.code:", (error as any).code || 'Indefinido no objeto');
        console.error("error.status:", error.status);

        // Exibir erro original detalhado para debug
        toast.error(`Erro: ${error.message} (Código: ${error.status || 'N/A'})`);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Verificar se é admin antes de permitir o acesso
        const { data: isRoleAdmin, error: roleError } = await supabase
          .rpc("has_role", { role_name: "admin" });

        if (roleError) {
          toast.error(`Erro de permissão: ${roleError.message}`);
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        if (!isRoleAdmin) {
          toast.error("Acesso negado: O seu usuário não tem privilégios de administrador.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        toast.success("Login efetuado com sucesso!");
        router.navigate({ to: "/admin", replace: true });
      }
    } catch (err: any) {
      toast.error(`Erro inesperado: ${err?.message || "Falha ao conectar ao servidor"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand/30 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display italic text-foreground">Painel Admin</h1>
          <p className="text-xs uppercase tracking-widest text-gold mt-2">Acesso Restrito</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-gold transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-gold transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
