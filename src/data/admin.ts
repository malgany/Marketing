import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";
import type { Category, PackFormValues, PackStatus } from "../types/packs";
import { toCategory, toPackSummary } from "./packs";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];
type PackInsert = Database["public"]["Tables"]["packs"]["Insert"];
type PackPriceInsert = Database["public"]["Tables"]["pack_prices"]["Insert"];
type PackBenefitInsert = Database["public"]["Tables"]["pack_benefits"]["Insert"];
type PackMediaInsert = Database["public"]["Tables"]["pack_media"]["Insert"];

export type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  coverThumb: string;
  active: boolean;
  sortOrder: number;
};

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sortNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function emptyPackForm(): PackFormValues {
  return {
    categoryId: "",
    slug: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    thumbnailImage: "",
    heroImage: "",
    heroAlt: "",
    checkoutUrl: "",
    status: "draft",
    active: true,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
    price: {
      priceCents: 4790,
      oldPriceCents: null,
      installmentText: "ou 8x de R$ 6,97",
      ctaText: "Acesse agora o seu pack",
      badgeText: "Oferta limitada"
    },
    benefits: [],
    media: []
  };
}

export async function checkIsAdmin() {
  const client = requireSupabase();
  const {
    data: { user },
    error: userError
  } = await client.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return false;
  }

  const { data, error } = await client.rpc("is_admin", {});

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function signInAdmin(email: string, password: string) {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    await client.auth.signOut();
    throw new Error("Este acesso nao esta autorizado.");
  }
}

export async function signOutAdmin() {
  await requireSupabase().auth.signOut();
}

export async function listAdminCategories(): Promise<Category[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(toCategory);
}

export async function saveAdminCategory(values: CategoryFormValues) {
  const client = requireSupabase();
  const payload: CategoryInsert = {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: nullable(values.description),
    cover_thumb: nullable(values.coverThumb),
    active: values.active,
    sort_order: sortNumber(values.sortOrder)
  };

  if (values.id) {
    const { error } = await client
      .from("categories")
      .update(payload as CategoryUpdate)
      .eq("id", values.id);

    if (error) {
      throw error;
    }

    return values.id;
  }

  const { data, error } = await client.from("categories").insert(payload).select("id").single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function listAdminPacks() {
  const client = requireSupabase();
  const [categoriesResult, packsResult] = await Promise.all([
    client.from("categories").select("*"),
    client
      .from("packs")
      .select("*")
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

  return packsResult.data.map((row) => toPackSummary(row, categoriesById.get(row.category_id ?? "")));
}

export async function getAdminPack(id: string): Promise<PackFormValues | null> {
  const client = requireSupabase();
  const packResult = await client.from("packs").select("*").eq("id", id).maybeSingle();

  if (packResult.error) {
    throw packResult.error;
  }

  if (!packResult.data) {
    return null;
  }

  const pack = packResult.data;
  const [priceResult, benefitsResult, mediaResult] = await Promise.all([
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
      .order("group_sort_order", { ascending: true })
      .order("sort_order", { ascending: true })
  ]);

  if (priceResult.error) {
    throw priceResult.error;
  }

  if (benefitsResult.error) {
    throw benefitsResult.error;
  }

  if (mediaResult.error) {
    throw mediaResult.error;
  }

  return {
    id: pack.id,
    categoryId: pack.category_id ?? "",
    slug: pack.slug,
    title: pack.title,
    shortDescription: pack.short_description,
    longDescription: pack.long_description ?? "",
    thumbnailImage: pack.thumbnail_image ?? "",
    heroImage: pack.hero_image ?? "",
    heroAlt: pack.hero_alt ?? "",
    checkoutUrl: pack.checkout_url,
    status: pack.status,
    active: pack.active,
    sortOrder: pack.sort_order,
    seoTitle: pack.seo_title ?? "",
    seoDescription: pack.seo_description ?? "",
    price: {
      priceCents: priceResult.data?.price_cents ?? 0,
      oldPriceCents: priceResult.data?.old_price_cents ?? null,
      installmentText: priceResult.data?.installment_text ?? "",
      ctaText: priceResult.data?.cta_text ?? "Acesse agora o seu pack",
      badgeText: priceResult.data?.badge_text ?? ""
    },
    benefits: benefitsResult.data.map((benefit) => ({
      id: benefit.id,
      text: benefit.text,
      sortOrder: benefit.sort_order
    })),
    media: mediaResult.data.map((media) => ({
      id: media.id,
      sectionType: media.section_type,
      groupKey: media.group_key ?? "",
      groupSortOrder: media.group_sort_order,
      filePath: media.file_path,
      thumbPath: media.thumb_path ?? "",
      altText: media.alt_text ?? "",
      sortOrder: media.sort_order,
      active: media.active
    }))
  };
}

export async function saveAdminPack(values: PackFormValues) {
  const client = requireSupabase();
  const packPayload: PackInsert = {
    category_id: values.categoryId || null,
    slug: values.slug.trim(),
    title: values.title.trim(),
    short_description: values.shortDescription.trim(),
    long_description: nullable(values.longDescription),
    thumbnail_image: nullable(values.thumbnailImage),
    hero_image: nullable(values.heroImage),
    hero_alt: nullable(values.heroAlt),
    checkout_url: values.checkoutUrl.trim(),
    status: values.status,
    active: values.active,
    sort_order: sortNumber(values.sortOrder),
    seo_title: nullable(values.seoTitle),
    seo_description: nullable(values.seoDescription)
  };

  const packResult = values.id
    ? await client.from("packs").update(packPayload).eq("id", values.id).select("id").single()
    : await client.from("packs").insert(packPayload).select("id").single();

  if (packResult.error) {
    throw packResult.error;
  }

  const packId = packResult.data.id;
  const pricePayload: PackPriceInsert = {
    pack_id: packId,
    price_cents: Math.max(0, sortNumber(values.price.priceCents)),
    old_price_cents: values.price.oldPriceCents === null ? null : Math.max(0, values.price.oldPriceCents),
    installment_text: nullable(values.price.installmentText),
    cta_text: values.price.ctaText.trim() || "Acesse agora o seu pack",
    badge_text: nullable(values.price.badgeText)
  };
  const priceResult = await client.from("pack_prices").upsert(pricePayload, {
    onConflict: "pack_id"
  });

  if (priceResult.error) {
    throw priceResult.error;
  }

  const deleteBenefitsResult = await client.from("pack_benefits").delete().eq("pack_id", packId);

  if (deleteBenefitsResult.error) {
    throw deleteBenefitsResult.error;
  }

  const benefitsPayload: PackBenefitInsert[] = values.benefits
    .filter((benefit) => benefit.text.trim())
    .map((benefit, index) => ({
      pack_id: packId,
      text: benefit.text.trim(),
      sort_order: sortNumber(benefit.sortOrder) || (index + 1) * 10
    }));

  if (benefitsPayload.length > 0) {
    const benefitsResult = await client.from("pack_benefits").insert(benefitsPayload);

    if (benefitsResult.error) {
      throw benefitsResult.error;
    }
  }

  const deleteMediaResult = await client.from("pack_media").delete().eq("pack_id", packId);

  if (deleteMediaResult.error) {
    throw deleteMediaResult.error;
  }

  const mediaPayload: PackMediaInsert[] = values.media
    .filter((media) => media.filePath.trim())
    .map((media, index) => ({
      pack_id: packId,
      section_type: media.sectionType,
      group_key: nullable(media.groupKey),
      group_sort_order: sortNumber(media.groupSortOrder),
      file_path: media.filePath.trim(),
      thumb_path: nullable(media.thumbPath),
      alt_text: nullable(media.altText),
      sort_order: sortNumber(media.sortOrder) || (index + 1) * 10,
      active: media.active
    }));

  if (mediaPayload.length > 0) {
    const mediaResult = await client.from("pack_media").insert(mediaPayload);

    if (mediaResult.error) {
      throw mediaResult.error;
    }
  }

  return packId;
}

export async function setAdminPackStatus(id: string, status: PackStatus) {
  const client = requireSupabase();
  const { error } = await client.from("packs").update({ status }).eq("id", id);

  if (error) {
    throw error;
  }
}
