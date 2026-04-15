import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";
import type {
  CarouselGroup,
  Category,
  PackBenefit,
  PackDetail,
  PackMedia,
  PackPrice,
  PackSummary
} from "../types/packs";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type PackRow = Database["public"]["Tables"]["packs"]["Row"];
type PackPriceRow = Database["public"]["Tables"]["pack_prices"]["Row"];
type PackBenefitRow = Database["public"]["Tables"]["pack_benefits"]["Row"];
type PackMediaRow = Database["public"]["Tables"]["pack_media"]["Row"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: normalizeText(row.description),
    coverThumb: normalizeText(row.cover_thumb),
    active: row.active,
    sortOrder: row.sort_order
  };
}

export function toPackSummary(row: PackRow, category?: Category): PackSummary {
  return {
    id: row.id,
    categoryId: row.category_id ?? "",
    categoryName: category?.name ?? "Sem categoria",
    categorySlug: category?.slug ?? "",
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    thumbnailImage: normalizeText(row.thumbnail_image),
    status: row.status,
    active: row.active,
    sortOrder: row.sort_order
  };
}

function toPrice(row: PackPriceRow | null): PackPrice | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    priceCents: row.price_cents,
    oldPriceCents: row.old_price_cents,
    installmentText: normalizeText(row.installment_text),
    ctaText: row.cta_text,
    badgeText: normalizeText(row.badge_text)
  };
}

function toBenefit(row: PackBenefitRow): PackBenefit {
  return {
    id: row.id,
    text: row.text,
    sortOrder: row.sort_order
  };
}

function toMedia(row: PackMediaRow): PackMedia {
  return {
    id: row.id,
    sectionType: row.section_type,
    groupKey: normalizeText(row.group_key),
    groupSortOrder: row.group_sort_order,
    filePath: row.file_path,
    thumbPath: normalizeText(row.thumb_path),
    altText: normalizeText(row.alt_text),
    sortOrder: row.sort_order,
    active: row.active
  };
}

function groupCarousels(media: PackMedia[]): CarouselGroup[] {
  const groups = new Map<string, CarouselGroup>();

  for (const item of media.filter((entry) => entry.sectionType === "carousel")) {
    const key = item.groupKey || "carousel-01";
    const existing = groups.get(key);

    if (existing) {
      existing.items.push(item);
      existing.sortOrder = Math.min(existing.sortOrder, item.groupSortOrder);
    } else {
      groups.set(key, {
        key,
        sortOrder: item.groupSortOrder,
        items: [item]
      });
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => a.sortOrder - b.sortOrder)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.key.localeCompare(b.key));
}

export async function listPublishedCatalog() {
  const client = requireSupabase();
  const [categoriesResult, packsResult] = await Promise.all([
    client
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    client
      .from("packs")
      .select("*")
      .eq("active", true)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true })
  ]);

  if (categoriesResult.error) {
    throw categoriesResult.error;
  }

  if (packsResult.error) {
    throw packsResult.error;
  }

  const categories = categoriesResult.data.map(toCategory);
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const packs = packsResult.data.map((row) => toPackSummary(row, categoriesById.get(row.category_id ?? "")));

  return { categories, packs };
}

export async function getPublishedPackBySlug(slug: string): Promise<PackDetail | null> {
  const client = requireSupabase();
  const packResult = await client
    .from("packs")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .eq("status", "published")
    .maybeSingle();

  if (packResult.error) {
    throw packResult.error;
  }

  if (!packResult.data) {
    return null;
  }

  const pack = packResult.data;
  const [categoryResult, priceResult, benefitsResult, mediaResult] = await Promise.all([
    pack.category_id
      ? client.from("categories").select("*").eq("id", pack.category_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    client.from("pack_prices").select("*").eq("pack_id", pack.id).maybeSingle(),
    client
      .from("pack_benefits")
      .select("*")
      .eq("pack_id", pack.id)
      .order("sort_order", { ascending: true }),
    client
      .from("pack_media")
      .select("*")
      .eq("pack_id", pack.id)
      .eq("active", true)
      .order("group_sort_order", { ascending: true })
      .order("sort_order", { ascending: true })
  ]);

  if (categoryResult.error) {
    throw categoryResult.error;
  }

  if (priceResult.error) {
    throw priceResult.error;
  }

  if (benefitsResult.error) {
    throw benefitsResult.error;
  }

  if (mediaResult.error) {
    throw mediaResult.error;
  }

  const category = categoryResult.data ? toCategory(categoryResult.data) : undefined;
  const media = mediaResult.data.map(toMedia);

  return {
    ...toPackSummary(pack, category),
    longDescription: normalizeText(pack.long_description),
    heroImage: normalizeText(pack.hero_image),
    heroAlt: normalizeText(pack.hero_alt) || pack.title,
    checkoutUrl: pack.checkout_url,
    seoTitle: normalizeText(pack.seo_title),
    seoDescription: normalizeText(pack.seo_description),
    price: toPrice(priceResult.data),
    benefits: benefitsResult.data.map(toBenefit),
    posts: media.filter((item) => item.sectionType === "posts"),
    stories: media.filter((item) => item.sectionType === "stories"),
    carouselGroups: groupCarousels(media)
  };
}
