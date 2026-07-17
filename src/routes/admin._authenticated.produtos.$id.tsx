import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/services/products.service";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/_authenticated/produtos/$id")({
  component: EditarProdutoPage,
});

function EditarProdutoPage() {
  const { id } = Route.useParams();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Carregando dados do produto...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-rose-deep text-lg mb-2">Produto não encontrado.</p>
        <p className="text-muted-foreground">O produto que você tentou acessar não existe ou foi excluído.</p>
      </div>
    );
  }

  return <ProductForm initialData={product} />;
}
