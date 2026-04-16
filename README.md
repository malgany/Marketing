# Brandly - Packs de Social Media

Site em React/Vite para vitrine e venda de packs editaveis de social media. A home lista packs publicados do Supabase e cada pack tem uma pagina dinamica em `/packs/:slug`.

![Brandly Banner](./public/media/hero-poster.png)

## Features

- Home com hero e vitrine dinamica.
- Pagina publica de detalhe por slug.
- Painel admin protegido por Supabase Auth + allowlist em `admin_users`.
- Cadastro de categorias, packs, preco, beneficios e galerias.
- Upload de imagens para o bucket publico `pack-media`.
- FAQ e depoimentos estaticos nesta primeira fase.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Supabase Database, Storage e Auth
- React Router
- Lucide React

## Getting Started

### Prerequisites

- Node.js LTS
- npm
- Projeto Supabase

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:malgany/Marketing.git
   cd marketing0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

1. Crie `.env.local` com base em `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

2. Rode a migration SQL em `supabase/migrations/20260415000000_initial_packs.sql` pelo Supabase SQL Editor ou pela Supabase CLI.

3. Rode `supabase/seed.sql` para criar as categorias e os 12 packs iniciais da vitrine.

4. Crie o primeiro usuario no Supabase Auth e cadastre o e-mail dele na tabela `admin_users`:
   ```sql
   insert into public.admin_users (email, active)
   values ('admin@seudominio.com', true);
   ```

5. Acesse `/admin/login` e entre com o usuario criado no Supabase Auth.

## Project Structure

- `src/App.tsx`: rotas publicas e admin.
- `src/data/`: funcoes de leitura e escrita no Supabase.
- `src/pages/`: home, detalhe do pack, quem somos (Sobre Nós) e admin.
- `src/components/`: secoes publicas (hero, catalog), layout (header, footer) e shell do admin.
- `supabase/`: migration inicial e seed.
- `public/media/`: assets locais usados como transicao no seed inicial.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## License

This project is private and for demonstration purposes.
