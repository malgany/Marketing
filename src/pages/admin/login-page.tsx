import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInAdmin } from "../../data/admin";
import { hasSupabaseConfig } from "../../lib/supabase";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await signInAdmin(email, password);
      navigate("/admin/packs", { replace: true });
    } catch {
      setErrorMessage("Nao foi possivel entrar com esses dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6 py-10 text-black">
      <div className="w-full max-w-[430px] rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(8,8,8,0.06)]">
        <Link to="/" className="inline-flex items-center gap-2 text-[0.94rem] font-medium text-black/58">
          <ArrowLeft className="size-4" />
          Voltar para o site
        </Link>

        <h1 className="mt-8 text-[2rem] font-semibold leading-tight">Entrar no painel</h1>
        <p className="mt-2 text-[0.98rem] leading-[1.5] text-black/62">
          Use o e-mail e a senha autorizados para o painel.
        </p>

        {!hasSupabaseConfig ? (
          <div className="mt-6 rounded-[8px] bg-[#f7f7f7] p-4 text-[0.94rem] text-black/68">
            Acesso temporariamente indisponivel.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[0.86rem] font-medium text-black/62">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
              />
            </label>

            <label className="block">
              <span className="text-[0.86rem] font-medium text-black/62">Senha</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
              />
            </label>

            {errorMessage ? (
              <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[0.92rem] text-red-900">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[8px] bg-black px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
