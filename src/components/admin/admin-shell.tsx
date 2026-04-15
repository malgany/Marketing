import { LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOutAdmin } from "../../data/admin";
import { cn } from "../../lib/utils";

const links = [
  { label: "Packs", to: "/admin/packs" },
  { label: "Categorias", to: "/admin/categories" },
  { label: "Site", to: "/" }
];

export function AdminShell() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf8_0%,#f1f1ef_100%)] text-black">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/92 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[8px] bg-black text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white">
              BP
            </div>
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
                Admin
              </p>
              <h1 className="text-[1.55rem] font-semibold leading-tight">Brandly Packs</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 rounded-[8px] border border-black/10 bg-[#f5f5f3] p-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-[8px] px-4 py-2 text-[0.95rem] font-medium transition-colors",
                    isActive
                      ? "bg-black text-white shadow-[0_10px_20px_rgba(8,8,8,0.16)]"
                      : "text-black/68 hover:bg-white hover:text-black"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-[8px] border border-black/10 bg-white px-4 py-2 text-[0.95rem] font-medium text-black/68 transition-colors hover:text-black"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-8">
        <Outlet />
      </div>
    </main>
  );
}
