import { useEffect, useState } from "react";
import { supabase, SUPABASE_CONFIGURED } from "./supabase";

export type AdminAuthState = {
  loading: boolean;
  configured: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    configured: SUPABASE_CONFIGURED,
    userId: null,
    email: null,
    isAdmin: false,
  });

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;

    const check = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (!cancelled)
          setState({
            loading: false,
            configured: true,
            userId: null,
            email: null,
            isAdmin: false,
          });
        return;
      }
      const { data, error } = await supabase!.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (cancelled) return;
      setState({
        loading: false,
        configured: true,
        userId,
        email,
        isAdmin: !error && data === true,
      });
    };

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      check(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function adminSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
