insert into public.categories (name, slug, description, active, sort_order)
values
  ('Fitness', 'fitness', 'Packs para academias, treinos e profissionais fitness.', true, 10),
  ('Saude', 'saude', 'Packs para clinicas, tratamentos e atendimentos de saude.', true, 20),
  ('Pets', 'pets', 'Packs para pet shops, adestramento e servicos para animais.', true, 30),
  ('Casa', 'casa', 'Packs para arquitetura, imoveis e servicos residenciais.', true, 40),
  ('Vendas', 'vendas', 'Packs para cardapios, ofertas e negocios locais.', true, 50),
  ('Digitais', 'digitais', 'Packs para servicos digitais, afiliados e social media.', true, 60)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  active = excluded.active,
  sort_order = excluded.sort_order;

with seed_packs(slug, category_slug, title, short_description, thumbnail_image, sort_order) as (
  values
    ('academia-performance', 'fitness', 'Academia Performance', 'Posts objetivos para agenda de treinos, ofertas e rotina de aulas.', '/media/catalog/academia-performance.png', 10),
    ('personal-trainer', 'fitness', 'Personal Trainer', 'Material leve para consultoria, depoimentos e acompanhamento online.', '/media/catalog/personal-trainer.png', 20),
    ('acupuntura-clinica', 'saude', 'Acupuntura Clinica', 'Capas e posts para explicar tratamentos, beneficios e horarios.', '/media/catalog/acupuntura-clinica.png', 30),
    ('fisioterapia-movimento', 'saude', 'Fisioterapia Movimento', 'Templates para rotina de atendimento, orientacoes e captacao local.', '/media/catalog/fisioterapia-movimento.png', 40),
    ('pet-shop-essencial', 'pets', 'Pet Shop Essencial', 'Artes para banho, tosa, produtos e campanhas sazonais para pet shops.', '/media/catalog/pet-shop-essencial.png', 50),
    ('adestramento-canino', 'pets', 'Adestramento Canino', 'Conteudo para aulas, duvidas comuns e exibicao de resultados reais.', '/media/catalog/adestramento-canino.png', 60),
    ('arquitetura-studio', 'casa', 'Arquitetura Studio', 'Apresente projetos, antes e depois e detalhes de acabamento com clareza.', '/media/catalog/arquitetura-studio.png', 70),
    ('imobiliaria-prime', 'casa', 'Imobiliaria Prime', 'Cards prontos para lancamentos, visitas e imoveis de destaque.', '/media/catalog/imobiliaria-prime.png', 80),
    ('acaiteria-fresh', 'vendas', 'Acaiteria Fresh', 'Pecas para cardapio, combos e promocoes com apelo visual rapido.', '/media/catalog/acaiteria-fresh.png', 90),
    ('cafeteria-house', 'vendas', 'Cafeteria House', 'Posts de vitrine, bebidas sazonais e comunicacao de menu diario.', '/media/catalog/cafeteria-house.png', 100),
    ('afiliado-conversao', 'digitais', 'Afiliado Conversao', 'Estrutura enxuta para oferta, prova social e chamadas de acao diretas.', '/media/catalog/afiliado-conversao.png', 110),
    ('social-media-express', 'digitais', 'Social Media Express', 'Templates para servicos, portfolio rapido e onboarding de clientes.', '/media/catalog/social-media-express.png', 120)
)
insert into public.packs (
  category_id,
  slug,
  title,
  short_description,
  long_description,
  thumbnail_image,
  hero_image,
  hero_alt,
  checkout_url,
  status,
  active,
  sort_order,
  seo_title,
  seo_description
)
select
  categories.id,
  seed_packs.slug,
  seed_packs.title,
  seed_packs.short_description,
  'Pack editavel para redes sociais com posts, carrosseis, stories e material organizado para publicar com rapidez.',
  seed_packs.thumbnail_image,
  seed_packs.thumbnail_image,
  seed_packs.title,
  'https://example.com/checkout/' || seed_packs.slug,
  'published',
  true,
  seed_packs.sort_order,
  seed_packs.title || ' - Pack de Social Media',
  seed_packs.short_description
from seed_packs
join public.categories on categories.slug = seed_packs.category_slug
on conflict (slug) do update
set
  category_id = excluded.category_id,
  title = excluded.title,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  thumbnail_image = excluded.thumbnail_image,
  hero_image = excluded.hero_image,
  hero_alt = excluded.hero_alt,
  checkout_url = excluded.checkout_url,
  status = excluded.status,
  active = excluded.active,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

insert into public.pack_prices (
  pack_id,
  price_cents,
  old_price_cents,
  installment_text,
  cta_text,
  badge_text
)
select
  packs.id,
  4790,
  null,
  'ou 8x de R$ 6,97',
  'Acesse agora o seu pack',
  'Oferta limitada'
from public.packs
where packs.slug in (
  'academia-performance',
  'personal-trainer',
  'acupuntura-clinica',
  'fisioterapia-movimento',
  'pet-shop-essencial',
  'adestramento-canino',
  'arquitetura-studio',
  'imobiliaria-prime',
  'acaiteria-fresh',
  'cafeteria-house',
  'afiliado-conversao',
  'social-media-express'
)
on conflict (pack_id) do update
set
  price_cents = excluded.price_cents,
  old_price_cents = excluded.old_price_cents,
  installment_text = excluded.installment_text,
  cta_text = excluded.cta_text,
  badge_text = excluded.badge_text;

with benefit_rows(text, sort_order) as (
  values
    ('80 designs 100% editaveis', 10),
    ('4 templates de carrossel infinito', 20),
    ('Capas para destaques', 30),
    ('Legendas prontas', 40),
    ('Aula de como editar os templates', 50),
    ('Organizador de feed para visualizar antes de postar', 60)
)
insert into public.pack_benefits (pack_id, text, sort_order)
select packs.id, benefit_rows.text, benefit_rows.sort_order
from public.packs
cross join benefit_rows
where packs.slug in (
  'academia-performance',
  'personal-trainer',
  'acupuntura-clinica',
  'fisioterapia-movimento',
  'pet-shop-essencial',
  'adestramento-canino',
  'arquitetura-studio',
  'imobiliaria-prime',
  'acaiteria-fresh',
  'cafeteria-house',
  'afiliado-conversao',
  'social-media-express'
)
and not exists (
  select 1
  from public.pack_benefits existing
  where existing.pack_id = packs.id
    and existing.text = benefit_rows.text
);

with media_seed(section_type, group_key, group_sort_order, sort_order) as (
  values
    ('posts', null, 0, 10),
    ('posts', null, 0, 20),
    ('posts', null, 0, 30),
    ('carousel', 'carousel-01', 10, 10),
    ('carousel', 'carousel-01', 10, 20),
    ('stories', null, 0, 10),
    ('stories', null, 0, 20)
)
insert into public.pack_media (
  pack_id,
  section_type,
  group_key,
  group_sort_order,
  file_path,
  thumb_path,
  alt_text,
  sort_order,
  active
)
select
  packs.id,
  media_seed.section_type,
  media_seed.group_key,
  media_seed.group_sort_order,
  packs.thumbnail_image,
  packs.thumbnail_image,
  packs.title,
  media_seed.sort_order,
  true
from public.packs
cross join media_seed
where packs.slug in (
  'academia-performance',
  'personal-trainer',
  'acupuntura-clinica',
  'fisioterapia-movimento',
  'pet-shop-essencial',
  'adestramento-canino',
  'arquitetura-studio',
  'imobiliaria-prime',
  'acaiteria-fresh',
  'cafeteria-house',
  'afiliado-conversao',
  'social-media-express'
)
and not exists (
  select 1
  from public.pack_media existing
  where existing.pack_id = packs.id
    and existing.section_type = media_seed.section_type
    and coalesce(existing.group_key, '') = coalesce(media_seed.group_key, '')
    and existing.sort_order = media_seed.sort_order
);
