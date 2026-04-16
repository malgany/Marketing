# Brandly Design System & Layout

## Goals
Build a modern marketing website for "Brandly", a design studio specialized in social media packs. The site focuses on high visual impact, clear typography, and a seamless transition between a cinematic hero section and a product catalog.

## Architecture
- **Multi-page Application**: Built with React Router (v7).
- **Key Pages**:
  - `HomePage`: Hero section + Catalog listing.
  - `PackDetailPage`: Information-rich page with dynamic galleries (Posts, Feed, Stories, Carousels), FAQs, and testimonials.
  - `AboutPage`: Business positioning as a design studio.
  - `AdminPanel`: Management interface for packs and media.

## Visual Identity
- **Primary Font**: Inter (loaded via Google Fonts). Used for body text and functional UI.
- **Display Font**: Custom display font (Anton-like) used via `font-display` class for large uppercase headings.
- **Color Palette**:
  - Background: Primary white (#FFFFFF) with sections in light gray (#F7F7F7) or cream (#F4F1EA) to create visual rhythm.
  - Typography: Pure black (#000000) for high contrast and readability.
  - Accents: Subtle transparency for hover states and borders.

## Hero Section (`src/components/sections/hero-section.tsx`)
- **Background Media**: Fullscreen video background (`/media/hero-presentation-original.mp4`).
- **Layout Breakpoints**:
  - **Large/XL (`lg:`, `xl:`)**: 3-column layout. Heading on the left, video/empty space in the center, stat blocks on the right.
  - **Medium (`md:`)**: 2-column, 3-row layout. Heading and video above, stat blocks below in a 2-column grid.
  - **Small/Mobile**: Single-column vertical stack. Video background is hidden.
- **Main Heading**: "PACKS PRONTOS / PARA EDITAR / E POSTAR".
- **CTA**: "Ver packs" (primary button with ArrowDown icon).

## Pack Detail Page (`src/pages/pack-detail-page.tsx`)
- **Structure**:
  - Floating/Sticky Header with standard navigation.
  - Hero image/Description.
  - Segmented Galleries (Posts, Feed, Stories).
  - Carousel Preview with grouped images.
  - Offer Block (Pricing with old price, badge, and installment info).
  - FAQ and Testimonials sections.
- **Interactivity**: Lightbox modal for viewing media in full size.

## Navigation & Interactions
- **Main Nav**: "Packs", "Categorias", "Sobre Nós", "Contato".
- **Hover Effects**: Standardized opacity transitions (Logo at 70%, Back links at 50%, Nav links at 60%).
- **Smooth Scrolling**: Internal links use hash navigation (`#packs`, `#pricing`).