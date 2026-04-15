import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkIsAdmin } from "../../data/admin";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

type GuardState = "checking" | "allowed" | "login" | "denied" | "config";

export function ProtectedAdminRoute() {
  const [state, setState] = useState<GuardState>("checking");
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!hasSupabaseConfig || !supabase) {
        setState("config");
        return;
      }

      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (!user) {
          setState("login");
          return;
        }

        const allowed = await checkIsAdmin();

        if (!isMounted) {
          return;
        }

        setState(allowed ? "allowed" : "denied");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        void error;
        setState("denied");
      }
    };

    void verify();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === "checking") {
    return <div className="min-h-screen bg-white p-8 text-black/64">Validando acesso...</div>;
  }

  if (state === "login") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (state === "config") {
    return (
      <div className="min-h-screen bg-white p-8 text-black">
        <h1 className="text-[1.5rem] font-semibold">Painel indisponivel</h1>
        <p className="mt-3 max-w-[42rem] text-black/68">Tente novamente em instantes.</p>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen bg-white p-8 text-black">
        <h1 className="text-[1.5rem] font-semibold">Acesso restrito</h1>
        <p className="mt-3 max-w-[42rem] text-black/68">Este acesso nao esta autorizado.</p>
      </div>
    );
  }

  return <Outlet />;
}
