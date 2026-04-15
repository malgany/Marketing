import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, Images, Plus, Trash2, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  emptyPackForm,
  getAdminPack,
  listAdminCategories,
  saveAdminPack
} from "../../data/admin";
import { formatCurrency, slugify } from "../../lib/format";
import { resolveMediaUrl, uploadPackAsset, removePackAsset } from "../../lib/storage";
import { cn } from "../../lib/utils";
import type { Category, PackFormValues, PackMediaSection } from "../../types/packs";

const inputClass =
  "mt-2 w-full rounded-[8px] border border-black/12 bg-white px-4 py-3 text-[0.96rem] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:bg-[#f3f3f1] disabled:text-black/40";
const labelClass = "text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-black/42";
const helperClass = "mt-1 text-[0.92rem] leading-[1.55] text-black/56";
const panelClass =
  "rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_18px_36px_rgba(8,8,8,0.04)] sm:p-6";
const chipClass =
  "inline-flex items-center rounded-[8px] border border-black/10 bg-[#f6f6f4] px-3 py-1 text-[0.82rem] font-medium text-black/58";
const secondaryButtonClass =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white px-4 text-[0.92rem] font-semibold text-black transition-[background-color,color,border-color] hover:border-black hover:bg-black hover:text-white";
const dangerButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-rose-200 bg-white px-4 text-[0.9rem] font-semibold text-rose-700 transition-colors hover:bg-rose-50";

const mediaSectionLabels: Record<PackMediaSection, string> = {
  posts: "Posts",
  carousel: "Carrossel",
  stories: "Stories"
};

const mediaSectionHints: Record<PackMediaSection, string> = {
  posts: "Sequencia solta para a grade principal.",
  carousel: "Conjunto agrupado para deslize.",
  stories: "Formato vertical para anuncios, avisos e bastidores."
};

function centsFromInput(value: string) {
  return value === "" ? 0 : Math.round(Number(value));
}

function nullableCentsFromInput(value: string) {
  return value === "" ? null : Math.max(0, Math.round(Number(value)));
}

function getMediaAspectClass(sectionType: PackMediaSection) {
  return sectionType === "stories" ? "aspect-[9/16]" : "aspect-square";
}

function FileUploadButton({
  id,
  label,
  multiple = false,
  onSelect
}: {
  id: string;
  label: string;
  multiple?: boolean;
  onSelect: (files: FileList | null) => void;
}) {
  return (
    <>
      <label htmlFor={id} className={secondaryButtonClass}>
        <Upload className="size-4" />
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          onSelect(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="flex h-fit flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_18px_36px_rgba(8,8,8,0.04)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-white px-5 py-4 text-left transition-colors hover:bg-[#fafaf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <span className="text-[1.12rem] font-semibold text-black">{title}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-black/50 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-black/10 bg-white p-5 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );
}

export function AdminPackFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<PackFormValues>(() => emptyPackForm());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");
  const [carouselGroupKey, setCarouselGroupKey] = useState("carousel-01");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setMessage("");

      try {
        const nextCategories = await listAdminCategories();
        const nextForm = id ? await getAdminPack(id) : emptyPackForm();

        if (!isMounted) {
          return;
        }

        setCategories(nextCategories);
        setForm(nextForm ?? emptyPackForm());
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Nao foi possivel carregar o formulario.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const updateForm = <K extends keyof PackFormValues>(key: K, value: PackFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateBenefitItem = (
    index: number,
    patch: Partial<PackFormValues["benefits"][number]>
  ) => {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    }));
  };

  const removeBenefitItem = (index: number) => {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const updateMediaItem = (index: number, patch: Partial<PackFormValues["media"][number]>) => {
    setForm((current) => ({
      ...current,
      media: current.media.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    }));
  };

  const removeMediaItem = (index: number) => {
    setForm((current) => {
      const target = current.media[index];
      if (target?.filePath && !target.filePath.startsWith("http")) {
        void removePackAsset(target.filePath).catch(() => {});
      }
      return {
        ...current,
        media: current.media.filter((_, itemIndex) => itemIndex !== index)
      };
    });
  };

  const handleMediaUpload = async (sectionType: PackMediaSection, files: FileList | null, groupKey = "") => {
    const fileList = Array.from(files ?? []);

    if (fileList.length === 0) {
      return;
    }

    const normalizedGroupKey = sectionType === "carousel" ? groupKey.trim() || "carousel-01" : "";
    const existingGroupOrder =
      form.media.find((media) => media.sectionType === "carousel" && media.groupKey === normalizedGroupKey)
        ?.groupSortOrder ?? 0;
    const nextGroupOrder =
      existingGroupOrder ||
      Math.max(0, ...form.media.filter((media) => media.sectionType === "carousel").map((media) => media.groupSortOrder)) +
        10;
    const nextSortOrder =
      Math.max(
        0,
        ...form.media
          .filter((media) => media.sectionType === sectionType && media.groupKey === normalizedGroupKey)
          .map((media) => media.sortOrder)
      ) + 10;

    setUploading(`Enviando ${fileList.length} imagem(ns)...`);
    setMessage("");

    try {
      const uploaded: PackFormValues["media"] = [];

      for (const [index, file] of fileList.entries()) {
        const path = await uploadPackAsset({
          slug: form.slug,
          area: sectionType === "carousel" ? "carousels" : sectionType,
          groupKey: normalizedGroupKey,
          file
        });

        uploaded.push({
          sectionType,
          groupKey: normalizedGroupKey,
          groupSortOrder: sectionType === "carousel" ? nextGroupOrder : 0,
          filePath: path,
          thumbPath: path,
          altText: form.title,
          sortOrder: nextSortOrder + index * 10,
          active: true
        });
      }

      setForm((current) => ({
        ...current,
        media: [...current.media, ...uploaded]
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel enviar as imagens.");
    } finally {
      setUploading("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const savedId = await saveAdminPack(form);
      setForm((current) => ({ ...current, id: savedId }));
      setMessage("Pack salvo.");

      if (!id) {
        navigate(`/admin/packs/${savedId}/edit`, { replace: true });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar o pack.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={panelClass}>Carregando editor...</div>;
  }

  const categoryName =
    categories.find((category) => category.id === form.categoryId)?.name || "Sem categoria";
  const publicPath = form.slug ? `/packs/${form.slug}` : "";
  const publicPreviewUrl = publicPath ? `${window.location.origin}${publicPath}` : "";
  const thumbnailPreviewUrl = resolveMediaUrl(form.thumbnailImage);
  const heroPreviewUrl = resolveMediaUrl(form.heroImage);
  const mediaEntries = form.media.map((media, index) => ({ media, index }));
  const postEntries = mediaEntries.filter(({ media }) => media.sectionType === "posts");
  const carouselEntries = mediaEntries.filter(({ media }) => media.sectionType === "carousel");
  const storyEntries = mediaEntries.filter(({ media }) => media.sectionType === "stories");
  const carouselGroupsCount = new Set(
    form.media
      .filter((media) => media.sectionType === "carousel")
      .map((media) => media.groupKey || "carousel-01")
  ).size;
  const totalMedia = form.media.length;
  const messageClass =
    message === "Pack salvo."
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  const clearMainImage = (area: "thumb" | "cover") => {
    setForm((current) => {
      const targetPath = area === "thumb" ? current.thumbnailImage : current.heroImage;
      if (targetPath && !targetPath.startsWith("http")) {
        void removePackAsset(targetPath).catch(() => {});
      }
      return {
        ...current,
        thumbnailImage: area === "thumb" ? "" : current.thumbnailImage,
        heroImage: area === "cover" ? "" : current.heroImage,
        heroAlt: area === "cover" ? "" : current.heroAlt
      };
    });
  };

  
  const renderMediaCard = (media: PackFormValues["media"][number], index: number) => {
    const previewUrl = resolveMediaUrl(media.thumbPath || media.filePath);
    const isCarousel = media.sectionType === "carousel";

    return (
      <article
        key={`${media.id ?? media.filePath}-${index}`}
        className="rounded-[8px] border border-black/10 bg-[#fcfcfb] p-4 shadow-[0_12px_24px_rgba(8,8,8,0.03)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>Item {String(index + 1).padStart(2, "0")}</span>
              <span className={chipClass}>{mediaSectionLabels[media.sectionType]}</span>
              {media.groupKey ? <span className={chipClass}>{media.groupKey}</span> : null}
            </div>
            <p className="mt-3 text-[0.92rem] leading-[1.55] text-black/56">
              {mediaSectionHints[media.sectionType]}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeMediaItem(index)}
            className={dangerButtonClass}
          >
            <Trash2 className="size-4" />
            <span className="hidden lg:inline">Remover</span>
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[168px_1fr]">
          <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className={`${getMediaAspectClass(media.sectionType)} w-full object-cover`}
              />
            ) : (
              <div className={`${getMediaAspectClass(media.sectionType)} flex items-center justify-center px-4`}>
                <div className="text-center">
                  <div className="mx-auto flex size-11 items-center justify-center rounded-[8px] bg-black text-white">
                    <Images className="size-5" />
                  </div>
                  <p className="mt-3 text-[0.9rem] font-medium text-black/64">Sem preview</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className={labelClass}>Secao</span>
              <select
                value={media.sectionType}
                onChange={(event) => {
                  const nextSection = event.target.value as PackMediaSection;
                  updateMediaItem(index, {
                    sectionType: nextSection,
                    groupKey: nextSection === "carousel" ? media.groupKey || "carousel-01" : "",
                    groupSortOrder: nextSection === "carousel" ? media.groupSortOrder || 10 : 0
                  });
                }}
                className={inputClass}
              >
                <option value="posts">Posts</option>
                <option value="carousel">Carrossel</option>
                <option value="stories">Stories</option>
              </select>
            </label>

            {isCarousel ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Chave do grupo</span>
                  <input
                    value={media.groupKey || ""}
                    onChange={(event) =>
                      updateMediaItem(index, { groupKey: slugify(event.target.value) })
                    }
                    placeholder="carousel-01"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Ordem do grupo</span>
                  <input
                    type="number"
                    value={media.groupSortOrder || 0}
                    onChange={(event) =>
                      updateMediaItem(index, { groupSortOrder: Number(event.target.value) })
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            ) : null}

            <label className="block">
              <span className={labelClass}>Texto alternativo</span>
              <input
                value={media.altText || ""}
                onChange={(event) => updateMediaItem(index, { altText: event.target.value })}
                className={inputClass}
              />
            </label>

            <div className="flex gap-3">
              <label className="block w-24">
                <span className={labelClass}>Ordem</span>
                <input
                  type="number"
                  value={media.sortOrder || 0}
                  onChange={(event) => updateMediaItem(index, { sortOrder: Number(event.target.value) })}
                  className={inputClass}
                />
              </label>

              <label className="mt-[1.3rem] flex items-center gap-3 rounded-[8px] border border-black/10 bg-white px-4">
                <input
                  type="checkbox"
                  checked={media.active}
                  onChange={(event) => updateMediaItem(index, { active: event.target.checked })}
                />
                <span className="text-[0.92rem] font-medium text-black/72">Ativo</span>
              </label>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const renderMediaSection = ({
    sectionType,
    title,
    description,
    recommendedLabel,
    entries,
    uploadId,
    uploadLabel
  }: {
    sectionType: PackMediaSection;
    title: string;
    description: string;
    recommendedLabel: string;
    entries: Array<{ media: PackFormValues["media"][number]; index: number }>;
    uploadId: string;
    uploadLabel: string;
  }) => (
    <Accordion title={title === "Posts" ? "POSTS" : title} defaultOpen={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={labelClass}>Galeria</p>
          <p className={helperClass}>{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={chipClass}>{recommendedLabel}</span>
          <span className={chipClass}>{entries.length} arquivo(s)</span>
          {sectionType === "carousel" ? (
            <span className={chipClass}>{carouselGroupsCount} grupo(s)</span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 rounded-[8px] border border-black/10 bg-[#fafaf8] p-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            {sectionType === "carousel" ? (
              <label className="block max-w-[16rem]">
                <span className={labelClass}>Grupo do carrossel</span>
                <input
                  value={carouselGroupKey}
                  onChange={(event) =>
                    setCarouselGroupKey(slugify(event.target.value) || "carousel-01")
                  }
                  className={inputClass}
                  placeholder="carousel-01"
                />
              </label>
            ) : (
              <div>
                <p className={labelClass}>Upload</p>
                <p className="mt-3 text-[0.94rem] leading-[1.55] text-black/58">
                  O sistema organiza o arquivo internamente. Aqui voce so escolhe a imagem.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FileUploadButton
              id={uploadId}
              label={uploadLabel}
              multiple
              onSelect={(files) =>
                void handleMediaUpload(
                  sectionType,
                  files,
                  sectionType === "carousel" ? carouselGroupKey : ""
                )
              }
            />
            <span className="text-[0.86rem] text-black/48">Selecao multipla liberada</span>
          </div>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 space-y-4">
          {entries.map(({ media, index }) => renderMediaCard(media, index))}
        </div>
      ) : (
        <div className="mt-6 rounded-[8px] border border-dashed border-black/12 bg-[#fafaf8] px-5 py-8 text-[0.95rem] text-black/54">
          Envie imagens para preencher esta parte da pagina.
        </div>
      )}
    </Accordion>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-6">
      <div className="mb-0">
        <div className="rounded-[8px] border border-black/10 bg-[#f4f4f2] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <Link
                to="/admin/packs"
                className="inline-flex items-center gap-2 text-[0.94rem] font-medium text-black/58 transition-colors hover:text-black"
              >
                <ArrowLeft className="size-4" />
                Voltar para packs
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h2 className="text-[2rem] font-semibold leading-tight">
                  {id ? "Editar pack" : "Novo pack"}
                </h2>
                <span
                  className={cn(
                    "inline-flex rounded-[8px] border px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em]",
                    form.status === "published"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  )}
                >
                  {form.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <span
                  className={cn(
                    "inline-flex rounded-[8px] border px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em]",
                    form.active
                      ? "border-black/10 bg-black text-white"
                      : "border-black/10 bg-white text-black/58"
                  )}
                >
                  {form.active ? "Ativo" : "Inativo"}
                </span>
              </div>

              <p className="mt-3 max-w-[46rem] text-[0.98rem] leading-[1.6] text-black/58">
                Organize a oferta, as imagens e a galeria em uma mesma passada. O resumo abaixo
                ajuda a conferir o que ja esta pronto antes de publicar.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={chipClass}>{form.title || "Sem nome definido"}</span>
                <span className={chipClass}>{publicPath || "Defina o slug para gerar a rota"}</span>
                <span className={chipClass}>{categoryName}</span>
                <span className={chipClass}>{form.benefits.length} beneficios</span>
                <span className={chipClass}>{totalMedia} midias</span>
                {carouselGroupsCount > 0 ? (
                  <span className={chipClass}>{carouselGroupsCount} grupos de carrossel</span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {publicPreviewUrl ? (
                <a
                  href={publicPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={secondaryButtonClass}
                >
                  Visualizar pagina
                  <ArrowUpRight className="size-4" />
                </a>
              ) : (
                <span className="inline-flex rounded-[8px] border border-black/10 bg-[#f6f6f4] px-4 py-3 text-[0.94rem] font-medium text-black/42">
                  Defina o slug para visualizar
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-black px-5 text-[0.95rem] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-55"
              >
                {saving ? "Salvando..." : "Salvar pack"}
              </button>
            </div>
          </div>

          {message || uploading ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {message ? (
                <div className={cn("rounded-[8px] border px-4 py-3 text-[0.94rem]", messageClass)}>
                  {message}
                </div>
              ) : null}
              {uploading ? (
                <div className="rounded-[8px] border border-sky-200 bg-sky-50 px-4 py-3 text-[0.94rem] text-sky-700">
                  {uploading}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid items-start gap-6">
        <Accordion title="Informações básicas" defaultOpen={false}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={labelClass}>Conteudo</p>
              <p className={helperClass}>
                Defina categoria, nome, rota publica e a copy principal que alimenta a vitrine e
                a pagina interna.
              </p>
            </div>
            <span className={chipClass}>Ordem {form.sortOrder || 0}</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Categoria</span>
              <select
                required
                value={form.categoryId}
                onChange={(event) => updateForm("categoryId", event.target.value)}
                className={inputClass}
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as PackFormValues["status"])}
                className={inputClass}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
<label className="block">
            <span className={labelClass}>Nome do pack</span>
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: current.id || current.slug ? current.slug : slugify(event.target.value),
                  heroAlt: current.heroAlt || event.target.value
                }))
              }
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Slug</span>
            <input
              required
              value={form.slug}
              onChange={(event) => updateForm("slug", slugify(event.target.value))}
              className={inputClass}
            />
            <p className={helperClass}>
              {publicPath ? `Rota publica: ${publicPath}` : "Defina o slug para gerar a rota publica."}
            </p>
          </label>
</div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
<label className="block">
            <span className={labelClass}>Descricao curta</span>
            <textarea
              required
              value={form.shortDescription}
              onChange={(event) => updateForm("shortDescription", event.target.value)}
              className={`${inputClass} min-h-26 resize-y`}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Descricao longa</span>
            <textarea
              value={form.longDescription}
              onChange={(event) => updateForm("longDescription", event.target.value)}
              className={`${inputClass} min-h-30 resize-y`}
            />
          </label>
</div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Ordem na vitrine</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) => updateForm("sortOrder", Number(event.target.value))}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Visibilidade</span>
              <div className="flex h-12 items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => updateForm("active", event.target.checked)}
                />
                <span className="text-[0.95rem] font-medium text-black/72">
                  {form.active ? "Pack ativo para exibicao" : "Pack oculto"}
                </span>
              </div>
            </label>
          </div>
        </Accordion>

        <Accordion title="Oferta e SEO" defaultOpen={false}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={labelClass}>Oferta</p>
              <p className={helperClass}>
                Ajuste a apresentacao comercial do pack e os textos que ajudam na leitura da pagina.
              </p>
            </div>
            <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-3 text-right">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-black/42">
                Preco atual
              </p>
              <p className="mt-2 text-[1.35rem] font-semibold text-black">
                {formatCurrency(form.price.priceCents)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-3">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-black/42">
                Preco cheio
              </p>
              <p className="mt-2 text-[1.05rem] font-semibold text-black">
                {form.price.oldPriceCents ? formatCurrency(form.price.oldPriceCents) : "Sem valor anterior"}
              </p>
            </div>
            <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-3">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-black/42">
                Parcela
              </p>
              <p className="mt-2 text-[1.05rem] font-semibold text-black">
                {form.price.installmentText || "Sem parcelamento"}
              </p>
            </div>
            <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] px-4 py-3">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-black/42">
                CTA
              </p>
              <p className="mt-2 text-[1.05rem] font-semibold text-black">
                {form.price.ctaText || "Sem texto definido"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Preco atual em centavos</span>
              <input
                type="number"
                min="0"
                value={form.price.priceCents}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: { ...current.price, priceCents: centsFromInput(event.target.value) }
                  }))
                }
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Preco antigo em centavos</span>
              <input
                type="number"
                min="0"
                value={form.price.oldPriceCents ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: { ...current.price, oldPriceCents: nullableCentsFromInput(event.target.value) }
                  }))
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Texto de parcelamento</span>
              <input
                value={form.price.installmentText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: { ...current.price, installmentText: event.target.value }
                  }))
                }
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Texto do botao</span>
              <input
                required
                value={form.price.ctaText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: { ...current.price, ctaText: event.target.value }
                  }))
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
<label className="block">
            <span className={labelClass}>Link de checkout</span>
            <input
              required
              value={form.checkoutUrl}
              onChange={(event) => updateForm("checkoutUrl", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Selo promocional</span>
            <input
              value={form.price.badgeText}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: { ...current.price, badgeText: event.target.value }
                }))
              }
              className={inputClass}
            />
          </label>
</div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
<label className="block">
            <span className={labelClass}>SEO title</span>
            <input value={form.seoTitle} onChange={(event) => updateForm("seoTitle", event.target.value)} className={inputClass} />
          </label>

          <label className="block">
            <span className={labelClass}>SEO description</span>
            <textarea
              value={form.seoDescription}
              onChange={(event) => updateForm("seoDescription", event.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
            />
          </label>
</div>
        </Accordion>

        <Accordion title="Hero e imagens principais" defaultOpen={false}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={labelClass}>Primeira dobra</p>
              <p className={helperClass}>
                A edicao comeca pela capa da pagina e pela thumbnail da vitrine. O sistema cuida do
                arquivo por tras, entao aqui voce so escolhe e revisa a imagem.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>{[thumbnailPreviewUrl, heroPreviewUrl].filter(Boolean).length}/2 prontas</span>
              <span className={chipClass}>Fluxo da pagina</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[1.05rem] font-semibold">Thumbnail da vitrine</h4>
                    <p className="mt-1 text-[0.92rem] leading-[1.55] text-black/56">
                      Recomendado em 4:5. E a imagem de capa da vitrine e da lista de packs.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={chipClass}>4:5</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-[8px] border px-3 py-1 text-[0.8rem] font-semibold",
                        thumbnailPreviewUrl
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      )}
                    >
                      {thumbnailPreviewUrl ? "Pronta" : "Pendente"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[8px] border border-black/10 bg-white max-w-[12rem]">
                  {thumbnailPreviewUrl ? (
                    <img
                      src={thumbnailPreviewUrl}
                      alt=""
                      className="aspect-[4/5] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center px-6 py-10">
                      <div className="max-w-[16rem] text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] bg-black text-white">
                          <Images className="size-5" />
                        </div>
                        <p className="mt-4 text-[0.98rem] font-semibold text-black">Sem thumbnail definida</p>
                        <p className="mt-2 text-[0.9rem] leading-[1.55] text-black/52">
                          Use uma imagem vertical com leitura forte em tamanhos menores.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <FileUploadButton
                    id="pack-thumb-upload"
                    label={thumbnailPreviewUrl ? "Trocar thumbnail" : "Enviar thumbnail"}
                    onSelect={(files) => void handleMainUpload("thumb", files)}
                  />
                  {thumbnailPreviewUrl ? (
                    <>
                      <a
                        href={thumbnailPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryButtonClass}
                      >
                        Abrir
                        <ArrowUpRight className="size-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => clearMainImage("thumb")}
                        className="inline-flex h-11 items-center justify-center rounded-[8px] border border-rose-200 bg-white px-4 text-[0.92rem] font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                      >
                        Remover thumbnail
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[8px] border border-black/10 bg-[#fafaf8] p-4 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[1.05rem] font-semibold">Capa da pagina interna</h4>
                    <p className="mt-1 text-[0.92rem] leading-[1.55] text-black/56">
                      Recomendado em 16:9. E a primeira imagem que abre a experiencia do pack.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={chipClass}>16:9</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-[8px] border px-3 py-1 text-[0.8rem] font-semibold",
                        heroPreviewUrl
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      )}
                    >
                      {heroPreviewUrl ? "Pronta" : "Pendente"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[8px] border border-black/10 bg-white max-w-xl">
                  {heroPreviewUrl ? (
                    <img src={heroPreviewUrl} alt="" className="aspect-[16/9] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center px-6 py-10">
                      <div className="max-w-[18rem] text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] bg-black text-white">
                          <Images className="size-5" />
                        </div>
                        <p className="mt-4 text-[0.98rem] font-semibold text-black">Sem capa definida</p>
                        <p className="mt-2 text-[0.9rem] leading-[1.55] text-black/52">
                          Envie uma imagem horizontal com area de respiro para o topo da pagina.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <FileUploadButton
                    id="pack-cover-upload"
                    label={heroPreviewUrl ? "Trocar capa" : "Enviar capa"}
                    onSelect={(files) => void handleMainUpload("cover", files)}
                  />
                  {heroPreviewUrl ? (
                    <>
                      <a
                        href={heroPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryButtonClass}
                      >
                        Abrir
                        <ArrowUpRight className="size-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => clearMainImage("cover")}
                        className="inline-flex h-11 items-center justify-center rounded-[8px] border border-rose-200 bg-white px-4 text-[0.92rem] font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                      >
                        Remover capa
                      </button>
                    </>
                  ) : null}
                </div>

                <label className="mt-auto pt-5 block max-w-xl">
                  <span className={labelClass}>Texto alternativo da capa</span>
                  <input
                    value={form.heroAlt}
                    onChange={(event) => updateForm("heroAlt", event.target.value)}
                    placeholder="Descricao curta da imagem para acessibilidade"
                    className={inputClass}
                  />
                </label>
              </div>

            </div>
          </div>
        </Accordion>

        {renderMediaSection({
          sectionType: "posts",
          title: "Posts",
          description: "Aqui entram as imagens da grade principal do pack, no mesmo sentido da pagina final.",
          recommendedLabel: "1:1 recomendado",
          entries: postEntries,
          uploadId: "pack-posts-upload",
          uploadLabel: "Enviar posts"
        })}

        {renderMediaSection({
          sectionType: "carousel",
          title: "Carrossel",
          description: "Agrupe os slides por conjunto. Cada grupo vira um bloco de carrossel na pagina final.",
          recommendedLabel: "1:1 recomendado",
          entries: carouselEntries,
          uploadId: "pack-carousel-upload",
          uploadLabel: "Enviar carrossel"
        })}

        {renderMediaSection({
          sectionType: "stories",
          title: "Stories",
          description: "Use esta parte para as imagens verticais que aparecem no bloco de stories.",
          recommendedLabel: "9:16 recomendado",
          entries: storyEntries,
          uploadId: "pack-stories-upload",
          uploadLabel: "Enviar stories"
        })}

        <Accordion title="Benefícios" defaultOpen={false}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={labelClass}>Oferta</p>
              <p className={helperClass}>Cada item reforca o valor percebido no bloco principal.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  benefits: [...current.benefits, { text: "", sortOrder: (current.benefits.length + 1) * 10 }]
                }))
              }
              className={secondaryButtonClass}
            >
              <Plus className="size-4" />
              Adicionar beneficio
            </button>
          </div>

          {form.benefits.length > 0 ? (
            <div className="mt-6 space-y-3">
              {form.benefits.map((benefit, index) => (
                <div
                  key={benefit.id ?? index}
                  className="grid gap-3 rounded-[8px] border border-black/10 bg-[#fafaf8] p-3 sm:grid-cols-[3rem_minmax(0,1fr)_8rem_auto] sm:items-end"
                >
                  <div className="flex h-11 items-center justify-center self-end rounded-[8px] bg-black text-[0.9rem] font-semibold text-white">
                    {index + 1}
                  </div>
                  <label className="block">
                    <span className={labelClass}>Texto</span>
                    <input
                      value={benefit.text}
                      onChange={(event) => updateBenefitItem(index, { text: event.target.value })}
                      placeholder="Ex.: 20 posts prontos para publicar"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Ordem</span>
                    <input
                      type="number"
                      min="0"
                      value={benefit.sortOrder}
                      onChange={(event) =>
                        updateBenefitItem(index, { sortOrder: Number(event.target.value) })
                      }
                      className={inputClass}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeBenefitItem(index)}
                    className={`${dangerButtonClass} self-end`}
                  >
                    <Trash2 className="size-4" />
                    <span className="hidden lg:inline">Remover</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[8px] border border-dashed border-black/12 bg-[#fafaf8] px-5 py-8 text-[0.95rem] text-black/54">
              Adicione os beneficios que vao reforcar o valor percebido do pack.
            </div>
          )}
        </Accordion>
      </div>
</form>
  );
}
