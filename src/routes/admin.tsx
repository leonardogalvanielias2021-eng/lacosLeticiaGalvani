import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth, adminSignOut } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Painel · Letícia Galvani" }, { name: "robots", content: "noindex,nofollow" }] }),
});

function AdminLayout() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = path === "/admin/login";

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.configured) return;
    if (!auth.userId && !isLogin) {
      navigate({ to: "/admin/login", replace: true });
    } else if (auth.userId && !auth.isAdmin && !isLogin) {
      // sessão sem role admin: envia para home discretamente
      navigate({ to: "/", replace: true });
    } else if (auth.userId && auth.isAdmin && isLogin) {
      navigate({ to: "/admin", replace: true });
    }
  }, [auth, isLogin, navigate]);

  if (!auth.configured) {
    return (
      <div className="min-h-screen bg-nude/30 grid place-items-center p-6">
        <div className="max-w-lg bg-white border border-rose-soft rounded-xl p-8 space-y-4 text-sm">
          <h1 className="font-display text-2xl">Conecte seu Supabase</h1>
          <p className="text-foreground/70">
            O painel administrativo precisa das variáveis de ambiente do seu projeto Supabase.
            Adicione no arquivo <code>.env</code> (ou nas variáveis do projeto):
          </p>
          <pre className="bg-nude/50 p-3 rounded text-xs overflow-x-auto">{`VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key`}</pre>
          <p className="text-foreground/70">
            Depois rode o SQL de <code>docs/supabase-schema.sql</code> no SQL Editor do Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (auth.loading) {
    return <div className="min-h-screen grid place-items-center text-sm text-foreground/60">Carregando…</div>;
  }

  if (isLogin) return <Outlet />;
  if (!auth.userId || !auth.isAdmin) return null;

  return (
    <div className="min-h-screen bg-nude/20 flex">
      <aside className="w-60 bg-white border-r border-rose-soft p-6 hidden md:flex flex-col gap-1">
        <div className="mb-6">
          <div className="font-display text-xl">Painel</div>
          <div className="text-[10px] uppercase tracking-widest text-gold">Letícia Galvani</div>
        </div>
        <NavItem to="/admin" label="Dashboard" exact />
        <NavItem to="/admin/produtos" label="Produtos" />
        <NavItem to="/admin/categorias" label="Categorias" />
        <NavItem to="/admin/banners" label="Banners" />
        <NavItem to="/admin/configuracoes" label="Configurações" />
        <div className="mt-auto pt-6 border-t border-rose-soft/60 text-xs text-foreground/60 space-y-2">
          <div className="truncate">{auth.email}</div>
          <button
            onClick={async () => {
              await adminSignOut();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="text-gold hover:underline"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label, exact }: { to: string; label: string; exact?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? path === to : path === to || path.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded text-sm transition ${
        active ? "bg-rose-soft/60 text-foreground" : "text-foreground/70 hover:bg-rose-soft/30"
      }`}
    >
      {label}
    </Link>
  );
}
