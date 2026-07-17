import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BannersService } from "@/services/banners.service";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Database } from "@/types/database.types";

type Banner = Database["public"]["Tables"]["banners"]["Row"];
type BannerInsert = Database["public"]["Tables"]["banners"]["Insert"];

export const Route = createFileRoute("/admin/_authenticated/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<BannerInsert>>({
    title: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_order: 0
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners-all"],
    queryFn: () => BannersService.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<BannerInsert>) => BannersService.create(data as BannerInsert),
    onSuccess: () => {
      toast.success("Banner criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners-all"] });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Banner>) => BannersService.update(data.id!, data),
    onSuccess: () => {
      toast.success("Banner atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners-all"] });
      setIsEditOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BannersService.delete(id),
    onSuccess: () => {
      toast.success("Banner excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banners-all"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ title: "", image_url: "", link_url: "", is_active: true, display_order: 0 });
    setEditingId(null);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title || "",
      image_url: banner.image_url,
      link_url: banner.link_url || "",
      is_active: banner.is_active,
      display_order: banner.display_order
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display text-foreground">Galeria (Fotos)</h2>
          <p className="text-muted-foreground mt-1">Gerencie as fotos da seção "Nossas Princesas" na página inicial.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background hover:bg-gold transition-colors rounded-full uppercase tracking-widest text-xs px-6">
              <Plus className="size-4 mr-2" /> Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Criar Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Título (Opcional)</label>
                <Input 
                  value={formData.title || ""} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Promoção de Verão" 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">URL da Imagem *</label>
                <Input 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..." 
                  className="rounded-xl"
                />
                <p className="text-[10px] text-muted-foreground">Em breve o upload de imagens estará disponível. Por enquanto, cole a URL de uma imagem.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Link de Destino (Opcional)</label>
                <Input 
                  value={formData.link_url || ""} 
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="Ex: /produtos/promocao" 
                  className="rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Ordem</label>
                  <Input 
                    type="number"
                    value={formData.display_order} 
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Ativo</label>
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending || !formData.image_url}
                className="bg-foreground text-background hover:bg-gold transition-colors rounded-full"
              >
                {createMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Salvar Banner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-sand/30 hover:bg-sand/30">
              <TableHead className="w-[100px] font-medium text-xs uppercase tracking-widest">Preview</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest">Título / Link</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest text-center">Ordem</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest text-center">Status</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                  Carregando banners...
                </TableCell>
              </TableRow>
            ) : banners?.filter(b => !b.deleted_at).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum banner cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              banners?.filter(b => !b.deleted_at).map((banner) => (
                <TableRow key={banner.id} className="hover:bg-sand/10 transition-colors">
                  <TableCell>
                    <div className="h-12 w-20 rounded-md overflow-hidden bg-sand flex items-center justify-center border border-border relative">
                      {banner.image_url ? (
                        <img 
                          src={banner.image_url} 
                          alt={banner.title || "Banner"} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <ImageIcon className={`size-4 text-muted-foreground ${banner.image_url ? 'hidden absolute' : ''}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{banner.title || "Sem título"}</div>
                    {banner.link_url && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {banner.link_url}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-sand text-xs font-medium">
                      {banner.display_order}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {banner.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-green-100 text-green-700">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-sand text-muted-foreground">
                        Inativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(banner)} className="rounded-full">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este banner?")) {
                            deleteMutation.mutate(banner.id);
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
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Editar Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Título (Opcional)</label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">URL da Imagem *</label>
              <Input 
                value={formData.image_url} 
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Link de Destino (Opcional)</label>
              <Input 
                value={formData.link_url || ""} 
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Ordem</label>
                <Input 
                  type="number"
                  value={formData.display_order} 
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Ativo</label>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => updateMutation.mutate({ id: editingId!, ...formData })}
              disabled={updateMutation.isPending || !formData.image_url}
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
