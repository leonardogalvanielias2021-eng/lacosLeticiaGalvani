import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products.service";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["produtos"]["Row"] & {
  category?: { name: string } | null;
};

export const Route = createFileRoute("/admin/_authenticated/produtos/")({
  component: AdminProdutosIndex,
});

function AdminProdutosIndex() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // O ProductsService precisa retornar os produtos já populando a categoria.
  const { data: products, isLoading } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => ProductsService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductsService.delete(id),
    onSuccess: () => {
      toast.success("Produto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products-all"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display text-foreground">Produtos</h2>
          <p className="text-muted-foreground mt-1">Gerencie os produtos, preços e estoques.</p>
        </div>

        <Button 
          onClick={() => router.navigate({ to: "/admin/produtos/novo" })}
          className="bg-foreground text-background hover:bg-gold transition-colors rounded-full uppercase tracking-widest text-xs px-6"
        >
          <Plus className="size-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-sand/30 hover:bg-sand/30">
              <TableHead className="font-medium text-xs uppercase tracking-widest">Produto</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest">Categoria</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest">Preço</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest">Estoque</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                  Carregando produtos...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id} className="hover:bg-sand/10 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.categorias?.name || "Sem categoria"}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-green-100 text-green-700">
                        {product.stock} un
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-rose-100 text-rose-700">
                        Esgotado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.navigate({ to: "/admin/produtos/$id", params: { id: product.id } })} 
                        className="rounded-full"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este produto?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="rounded-full text-rose-deep border-rose-deep/20 hover:bg-rose-deep hover:text-white"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
