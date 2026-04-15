export type CatalogCategory = {
  id: string;
  label: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  imageSrc: string;
  href: string;
};

export const catalogCategories: CatalogCategory[] = [
  { id: "all", label: "Todos" },
  { id: "fitness", label: "Fitness" },
  { id: "saude", label: "Saude" },
  { id: "pets", label: "Pets" },
  { id: "casa", label: "Casa" },
  { id: "vendas", label: "Vendas" },
  { id: "digitais", label: "Digitais" }
];

export const catalogItems: CatalogItem[] = [
  {
    id: "academia-performance",
    title: "Academia Performance",
    categoryId: "fitness",
    description: "Posts objetivos para agenda de treinos, ofertas e rotina de aulas.",
    imageSrc: "/media/catalog/academia-performance.png",
    href: "#"
  },
  {
    id: "personal-trainer",
    title: "Personal Trainer",
    categoryId: "fitness",
    description: "Material leve para consultoria, depoimentos e acompanhamento online.",
    imageSrc: "/media/catalog/personal-trainer.png",
    href: "#"
  },
  {
    id: "acupuntura-clinica",
    title: "Acupuntura Clinica",
    categoryId: "saude",
    description: "Capas e posts para explicar tratamentos, beneficios e horarios.",
    imageSrc: "/media/catalog/acupuntura-clinica.png",
    href: "#"
  },
  {
    id: "fisioterapia-movimento",
    title: "Fisioterapia Movimento",
    categoryId: "saude",
    description: "Templates para rotina de atendimento, orientacoes e captacao local.",
    imageSrc: "/media/catalog/fisioterapia-movimento.png",
    href: "#"
  },
  {
    id: "pet-shop",
    title: "Pet Shop Essencial",
    categoryId: "pets",
    description: "Artes para banho, tosa, produtos e campanhas sazonais para pet shops.",
    imageSrc: "/media/catalog/pet-shop-essencial.png",
    href: "#"
  },
  {
    id: "adestramento-canino",
    title: "Adestramento Canino",
    categoryId: "pets",
    description: "Conteudo para aulas, duvidas comuns e exibicao de resultados reais.",
    imageSrc: "/media/catalog/adestramento-canino.png",
    href: "#"
  },
  {
    id: "arquitetura-studio",
    title: "Arquitetura Studio",
    categoryId: "casa",
    description: "Apresente projetos, antes e depois e detalhes de acabamento com clareza.",
    imageSrc: "/media/catalog/arquitetura-studio.png",
    href: "#"
  },
  {
    id: "imobiliaria-prime",
    title: "Imobiliaria Prime",
    categoryId: "casa",
    description: "Cards prontos para lancamentos, visitas e imoveis de destaque.",
    imageSrc: "/media/catalog/imobiliaria-prime.png",
    href: "#"
  },
  {
    id: "acaiteria-fresh",
    title: "Acaiteria Fresh",
    categoryId: "vendas",
    description: "Pecas para cardapio, combos e promocoes com apelo visual rapido.",
    imageSrc: "/media/catalog/acaiteria-fresh.png",
    href: "#"
  },
  {
    id: "cafeteria-house",
    title: "Cafeteria House",
    categoryId: "vendas",
    description: "Posts de vitrine, bebidas sazonais e comunicacao de menu diario.",
    imageSrc: "/media/catalog/cafeteria-house.png",
    href: "#"
  },
  {
    id: "afiliado-conversao",
    title: "Afiliado Conversao",
    categoryId: "digitais",
    description: "Estrutura enxuta para oferta, prova social e chamadas de acao diretas.",
    imageSrc: "/media/catalog/afiliado-conversao.png",
    href: "#"
  },
  {
    id: "social-media-express",
    title: "Social Media Express",
    categoryId: "digitais",
    description: "Templates para servicos, portfolio rapido e onboarding de clientes.",
    imageSrc: "/media/catalog/social-media-express.png",
    href: "#"
  }
];
