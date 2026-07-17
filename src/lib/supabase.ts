import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Correção para casos onde o VITE_SUPABASE_URL vem malformado dos secrets injetados
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.replace("https:https://", "https://").trim();
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").trim();
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("ERRO CRÍTICO: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não estão definidas no arquivo .env. Certifique-se de configurar e reiniciar o servidor Vite.");
}

console.log("Diagnóstico - URL do Supabase carregada:", supabaseUrl);
console.log("Diagnóstico - Anon Key está definida?", !!supabaseAnonKey);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    }
  }
);
