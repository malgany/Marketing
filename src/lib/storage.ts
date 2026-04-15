import { requireSupabase, supabase } from "./supabase";

export const PACK_MEDIA_BUCKET = "pack-media";

type UploadArea = "thumb" | "cover" | "posts" | "stories" | "carousels";

export function resolveMediaUrl(path: string | null | undefined) {
  const value = path?.trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const { data } = supabase?.storage.from(PACK_MEDIA_BUCKET).getPublicUrl(value) ?? {
    data: { publicUrl: "" }
  };

  return data.publicUrl || value;
}

function sanitizeFileName(name: string) {
  const parts = name.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "jpg";
  const base = parts
    .join(".")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "imagem"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension || "jpg"}`;
}

export function buildPackStoragePath({
  slug,
  area,
  groupKey,
  file
}: {
  slug: string;
  area: UploadArea;
  groupKey?: string;
  file: File;
}) {
  const safeSlug = slug.trim();
  const safeGroup = groupKey?.trim();
  const fileName = sanitizeFileName(file.name);

  if (area === "carousels") {
    return `packs/${safeSlug}/carousels/${safeGroup || "carousel-01"}/${fileName}`;
  }

  return `packs/${safeSlug}/${area}/${fileName}`;
}

export async function uploadPackAsset({
  slug,
  area,
  groupKey,
  file
}: {
  slug: string;
  area: UploadArea;
  groupKey?: string;
  file: File;
}) {
  if (!slug.trim()) {
    throw new Error("Informe o slug antes de enviar imagens.");
  }

  const client = requireSupabase();
  const filePath = buildPackStoragePath({ slug, area, groupKey, file });
  const { error } = await client.storage.from(PACK_MEDIA_BUCKET).upload(filePath, file, {
    cacheControl: "31536000",
    upsert: false
  });

  if (error) {
    throw error;
  }

  return filePath;
}

export async function removePackAsset(filePath: string) {
  if (!filePath.trim()) return;

  const client = requireSupabase();
  const { error } = await client.storage.from(PACK_MEDIA_BUCKET).remove([filePath]);

  if (error) {
    throw error;
  }
}

