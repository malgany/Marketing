# Diretrizes de Design e Contexto do Projeto - Brandly

Este documento serve como referência para manter a consistência visual e funcional em todo o projeto Brandly.

## 1. Cabeçalho (Header)
- **Padronização:** Todas as subpáginas (Sobre, Detalhes do Pack, etc.) devem utilizar o mesmo estilo de cabeçalho.
- **Botão de Retorno:** O botão de voltar deve sempre exibir o texto **"Voltar ao Início"**.
- **Estilo Visual:** 
  - `sticky top-0 z-30`
  - Fundo: `bg-white/92` com `backdrop-blur-md`
  - Borda inferior: `border-b border-black/10`
  - Link de navegação: `inline-flex items-center gap-2 text-[0.96rem] font-medium hover:opacity-50 transition-opacity`

## 2. Layout de Conteúdo e Texto
- **Páginas Institucionais (Ex: Sobre):** 
  - Utilizar um fluxo vertical centralizado (`mx-auto max-w-4xl`).
  - **Título (H1):** Sempre centralizado com `font-display`.
  - **Alinhamento de Texto:** Usar `text-justify` para blocos de texto maiores para preencher a tela de forma equilibrada, mantendo o bloco centralizado.
  - **Espaçamento:** Garantir respiro entre as seções, mantendo a harmonia visual.

## 3. Identidade Visual
- **Fundo Principal:** Utilizar `bg-white` como base padrão para garantir integração perfeita com componentes globais (Footer, etc.).
- **Tipografia:** 
  - `font-display` (Anton) para títulos de impacto.
  - Tipografia padrão do sistema (Inter) para corpo de texto.
- **Cores:** Focar em uma paleta minimalista (Preto, Branco e Tons de Cinza/Transparências) para um visual premium.

## 4. Detalhes Técnicos e Boas Práticas
- **Acentuação:** Atenção rigorosa à acentuação e gramática em Português. Existe uma skill específica no projeto para revisão de acertos gramaticais.
- **Componentização:** Sempre que possível, reutilizar componentes globais como `Footer` e `TestimonialCarousel`.
- **Animações:** Utilizar `motion` (Framer Motion) para entradas suaves de conteúdo, aplicando um efeito de "wow" discreto e premium.

## 5. SEO e Metadados
- Manter títulos de página dinâmicos e metadados descritivos para cada pack e página institucional.
