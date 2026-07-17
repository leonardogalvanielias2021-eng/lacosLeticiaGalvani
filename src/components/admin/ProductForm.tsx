import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import { ProductsService } from "@/services/products.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, ImagePlus, Plus, Trash2, Save } from "lucide-react";
import type { Database } from "@/types/database.types";

type ProductInsert = Database["public"]["Tables"]["produtos"]["Insert"];
type ProductRow = Database["public"]["Tables"]["produtos"]["Row"] & {
  produto_variacoes?: Database["public"]["Tables"]["produto_variacoes"]["Row"][];
};

export function ProductForm({ initialData }: { initialData?: ProductRow }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Partial<ProductInsert>>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    old_price: initialData?.old_price || null,
    category_id: initialData?.category_id || null,
    age_range: initialData?.age_range || "todas",
    materials: initialData?.materials || "",
    measurements: initialData?.measurements || "",
    stock: initialData?.stock || 0,
    is_new: initialData?.is_new ?? true,
    is_bestseller: initialData?.is_bestseller ?? false,
    is_active: initialData?.is_active ?? true,
    rating: initialData?.rating || 5,
    reviews: initialData?.reviews || 0,
  });

  const [variations, setVariations] = useState<Partial<Database["public"]["Tables"]["produto_variacoes"]["Insert"]>[]>(
    initialData?.produto_variacoes || []
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => CategoriesService.getAll(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ProductInsert>) => {
      let product;
      if (isEditing && initialData.id) {
        product = await ProductsService.update(initialData.id, data);
      } else {
        product = await ProductsService.create(data as ProductInsert);
      }
      
      // Save variations if there's a product id
      if (product.id && variations.length > 0) {
        await ProductsService.saveVariations(product.id, variations as any);
      }
      
      return product;
    },
    onSuccess: () => {
      toast.success(isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products-all"] });
      router.navigate({ to: "/admin/produtos" });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.price || !formData.category_id) {
      toast.error("Preencha todos os campos obrigatórios (Nome, Slug, Preço e Categoria).");
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => router.navigate({ to: "/admin/produtos" })}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-display text-foreground">
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </h2>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-foreground text-background hover:bg-gold transition-colors rounded-full uppercase tracking-widest text-xs px-8"
        >
          {saveMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          {isEditing ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-soft space-y-6">
            <h3 className="font-display text-xl border-b border-border pb-2">Informações Básicas</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome do Produto *</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Laço Boutique Rosa" 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (URL) *</label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Descrição Curta</label>
                <Input 
                  value={formData.short_description || ""} 
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Resumo que aparece no card do produto" 
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Descrição Completa</label>
                <Textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes completos do produto..." 
                  className="rounded-xl min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-soft space-y-6">
            <h3 className="font-display text-xl border-b border-border pb-2">Detalhes Técnicos</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Idade Recomendada</label>
                <Select 
                  value={formData.age_range || "todas"} 
                  onValueChange={(val) => setFormData({ ...formData, age_range: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-12m">0-12 meses (Bebê)</SelectItem>
                    <SelectItem value="1-3a">1-3 anos (Toddler)</SelectItem>
                    <SelectItem value="3-6a">3-6 anos</SelectItem>
                    <SelectItem value="6-10a">6-10 anos</SelectItem>
                    <SelectItem value="todas">Todas as Idades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Materiais</label>
                <Input 
                  value={formData.materials || ""} 
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="Ex: Cetim, Bico de Pato" 
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Medidas</label>
                <Input 
                  value={formData.measurements || ""} 
                  onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                  placeholder="Ex: 10cm x 8cm" 
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-soft space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="font-display text-xl">Variações (Cores/Modelos)</h3>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-8"
                onClick={() => setVariations([...variations, { name: "", hex_code: "", stock: 0, image_url: "" }])}
              >
                <Plus className="size-3 mr-1" /> Adicionar
              </Button>
            </div>
            
            <div className="space-y-4">
              {variations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma variação adicionada. Se o produto tiver cores diferentes, adicione aqui.</p>
              ) : (
                variations.map((v, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 bg-sand/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Nome (ex: Rosa Bebê)</label>
                        <Input 
                          value={v.name || ""} 
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].name = e.target.value;
                            setVariations(newVars);
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Cor (Hex)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={v.hex_code || "#000000"} 
                            onChange={(e) => {
                              const newVars = [...variations];
                              newVars[i].hex_code = e.target.value;
                              setVariations(newVars);
                            }}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <Input 
                            value={v.hex_code || ""} 
                            onChange={(e) => {
                              const newVars = [...variations];
                              newVars[i].hex_code = e.target.value;
                              setVariations(newVars);
                            }}
                            placeholder="#HEX"
                            className="h-8 text-sm px-2 font-mono"
                          />
                        </div>
                      </div>
                      <div className="w-20 space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Estoque</label>
                        <Input 
                          type="number"
                          value={v.stock || 0} 
                          onChange={(e) => {
                            const newVars = [...variations];
                            newVars[i].stock = parseInt(e.target.value) || 0;
                            setVariations(newVars);
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="mt-5 text-rose-deep hover:bg-rose-deep/10"
                        onClick={() => {
                          const newVars = [...variations];
                          newVars.splice(i, 1);
                          setVariations(newVars);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">URL da Foto desta Cor (Opcional mas recomendado)</label>
                      <Input 
                        value={v.image_url || ""} 
                        onChange={(e) => {
                          const newVars = [...variations];
                          newVars[i].image_url = e.target.value;
                          setVariations(newVars);
                        }}
                        placeholder="https://..."
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-soft space-y-6">
            <h3 className="font-display text-xl border-b border-border pb-2">Organização</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Categoria *</label>
                <Select 
                  value={formData.category_id || ""} 
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={isLoadingCategories ? "Carregando..." : "Selecione uma categoria"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Preço *</label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Estoque *</label>
                  <Input 
                    type="number"
                    min="0"
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Preço Antigo (Promocional)</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.old_price || ""} 
                  onChange={(e) => setFormData({ ...formData, old_price: e.target.value ? parseFloat(e.target.value) : null })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-soft space-y-6">
            <h3 className="font-display text-xl border-b border-border pb-2">Configurações</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Produto Ativo</label>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lançamento (Novo)</label>
                <Switch 
                  checked={formData.is_new}
                  onCheckedChange={(val) => setFormData({ ...formData, is_new: val })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mais Vendido</label>
                <Switch 
                  checked={formData.is_bestseller}
                  onCheckedChange={(val) => setFormData({ ...formData, is_bestseller: val })}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-sand/30 p-6 rounded-2xl border border-border border-dashed text-center space-y-2">
            <ImagePlus className="size-8 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-medium">Galeria de Fotos</h4>
            <p className="text-xs text-muted-foreground">O upload de imagens será implementado na próxima etapa do sistema.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
