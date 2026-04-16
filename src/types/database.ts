export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

type TimestampFields = {
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      admin_users: TableDefinition<
        {
          id: string;
          email: string;
          active: boolean;
        } & TimestampFields,
        {
          id?: string;
          email: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      categories: TableDefinition<
        {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_thumb: string | null;
          active: boolean;
          sort_order: number;
        } & TimestampFields,
        {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_thumb?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      packs: TableDefinition<
        {
          id: string;
          category_id: string | null;
          slug: string;
          title: string;
          short_description: string;
          long_description: string | null;
          thumbnail_image: string | null;
          hero_image: string | null;
          hero_alt: string | null;
          checkout_url: string;
          status: "draft" | "published";
          active: boolean;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
        } & TimestampFields,
        {
          id?: string;
          category_id?: string | null;
          slug: string;
          title: string;
          short_description?: string;
          long_description?: string | null;
          thumbnail_image?: string | null;
          hero_image?: string | null;
          hero_alt?: string | null;
          checkout_url?: string;
          status?: "draft" | "published";
          active?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      pack_prices: TableDefinition<
        {
          id: string;
          pack_id: string;
          price_cents: number;
          old_price_cents: number | null;
          installment_text: string | null;
          cta_text: string;
          badge_text: string | null;
        } & TimestampFields,
        {
          id?: string;
          pack_id: string;
          price_cents?: number;
          old_price_cents?: number | null;
          installment_text?: string | null;
          cta_text?: string;
          badge_text?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      pack_benefits: TableDefinition<
        {
          id: string;
          pack_id: string;
          text: string;
          sort_order: number;
        } & TimestampFields,
        {
          id?: string;
          pack_id: string;
          text: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      pack_media: TableDefinition<
        {
          id: string;
          pack_id: string;
          section_type: "posts" | "feed" | "carousel" | "stories";
          group_key: string | null;
          group_sort_order: number;
          file_path: string;
          thumb_path: string | null;
          alt_text: string | null;
          sort_order: number;
          active: boolean;
        } & TimestampFields,
        {
          id?: string;
          pack_id: string;
          section_type: "posts" | "feed" | "carousel" | "stories";
          group_key?: string | null;
          group_sort_order?: number;
          file_path: string;
          thumb_path?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
