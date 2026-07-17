import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/_authenticated/produtos/novo")({
  component: NovoProdutoPage,
});

function NovoProdutoPage() {
  return <ProductForm />;
}
