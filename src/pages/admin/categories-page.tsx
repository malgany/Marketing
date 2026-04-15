import { useEffect, useState } from "react";
import { saveAdminCategory, type CategoryFormValues, listAdminCategories } from "../../data/admin";
import { slugify } from "../../lib/format";
import type { Category } from "../../types/packs";

const emptyCategory: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  coverThumb: "",
  active: true,
  sortOrder: 0
};

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormValues>(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setCategories(await listAdminCategories());
    setLoading(false);
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await saveAdminCategory(form);
      setForm(emptyCategory);
      await loadCategories();
      setMessage("Categoria salva.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={handleSubmit} className="rounded-[8px] border border-black/10 bg-white p-5">
        <h2 className="text-[1.45rem] font-semibold">{form.id ? "Editar categoria" : "Nova categoria"}</h2>

        <label className="mt-5 block">
          <span className="text-[0.86rem] font-medium text-black/62">Nome</span>
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
                slug: current.id || current.slug ? current.slug : slugify(event.target.value)
              }))
            }
            className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[0.86rem] font-medium text-black/62">Slug</span>
          <input
            required
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[0.86rem] font-medium text-black/62">Descricao</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="mt-2 min-h-24 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[0.86rem] font-medium text-black/62">Thumbnail opcional</span>
          <input
            value={form.coverThumb}
            onChange={(event) => setForm((current) => ({ ...current, coverThumb: event.target.value }))}
            className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[0.86rem] font-medium text-black/62">Ordem</span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
              className="mt-2 w-full rounded-[8px] border border-black/12 px-4 py-3 outline-none focus:border-black"
            />
          </label>

          <label className="mt-8 flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
            />
            <span className="text-[0.95rem] text-black/68">Ativa</span>
          </label>
        </div>

        {message ? <div className="mt-4 rounded-[8px] bg-[#f7f7f7] p-3 text-[0.92rem]">{message}</div> : null}

        <div className="mt-5 flex gap-2">
          <button type="submit" disabled={saving} className="rounded-[8px] bg-black px-5 py-3 font-semibold text-white">
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(emptyCategory);
              setMessage("");
            }}
            className="rounded-[8px] border border-black/10 bg-white px-5 py-3 font-semibold text-black/68"
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="rounded-[8px] border border-black/10 bg-white p-5">
        <h2 className="text-[1.45rem] font-semibold">Categorias cadastradas</h2>
        {loading ? <p className="mt-4 text-black/58">Carregando...</p> : null}
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-black/10 p-4">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-[0.9rem] text-black/52">{category.slug}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    coverThumb: category.coverThumb,
                    active: category.active,
                    sortOrder: category.sortOrder
                  })
                }
                className="rounded-[8px] bg-black px-4 py-2 text-[0.9rem] font-semibold text-white"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
