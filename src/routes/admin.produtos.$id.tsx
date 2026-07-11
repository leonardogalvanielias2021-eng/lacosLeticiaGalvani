import { createFileRoute } from "@tanstack/react-router";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export const Route = createFileRoute("/admin/produtos/$id")({
  ssr: false,
  component: EditProduto,
});

function EditProduto() {
  const { id } = Route.useParams();
  return <ProdutoForm id={id} />;
}
