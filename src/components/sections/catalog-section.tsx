import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { catalogCategories, catalogItems } from "../../data/catalog";
import { cn } from "../../lib/utils";

export function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState(catalogCategories[0].id);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return catalogItems;
    }

    return catalogItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const categoryLabels = useMemo(
    () => new Map(catalogCategories.map((category) => [category.id, category.label])),
    []
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

        <div className="catalog-grid mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                if (item.href === "#") {
                  event.preventDefault();
                }
              }}
              className="group flex h-full flex-col rounded-[8px] border border-black/10 bg-white p-3 shadow-[0_12px_32px_rgba(8,8,8,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-black/18 hover:shadow-[0_18px_42px_rgba(8,8,8,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
            >
              <div className="overflow-hidden rounded-[8px] bg-[#f4f1ea]">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
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
                  {item.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-[0.96rem] font-medium text-black">
                  Saiba mais
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
