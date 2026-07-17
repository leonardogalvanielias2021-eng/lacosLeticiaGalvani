import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
type CategoriaInsert = Database["public"]["Tables"]["categorias"]["Insert"];
type CategoriaUpdate = Database["public"]["Tables"]["categorias"]["Update"];

export const CategoriesService = {
  async getAll(includeDeleted = false): Promise<Categoria[]> {
    let query = supabase.from("categorias").select("*").order("name");
    
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query;
    if (error) handleSupabaseError(error);
    return data || [];
  },

  async getById(id: string): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    return data;
  },

  async create(payload: CategoriaInsert): Promise<Categoria> {
    const { data, error } = await supabase
      .from("categorias")
      .insert(payload)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id: string, payload: CategoriaUpdate): Promise<Categoria> {
    const { data, error } = await supabase
      .from("categorias")
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
      .from("categorias")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) handleSupabaseError(error);
  },

  async hardDelete(id: string): Promise<void> {
    // Permanent deletion (Admin only)
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", id);

    if (error) handleSupabaseError(error);
  }
};
