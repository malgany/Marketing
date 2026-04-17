import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { listPublishedCatalog } from "../../data/packs";
import { hasSupabaseConfig } from "../../lib/supabase";
import { resolveMediaUrl } from "../../lib/storage";
import { cn } from "../../lib/utils";
import type { Category, PackSummary } from "../../types/packs";

function getCatalogErrorMessage(error: unknown) {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Nao foi possivel conectar ao catalogo.";
  }

  return error instanceof Error ? error.message : "Nao foi possivel carregar os packs.";
}

export function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<PackSummary[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "config">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      if (!hasSupabaseConfig) {
        setStatus("config");
        return;
      }

      setStatus("loading");

      try {
        const catalog = await listPublishedCatalog();

        if (!isMounted) {
          return;
        }

        setCategories(catalog.categories);
        setItems(catalog.packs);
        setStatus("ready");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(getCatalogErrorMessage(error));
        setStatus("error");
      }
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const catalogCategories = useMemo(
    () => [{ id: "all", label: "Todos" }, ...categories.map((category) => ({ id: category.id, label: category.name }))],
    [categories]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, items]);

  const categoryLabels = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  return (
    <section className="relative bg-white pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-10">
        <div
          id="packs"
          className="sticky top-0 z-20 -mx-6 mt-10 border-y border-black/10 bg-white/92 py-4 backdrop-blur-md md:-mx-8 lg:-mx-10"
        >
          <div className="mx-auto flex max-w-[1440px] gap-3 overflow-x-auto px-6 md:px-8 lg:px-10 hide-scrollbar">
            {catalogCategories.map((category) => {
              const isActive = category.id === activeCategory;

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[0.96rem] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/12 bg-white text-black/72 hover:border-black/25 hover:text-black"
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {status === "loading" ? (
          <div className="mt-8 rounded-[8px] border border-black/10 bg-white p-8 text-[1rem] text-black/64">
            Carregando packs...
          </div>
        ) : null}

        {status === "config" ? (
          <div className="mt-8 rounded-[8px] border border-black/10 bg-[#f8f8f8] p-8">
            <h2 className="text-[1.35rem] font-semibold text-black">Conteudo indisponivel</h2>
            <p className="mt-3 max-w-[42rem] text-[1rem] leading-[1.55] text-black/68">
              A vitrine sera exibida assim que tudo estiver pronto.
            </p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mt-8 rounded-[8px] border border-red-200 bg-red-50 p-8 text-red-900">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {status === "ready" && filteredItems.length === 0 ? (
          <div className="mt-8 rounded-[8px] border border-black/10 bg-white p-8 text-[1rem] text-black/64">
            Nenhum pack publicado encontrado.
          </div>
        ) : null}

        <div className="catalog-grid mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/packs/${item.slug}`}
              className="group flex h-full flex-col rounded-[8px] border border-black/10 bg-white p-3 shadow-[0_12px_32px_rgba(8,8,8,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-black/18 hover:shadow-[0_18px_42px_rgba(8,8,8,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
            >
              <div className="overflow-hidden rounded-[8px] bg-[#f4f1ea]">
                {resolveMediaUrl(item.thumbnailImage) ? (
                  <img
                    src={resolveMediaUrl(item.thumbnailImage)}
                    alt={item.title}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center px-6 text-center text-[1rem] font-medium text-black/42">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                <p className="text-[0.83rem] font-medium text-black/48">
                  {categoryLabels.get(item.categoryId)}
                </p>

                <h3 className="mt-2 text-[1.24rem] font-semibold leading-[1.1] text-black">
                  {item.title}
                </h3>

                <p
                  className="mt-3 text-[0.98rem] leading-[1.55] text-black/68"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden"
                  }}
                >
                  {item.shortDescription}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-[0.96rem] font-medium text-black">
                  Saiba mais
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
