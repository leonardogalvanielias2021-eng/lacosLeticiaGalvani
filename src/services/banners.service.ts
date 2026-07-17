import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

type Banner = Database["public"]["Tables"]["banners"]["Row"];
type BannerInsert = Database["public"]["Tables"]["banners"]["Insert"];
type BannerUpdate = Database["public"]["Tables"]["banners"]["Update"];

export const BannersService = {
  async getAll(includeDeleted = false): Promise<Banner[]> {
    let query = supabase.from("banners").select("*").order("display_order");
    
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query;
    if (error) handleSupabaseError(error);
    return data || [];
  },

  async create(payload: BannerInsert): Promise<Banner> {
    const { data, error } = await supabase
      .from("banners")
      .insert(payload)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id: string, payload: BannerUpdate): Promise<Banner> {
    const { data, error } = await supabase
      .from("banners")
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
      .from("banners")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) handleSupabaseError(error);
  },

  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (error) handleSupabaseError(error);
  }
};
