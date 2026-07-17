import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/error-utils";

const BUCKET = "produtos";

export const StorageService = {
  /**
   * Faz upload de um arquivo para o Storage na pasta especificada.
   * Exemplo de path: 'banners/banner-1.jpg' ou 'produtos/foto-1.png'
   */
  async uploadFile(path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });

    if (error) {
      handleSupabaseError(error);
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Remove um arquivo do Storage.
   */
  async removeFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      handleSupabaseError(error);
    }
  },

  /**
   * Move ou renomeia um arquivo no Storage.
   */
  async moveFile(fromPath: string, toPath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET)
      .move(fromPath, toPath);

    if (error) {
      handleSupabaseError(error);
    }
  }
};
