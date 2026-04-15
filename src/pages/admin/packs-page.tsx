import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Edit, Package, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { listAdminPacks, setAdminPackStatus } from "../../data/admin";
import { resolveMediaUrl } from "../../lib/storage";
import { cn } from "../../lib/utils";
import type { PackStatus, PackSummary } from "../../types/packs";

const panelClass =
  "rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_18px_36px_rgba(8,8,8,0.04)] sm:p-6";
const labelClass = "text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-black/42";
const helperClass = "mt-1 text-[0.92rem] leading-[1.55] text-black/56";
const inputClass =
  "w-full rounded-[8px] border border-black/12 bg-white px-4 py-3 text-[0.96rem] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5";
const chipClass =
  "inline-flex items-center rounded-[8px] border border-black/10 bg-[#f6f6f4] px-3 py-1 text-[0.82rem] font-medium text-black/58";
const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-black px-4 text-[0.92rem] font-semibold text-white transition-opacity hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-55";
const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white px-4 text-[0.92rem] font-semibold text-black transition-[background-color,color,border-color] hover:border-black hover:bg-black hover:text-white";

type FilterStatus = "all" | PackStatus;

const filterOptions: Array<{ label: string; value: FilterStatus }> = [
  { label: "Todos", value: "all" },
  { label: "Publicados", value: "published" },
  { label: "Rascunhos", value: "draft" }
];

export function AdminPacksPage() {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [updatingPackId, setUpdatingPackId] = useState("");

  const loadPacks = async ({ background = false }: { background?: boolean } = {}) => {
    if (!background) {
      setStatus("loading");
    }

    setErrorMessage("");

    try {
      const nextPacks = await listAdminPacks();
      setPacks(nextPacks);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel listar os packs.");

      if (!background) {
        setStatus("error");
      }
    }
  };

  useEffect(() => {
    void loadPacks();
  }, []);

  const toggleStatus = async (pack: PackSummary) => {
    setUpdatingPackId(pack.id);
    setErrorMessage("");

    try {
      await setAdminPackStatus(pack.id, pack.status === "published" ? "draft" : "published");
      await loadPacks({ background: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nao foi possivel atualizar o status."
      );
    } finally {
      setUpdatingPackId("");
    }
  };

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(packs.map((pack) => pack.categoryName || "Sem categoria"))
      ).sort((left, right) => left.localeCompare(right, "pt-BR")),
    [packs]
  );

  const filteredPacks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return packs.filter((pack) => {
      const haystack = [
        pack.title,
        pack.slug,
        pack.categoryName,
        pack.shortDescription
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || pack.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || (pack.categoryName || "Sem categoria") === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [packs, search, statusFilter, categoryFilter]);

  const totalCount = packs.length;
  const publishedCount = packs.filter((pack) => pack.status === "published").length;
  const draftCount = packs.filter((pack) => pack.status === "draft").length;
  const activeCount = packs.filter((pack) => pack.active).length;
  const hasFilters = Boolean(search.trim()) || statusFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <section className="space-y-6 pb-6">
      <div className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[46rem]">
            <p className={labelClass}>Catalogo</p>
            <h2 className="mt-2 text-[1.95rem] font-semibold text-black">Packs</h2>
            <p className="mt-3 text-[0.98rem] leading-[1.6] text-black/58">
              Encontre rapido o pack certo, revise o status e abra a edicao sem precisar varrer
              uma tabela longa.
            </p>
          </div>

          <Link to="/admin/packs/new" className={primaryButtonClass}>
            <Plus className="size-4" />
            Novo pack
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-4">
            <p className={labelClass}>Total</p>
            <p className="mt-2 text-[1.45rem] font-semibold text-black">{totalCount}</p>
            <p className="mt-1 text-[0.88rem] text-black/54">Packs cadastrados</p>
          </div>

          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50/70 px-4 py-4">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-emerald-700">
              Publicados
            </p>
            <p className="mt-2 text-[1.45rem] font-semibold text-emerald-700">{publishedCount}</p>
            <p className="mt-1 text-[0.88rem] text-emerald-700/80">Ja visiveis no site</p>
          </div>

          <div className="rounded-[8px] border border-amber-200 bg-amber-50/70 px-4 py-4">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-amber-700">
              Rascunhos
            </p>
            <p className="mt-2 text-[1.45rem] font-semibold text-amber-700">{draftCount}</p>
            <p className="mt-1 text-[0.88rem] text-amber-700/80">Ainda fora da vitrine</p>
          </div>

          <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-4">
            <p className={labelClass}>Visiveis</p>
            <p className="mt-2 text-[1.45rem] font-semibold text-black">{activeCount}</p>
            <p className="mt-1 text-[0.88rem] text-black/54">Marcados como ativos</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <label className="block">
            <span className={labelClass}>Buscar pack</span>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-black/34" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Busque por nome, slug, categoria ou descricao"
                className={`${inputClass} pl-11`}
              />
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>Categoria</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className={`mt-2 ${inputClass}`}
            >
              <option value="all">Todas</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-[8px] border px-4 text-[0.9rem] font-semibold transition-colors",
                statusFilter === option.value
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black/68 hover:border-black/20 hover:text-black"
              )}
            >
              {option.label}
            </button>
          ))}

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-black/10 bg-[#f6f6f4] px-4 text-[0.9rem] font-semibold text-black/62 transition-colors hover:text-black"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-[0.94rem] text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className={panelClass}>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-[8px] border border-black/10 bg-[#fafaf8] p-4 lg:grid-cols-[8.5rem_minmax(0,1fr)_auto]"
              >
                <div className="aspect-[4/5] rounded-[8px] bg-white" />
                <div className="space-y-3">
                  <div className="h-5 w-48 rounded-[8px] bg-white" />
                  <div className="h-4 w-full max-w-[32rem] rounded-[8px] bg-white" />
                  <div className="flex gap-2">
                    <div className="h-8 w-28 rounded-[8px] bg-white" />
                    <div className="h-8 w-36 rounded-[8px] bg-white" />
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-col xl:flex-row">
                  <div className="h-11 w-28 rounded-[8px] bg-white" />
                  <div className="h-11 w-24 rounded-[8px] bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {status === "error" && packs.length === 0 ? (
        <div className={panelClass}>
          <p className={labelClass}>Listagem</p>
          <h3 className="mt-2 text-[1.3rem] font-semibold text-black">Nao foi possivel carregar</h3>
          <p className={helperClass}>
            Tente novamente para buscar os packs e restaurar a listagem.
          </p>
          <button type="button" onClick={() => void loadPacks()} className={`mt-5 ${secondaryButtonClass}`}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {status === "ready" ? (
        <div className={panelClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={labelClass}>Listagem</p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-black">Packs cadastrados</h3>
              <p className={helperClass}>
                {filteredPacks.length} de {packs.length} pack(s) exibidos.
              </p>
            </div>

            <span className={chipClass}>
              {hasFilters ? "Filtros ativos" : `${packs.length} pack(s) no total`}
            </span>
          </div>

          {filteredPacks.length > 0 ? (
            <div className="mt-6 space-y-4">
              {filteredPacks.map((pack) => {
                const previewUrl = resolveMediaUrl(pack.thumbnailImage);
                const isUpdating = updatingPackId === pack.id;

                return (
                  <article
                    key={pack.id}
                    className="overflow-hidden rounded-[8px] border border-black/10 bg-[#fcfcfb]"
                  >
                    <div className="grid gap-0 lg:grid-cols-[8.5rem_minmax(0,1fr)_auto]">
                      <div className="border-b border-black/10 bg-white lg:border-r lg:border-b-0">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt=""
                            className="aspect-[4/5] h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[4/5] items-center justify-center px-4">
                            <div className="text-center">
                              <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] bg-black text-white">
                                <Package className="size-5" />
                              </div>
                              <p className="mt-3 text-[0.9rem] font-medium text-black/64">
                                Sem thumbnail
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 max-w-[42rem]">
                            <h4 className="text-[1.08rem] font-semibold text-black">{pack.title}</h4>
                            <p className="mt-2 text-[0.94rem] leading-[1.6] text-black/58">
                              {pack.shortDescription || "Sem descricao curta cadastrada."}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-[8px] border px-3 py-1 text-[0.8rem] font-semibold",
                                pack.status === "published"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              )}
                            >
                              {pack.status === "published" ? "Publicado" : "Rascunho"}
                            </span>

                            <span
                              className={cn(
                                "inline-flex items-center rounded-[8px] border px-3 py-1 text-[0.8rem] font-semibold",
                                pack.active
                                  ? "border-black/10 bg-black text-white"
                                  : "border-black/10 bg-white text-black/54"
                              )}
                            >
                              {pack.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className={chipClass}>{pack.categoryName || "Sem categoria"}</span>
                          <span className={chipClass}>/packs/{pack.slug}</span>
                          <span className={chipClass}>Ordem {pack.sortOrder || 0}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-black/10 p-4 sm:flex-row lg:border-t-0 lg:border-l lg:flex-col xl:flex-row">
                        <Link
                          to={`/packs/${pack.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className={secondaryButtonClass}
                        >
                          Ver pagina
                          <ArrowUpRight className="size-4" />
                        </Link>

                        <Link to={`/admin/packs/${pack.id}/edit`} className={primaryButtonClass}>
                          <Edit className="size-4" />
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => void toggleStatus(pack)}
                          disabled={isUpdating}
                          className={cn(
                            "inline-flex h-11 items-center justify-center rounded-[8px] px-4 text-[0.9rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                            pack.status === "published"
                              ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          )}
                        >
                          {isUpdating
                            ? "Atualizando..."
                            : pack.status === "published"
                              ? "Mover para rascunho"
                              : "Publicar agora"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[8px] border border-dashed border-black/14 bg-[#fafaf8] px-5 py-8">
              <p className="text-[0.98rem] font-medium text-black/68">
                {packs.length === 0
                  ? "Nenhum pack cadastrado ainda."
                  : "Nenhum pack corresponde aos filtros atuais."}
              </p>
              <p className="mt-2 text-[0.92rem] leading-[1.55] text-black/54">
                {packs.length === 0
                  ? "Crie o primeiro pack para iniciar a operacao do catalogo."
                  : "Ajuste a busca, o status ou a categoria para ampliar a listagem."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {packs.length === 0 ? (
                  <Link to="/admin/packs/new" className={primaryButtonClass}>
                    <Plus className="size-4" />
                    Criar primeiro pack
                  </Link>
                ) : (
                  <button type="button" onClick={clearFilters} className={secondaryButtonClass}>
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
