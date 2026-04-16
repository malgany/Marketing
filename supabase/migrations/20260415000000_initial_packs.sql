create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_thumb text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  long_description text,
  thumbnail_image text,
  hero_image text,
  hero_alt text,
  checkout_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_prices (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null unique references public.packs(id) on delete cascade,
  price_cents integer not null default 0 check (price_cents >= 0),
  old_price_cents integer check (old_price_cents is null or old_price_cents >= 0),
  installment_text text,
  cta_text text not null default 'Acesse agora o seu pack',
  badge_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_benefits (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_media (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  section_type text not null check (section_type in ('posts', 'feed', 'carousel', 'stories')),
  group_key text,
  group_sort_order integer not null default 0,
  file_path text not null,
  thumb_path text,
  alt_text text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_active_sort_idx on public.categories(active, sort_order, name);
create index if not exists packs_public_sort_idx on public.packs(active, status, sort_order, title);
create index if not exists packs_category_idx on public.packs(category_id);
create index if not exists pack_benefits_pack_sort_idx on public.pack_benefits(pack_id, sort_order);
create index if not exists pack_media_pack_section_sort_idx on public.pack_media(pack_id, section_type, group_sort_order, sort_order);

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists packs_set_updated_at on public.packs;
create trigger packs_set_updated_at
before update on public.packs
for each row execute function public.set_updated_at();

drop trigger if exists pack_prices_set_updated_at on public.pack_prices;
create trigger pack_prices_set_updated_at
before update on public.pack_prices
for each row execute function public.set_updated_at();

drop trigger if exists pack_benefits_set_updated_at on public.pack_benefits;
create trigger pack_benefits_set_updated_at
before update on public.pack_benefits
for each row execute function public.set_updated_at();

drop trigger if exists pack_media_set_updated_at on public.pack_media;
create trigger pack_media_set_updated_at
before update on public.pack_media
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where active = true
      and lower(email::text) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.packs enable row level security;
alter table public.pack_prices enable row level security;
alter table public.pack_benefits enable row level security;
alter table public.pack_media enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published packs" on public.packs;
create policy "Public can read published packs"
on public.packs
for select
to anon, authenticated
using (active = true and status = 'published');

drop policy if exists "Admins can manage packs" on public.packs;
create policy "Admins can manage packs"
on public.packs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read prices for published packs" on public.pack_prices;
create policy "Public can read prices for published packs"
on public.pack_prices
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.packs
    where packs.id = pack_prices.pack_id
      and packs.active = true
      and packs.status = 'published'
  )
);

drop policy if exists "Admins can manage prices" on public.pack_prices;
create policy "Admins can manage prices"
on public.pack_prices
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read benefits for published packs" on public.pack_benefits;
create policy "Public can read benefits for published packs"
on public.pack_benefits
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.packs
    where packs.id = pack_benefits.pack_id
      and packs.active = true
      and packs.status = 'published'
  )
);

drop policy if exists "Admins can manage benefits" on public.pack_benefits;
create policy "Admins can manage benefits"
on public.pack_benefits
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media for published packs" on public.pack_media;
create policy "Public can read media for published packs"
on public.pack_media
for select
to anon, authenticated
using (
  active = true
  and exists (
    select 1
    from public.packs
    where packs.id = pack_media.pack_id
      and packs.active = true
      and packs.status = 'published'
  )
);

drop policy if exists "Admins can manage media" on public.pack_media;
create policy "Admins can manage media"
on public.pack_media
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pack-media',
  'pack-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read pack media" on storage.objects;
create policy "Public can read pack media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'pack-media');

drop policy if exists "Admins can upload pack media" on storage.objects;
create policy "Admins can upload pack media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'pack-media' and public.is_admin());

drop policy if exists "Admins can update pack media" on storage.objects;
create policy "Admins can update pack media"
on storage.objects
for update
to authenticated
using (bucket_id = 'pack-media' and public.is_admin())
with check (bucket_id = 'pack-media' and public.is_admin());

drop policy if exists "Admins can delete pack media" on storage.objects;
create policy "Admins can delete pack media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'pack-media' and public.is_admin());
