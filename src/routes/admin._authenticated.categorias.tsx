import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categorias"]["Row"];

export const Route = createFileRoute("/admin/_authenticated/categorias")({
  component: AdminCategorias,
});

function AdminCategorias() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => CategoriesService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string }) => CategoriesService.create({ ...data, is_active: true }),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      setIsCreateOpen(false);
      setFormData({ name: "", slug: "" });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; slug: string }) => CategoriesService.update(data.id, { name: data.name, slug: data.slug }),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      setIsEditOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoriesService.delete(id),
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleNameChange = (name: string) => {
    // Generate slug automatically
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ name, slug });
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display text-foreground">Categorias</h2>
          <p className="text-muted-foreground mt-1">Gerencie as categorias de produtos da loja.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background hover:bg-gold transition-colors rounded-full uppercase tracking-widest text-xs px-6">
              <Plus className="size-4 mr-2" /> Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Criar Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Laços Boutique" 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (URL)</label>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ex: lacos-boutique" 
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending || !formData.name || !formData.slug}
                className="bg-foreground text-background hover:bg-gold transition-colors rounded-full"
              >
                {createMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Salvar Categoria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-sand/30 hover:bg-sand/30">
              <TableHead className="font-medium text-xs uppercase tracking-widest">Nome</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest">Slug</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                  Carregando categorias...
                </TableCell>
              </TableRow>
            ) : categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                  Nenhuma categoria cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id} className="hover:bg-sand/10 transition-colors">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(category)} className="rounded-full">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir esta categoria?")) {
                            deleteMutation.mutate(category.id);
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Editar Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome</label>
              <Input 
                value={formData.name} 
                onChange={(e) => handleNameChange(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (URL)</label>
              <Input 
                value={formData.slug} 
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => updateMutation.mutate({ id: editingId!, name: formData.name, slug: formData.slug })}
              disabled={updateMutation.isPending || !formData.name || !formData.slug}
              className="bg-foreground text-background hover:bg-gold transition-colors rounded-full"
            >
              {updateMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
