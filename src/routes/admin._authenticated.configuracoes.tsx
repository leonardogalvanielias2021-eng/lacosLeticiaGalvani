import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import type { Database } from "@/types/database.types";

type Config = Database["public"]["Tables"]["configuracoes_loja"]["Row"];

export const Route = createFileRoute("/admin/_authenticated/configuracoes")({
  component: AdminConfiguracoes,
});

function AdminConfiguracoes() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Config>>({
    store_name: "",
    contact_email: "",
    whatsapp_number: "",
    instagram_url: "",
    about_text: "",
    about_image_url: "",
    top_banner_text: "",
    business_hours: "",
    address: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name,
        contact_email: settings.contact_email || "",
        whatsapp_number: settings.whatsapp_number || "",
        instagram_url: settings.instagram_url || "",
        about_text: settings.about_text || "",
        about_image_url: settings.about_image_url || "",
        top_banner_text: settings.top_banner_text || "",
        business_hours: settings.business_hours || "",
        address: settings.address || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Config>) => {
      if (!settings?.id) {
        // If there's no settings row yet, create one
        return SettingsService.createSettings({
          store_name: data.store_name || "Nova Loja",
          contact_email: data.contact_email,
          whatsapp_number: data.whatsapp_number,
          instagram_url: data.instagram_url,
          about_text: data.about_text,
          about_image_url: data.about_image_url,
          top_banner_text: data.top_banner_text,
          business_hours: data.business_hours,
          address: data.address
        });
      }
      return SettingsService.updateSettings(settings.id, data);
    },
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.store_name) {
      toast.error("O nome da loja é obrigatório.");
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-3xl font-display text-foreground">Configurações</h2>
        <p className="text-muted-foreground mt-1">Gerencie as informações de contato e redes sociais da loja.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-border shadow-soft">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-8 animate-spin mb-4" />
            <p>Carregando configurações...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="geral" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-sand/50 p-1 rounded-xl">
                <TabsTrigger value="geral" className="rounded-lg text-sm font-semibold">Geral</TabsTrigger>
                <TabsTrigger value="contato" className="rounded-lg text-sm font-semibold">Contato e Local</TabsTrigger>
                <TabsTrigger value="sobre" className="rounded-lg text-sm font-semibold">Sobre Nós</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome da Loja *</label>
                  <Input 
                    value={formData.store_name} 
                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                    placeholder="Ex: Laços Letícia Galvani" 
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Texto do Banner de Topo (Frete)</label>
                  <Input 
                    value={formData.top_banner_text || ""} 
                    onChange={(e) => setFormData({ ...formData, top_banner_text: e.target.value })}
                    placeholder="Frete grátis em compras acima de R$ 250" 
                    className="rounded-xl"
                  />
                </div>
              </TabsContent>

              <TabsContent value="contato" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp de Contato</label>
                  <Input 
                    value={formData.whatsapp_number} 
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="Ex: 5511999999999" 
                    className="rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">Use apenas números, incluindo o código do país (ex: 55).</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E-mail de Contato</label>
                  <Input 
                    type="email"
                    value={formData.contact_email} 
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contato@loja.com.br" 
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL do Instagram</label>
                  <Input 
                    value={formData.instagram_url} 
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/seuperfil" 
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Horário de Funcionamento</label>
                  <textarea 
                    value={formData.business_hours || ""} 
                    onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                    placeholder="Segunda a Sexta · 09h às 18h&#10;Sábados · 09h às 13h" 
                    className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Endereço da Loja</label>
                  <textarea 
                    value={formData.address || ""} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua das Fitas, 123 · Vila Delicada&#10;São Paulo, SP · CEP 00000-000" 
                    className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="sobre" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nossa História (Texto)</label>
                  <textarea 
                    value={formData.about_text || ""} 
                    onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                    placeholder="Conte um pouco sobre como a loja começou..." 
                    className="flex min-h-[160px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nossa História (URL da Foto)</label>
                  <Input 
                    value={formData.about_image_url || ""} 
                    onChange={(e) => setFormData({ ...formData, about_image_url: e.target.value })}
                    placeholder="https://sua-imagem.com/foto.jpg" 
                    className="rounded-xl"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit"
                disabled={updateMutation.isPending || !formData.store_name}
                className="bg-foreground text-background hover:bg-gold transition-colors rounded-full uppercase tracking-widest text-xs px-8"
              >
                {updateMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                Salvar Configurações
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
