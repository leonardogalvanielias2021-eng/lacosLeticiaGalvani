import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { LayoutDashboard, Package, Tag, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/_authenticated")({
  component: AdminLayout,
});

function AdminLayout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-sand/20 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <h1 className="font-display italic text-2xl text-foreground">Painel Admin</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mt-1">Letícia Galvani</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-rose-soft/50 hover:text-foreground [&.active]:bg-rose-soft [&.active]:text-foreground transition-colors" activeProps={{ className: "bg-rose-soft text-foreground font-semibold" }} activeOptions={{ exact: true }}>
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
            <Link to="/admin/produtos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-rose-soft/50 hover:text-foreground [&.active]:bg-rose-soft [&.active]:text-foreground transition-colors" activeProps={{ className: "bg-rose-soft text-foreground font-semibold" }}>
              <Package className="size-4" /> Produtos
            </Link>
            <Link to="/admin/categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-rose-soft/50 hover:text-foreground [&.active]:bg-rose-soft [&.active]:text-foreground transition-colors" activeProps={{ className: "bg-rose-soft text-foreground font-semibold" }}>
              <Tag className="size-4" /> Categorias
            </Link>
            <Link to="/admin/banners" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-rose-soft/50 hover:text-foreground [&.active]:bg-rose-soft [&.active]:text-foreground transition-colors" activeProps={{ className: "bg-rose-soft text-foreground font-semibold" }}>
              <ImageIcon className="size-4" /> Banners
            </Link>
            <Link to="/admin/configuracoes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:bg-rose-soft/50 hover:text-foreground [&.active]:bg-rose-soft [&.active]:text-foreground transition-colors" activeProps={{ className: "bg-rose-soft text-foreground font-semibold" }}>
              <Settings className="size-4" /> Configurações
            </Link>
          </nav>
          <div className="p-4 border-t border-border space-y-2">
            <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-sand/50 w-full transition-colors">
              <LogOut className="size-4 rotate-180" /> Ir para a Loja
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}
