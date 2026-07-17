import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

type Config = Database["public"]["Tables"]["configuracoes_loja"]["Row"];
type ConfigUpdate = Database["public"]["Tables"]["configuracoes_loja"]["Update"];

export const SettingsService = {
  async getSettings(): Promise<Config | null> {
    const { data, error } = await supabase
      .from("configuracoes_loja")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) handleSupabaseError(error);
    return data;
  },

  async createSettings(payload: Database["public"]["Tables"]["configuracoes_loja"]["Insert"]): Promise<Config> {
    const { data, error } = await supabase
      .from("configuracoes_loja")
      .insert(payload)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async updateSettings(id: string, payload: ConfigUpdate): Promise<Config> {
    const { data, error } = await supabase
      .from("configuracoes_loja")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }
};
