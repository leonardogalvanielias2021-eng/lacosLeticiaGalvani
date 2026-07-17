import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

type Produto = Database["public"]["Tables"]["produtos"]["Row"];
type ProdutoInsert = Database["public"]["Tables"]["produtos"]["Insert"];
type ProdutoUpdate = Database["public"]["Tables"]["produtos"]["Update"];

export const ProductsService = {
  async getAll(includeDeleted = false): Promise<Produto[]> {
    let query = supabase.from("produtos").select("*, categorias(name)").order("created_at", { ascending: false });
    
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query;
    if (error) handleSupabaseError(error);
    return data || [];
  },

  async getById(id: string): Promise<Produto | null> {
    const { data, error } = await supabase
      .from("produtos")
      .select("*, categorias(name), produto_fotos(*), produto_variacoes(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    return data;
  },

  async create(payload: ProdutoInsert): Promise<Produto> {
    const { data, error } = await supabase
      .from("produtos")
      .insert(payload)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id: string, payload: ProdutoUpdate): Promise<Produto> {
    const { data, error } = await supabase
      .from("produtos")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async delete(id: string): Promise<void> {
    // Soft delete
    const { error } = await supabase
      .from("produtos")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) handleSupabaseError(error);
  },

  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) handleSupabaseError(error);
  },

  async saveVariations(productId: string, variations: Database["public"]["Tables"]["produto_variacoes"]["Insert"][]): Promise<void> {
    // Primeiro deleta as que não estão na nova lista
    const currentVariations = await supabase.from("produto_variacoes").select("id").eq("product_id", productId);
    const newIds = variations.map(v => v.id).filter(Boolean);
    
    if (currentVariations.data) {
      const idsToDelete = currentVariations.data.filter(v => !newIds.includes(v.id)).map(v => v.id);
      if (idsToDelete.length > 0) {
        await supabase.from("produto_variacoes").delete().in("id", idsToDelete);
      }
    }

    // Insere ou atualiza as novas
    if (variations.length > 0) {
      const payload = variations.map(v => ({
        ...v,
        product_id: productId
      }));
      const { error } = await supabase.from("produto_variacoes").upsert(payload);
      if (error) handleSupabaseError(error);
    }
  }
};
