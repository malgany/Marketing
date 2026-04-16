export type PackStatus = "draft" | "published";
export type PackMediaSection = "posts" | "feed" | "carousel" | "stories";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverThumb: string;
  active: boolean;
  sortOrder: number;
};

export type PackSummary = {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailImage: string;
  status: PackStatus;
  active: boolean;
  sortOrder: number;
};

export type PackPrice = {
  id: string;
  priceCents: number;
  oldPriceCents: number | null;
  installmentText: string;
  ctaText: string;
  badgeText: string;
};

export type PackBenefit = {
  id: string;
  text: string;
  sortOrder: number;
};

export type PackMedia = {
  id: string;
  sectionType: PackMediaSection;
  groupKey: string;
  groupSortOrder: number;
  filePath: string;
  thumbPath: string;
  altText: string;
  sortOrder: number;
  active: boolean;
};

export type CarouselGroup = {
  key: string;
  sortOrder: number;
  items: PackMedia[];
};

export type PackDetail = PackSummary & {
  longDescription: string;
  heroImage: string;
  heroAlt: string;
  checkoutUrl: string;
  seoTitle: string;
  seoDescription: string;
  price: PackPrice | null;
  benefits: PackBenefit[];
  posts: PackMedia[];
  feed: PackMedia[];
  stories: PackMedia[];
  carouselGroups: CarouselGroup[];
};

export type PackFormValues = {
  id?: string;
  categoryId: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailImage: string;
  heroImage: string;
  heroAlt: string;
  checkoutUrl: string;
  status: PackStatus;
  active: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  price: Omit<PackPrice, "id">;
  benefits: Array<Omit<PackBenefit, "id"> & { id?: string }>;
  media: Array<Omit<PackMedia, "id"> & { id?: string }>;
};
