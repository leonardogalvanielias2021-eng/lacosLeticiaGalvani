import { createFileRoute } from "@tanstack/react-router";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export const Route = createFileRoute("/admin/produtos/novo")({
  ssr: false,
  component: () => <ProdutoForm />,
});
