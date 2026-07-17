import { PostgrestError } from "@supabase/supabase-js";

export class AppError extends Error {
  public code?: string;
  public details?: string;

  constructor(message: string, code?: string, details?: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}

export function handleSupabaseError(error: PostgrestError | Error | unknown): never {
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    const pgError = error as PostgrestError;
    throw new AppError(pgError.message, pgError.code, pgError.details);
  }
  
  if (error instanceof Error) {
    throw new AppError(error.message);
  }

  throw new AppError("Ocorreu um erro desconhecido.");
}
