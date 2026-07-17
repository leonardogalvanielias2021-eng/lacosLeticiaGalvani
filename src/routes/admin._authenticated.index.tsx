import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import { ProductsService } from "@/services/products.service";
import { MigrationService } from "@/services/migration.service";
import { toast } from "sonner";
import { Package, Tag, ArrowUpRight, DatabaseZap, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/_authenticated/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => CategoriesService.getAll(true),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => ProductsService.getAll(true),
  });

  const migrationMutation = useMutation({
    mutationFn: MigrationService.migrateMockData,
    onSuccess: () => {
      toast.success("Dados locais migrados com sucesso para o banco de dados!");
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      queryClient.invalidateQueries({ queryKey: ["products-all"] });
    },
    onError: (error: any) => {
      toast.error(`Falha na migração: ${error.message}`);
    },
  });

  const activeProducts = products?.filter((p) => p.is_active && !p.deleted_at).length || 0;
  const activeCategories = categories?.filter((c) => c.is_active && !c.deleted_at).length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel administrativo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex items-center gap-4">
          <div className="size-12 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0 text-foreground">
            <Package className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Produtos Ativos
            </p>
            <h3 className="text-2xl font-semibold font-display">
              {isLoadingProducts ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : activeProducts}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex items-center gap-4">
          <div className="size-12 rounded-full bg-sand flex items-center justify-center flex-shrink-0 text-foreground">
            <Tag className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Categorias Ativas
            </p>
            <h3 className="text-2xl font-semibold font-display">
              {isLoadingCategories ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : activeCategories}
            </h3>
          </div>
        </div>
      </div>

      {/* Migration Banner */}
      <div className="bg-foreground text-background p-8 rounded-3xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DatabaseZap className="size-32" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-xl font-display italic mb-3">Sincronização de Banco de Dados</h3>
          <p className="text-sm text-background/80 mb-6 leading-relaxed">
            Detectamos que você ainda possui produtos falsos armazenados localmente no código da vitrine. 
            Clique abaixo para copiar essas informações para o banco de dados oficial (Supabase) 
            para que você possa começar a editá-los e apagá-los pelo painel.
          </p>
          <button
            onClick={() => migrationMutation.mutate()}
            disabled={migrationMutation.isPending}
            className="flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Migrando dados...
              </>
            ) : (
              <>
                Iniciar Migração <ArrowUpRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
