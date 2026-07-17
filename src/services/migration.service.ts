import { supabase } from "@/lib/supabase";

export const MigrationService = {
  async migrateMockData() {
    console.log("Mock data foi removido, nada a migrar.");
    return true;
  }
};
