import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.navigate({ to: "/admin/login", replace: true });
        return;
      }

      // Check role
      const { data: isRoleAdmin, error } = await supabase
        .rpc("has_role", { role_name: "admin" });

      if (error || !isRoleAdmin) {
        console.error("Erro ao verificar permissão:", error);
        // Not admin
        router.navigate({ to: "/", replace: true });
        return;
      }

      setIsAuthorized(true);
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.navigate({ to: "/admin/login", replace: true });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-gold text-sm tracking-widest uppercase">
          Carregando Painel...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
