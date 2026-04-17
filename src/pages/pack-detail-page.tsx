import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getPublishedPackBySlug } from "../data/packs";
import { formatCurrency } from "../lib/format";
import { hasSupabaseConfig } from "../lib/supabase";
import { resolveMediaUrl } from "../lib/storage";
import { cn } from "../lib/utils";
import type { CarouselGroup, PackDetail, PackMedia } from "../types/packs";
import { Footer } from "../components/layout/footer";
import { TestimonialCarousel } from "../components/sections/testimonial-carousel";




const faqs = [
  {
    question: "Como funciona o acesso ao conteúdo?",
    answer: "Após a compra, você recebe o link de acesso ao material do pack."
  },
  {
    question: "Posso editar as artes?",
    answer: "Sim. Os modelos foram pensados para edição rápida de textos, cores e informações."
  },
  {
    question: "O pack serve para qualquer nicho?",
    answer: "Cada pack é organizado para um nicho específico, com textos e formatos alinhados ao tema."
  },
  {
    question: "Preciso saber design para usar?",
    answer: "Não. A estrutura já vem pronta para você ajustar as informações principais."
  },
  {
    question: "Tem garantia?",
    answer: "As condições de garantia seguem a página de checkout vinculada ao pack."
  }
];


function PaymentStrip() {
  return (
    <div className="mt-3 flex items-center justify-center">
      <img
        src="/media/payment-methods.png"
        alt="Formas de pagamento: PIX, Cartões e Boleto"
        className="h-10 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
      />
    </div>
  );
}

function CtaButton({
  pack,
  className = "",
  isAnchor = false,
  highlight = false,
  label: customLabel
}: {
  pack: PackDetail;
  className?: string;
  isAnchor?: boolean;
  highlight?: boolean;
  label?: string;
}) {
  const label = customLabel || pack.price?.ctaText || "Acesse agora o seu pack";
  const href = isAnchor ? "#pricing" : (pack.checkoutUrl || "#");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchor) {
      e.preventDefault();
      const element = document.getElementById("pricing");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={className}>
      <a
        href={href}
        target={!isAnchor && href.startsWith("http") ? "_blank" : undefined}
        rel={!isAnchor && href.startsWith("http") ? "noreferrer" : undefined}
        onClick={handleClick}
        className={cn(
          "mx-auto inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] px-7 py-3 text-[0.98rem] font-semibold uppercase tracking-[0.04em] text-white transition-[background-color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4",
          highlight
            ? "border border-red-500/70 bg-red-600 shadow-[0_12px_36px_rgba(220,38,38,0.24)] hover:bg-red-500 hover:border-red-400 hover:shadow-[0_16px_42px_rgba(220,38,38,0.28)] focus-visible:ring-red-500"
            : "border border-black/12 bg-black hover:bg-black/82 focus-visible:ring-black"
        )}
      >
        <span>{label}</span>
        <ArrowUpRight className="size-4" />
      </a>
      <PaymentStrip />
    </div>
  );
}

function GalleryGrid({
  title,
  eyebrow,
  items,
  aspectClass,
  bgClass = "",
  onOpen
}: {
  title: string;
  eyebrow: string;
  items: PackMedia[];
  aspectClass: string;
  bgClass?: string;
  onOpen: (item: PackMedia) => void;
}) {
  return (
    <section className={cn("py-14 sm:py-18", bgClass)}>
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8 lg:px-10">
        <p className="text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
          {eyebrow}
        </p>
        <h2 className="mx-auto mt-3 max-w-[44rem] text-center font-display text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.9] text-black">
          {title}
        </h2>

        {items.length > 0 ? (
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const src = resolveMediaUrl(item.thumbPath || item.filePath);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpen(item)}
                  className="group overflow-hidden rounded-[8px] border border-black/10 bg-[#f4f1ea] text-left transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={item.altText}
                      className={`${aspectClass} w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  ) : (
                    <div className={`${aspectClass} flex w-full items-center justify-center text-black/42`}>
                      Sem imagem
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 rounded-[8px] border border-black/10 bg-white p-8 text-center text-black/58">
            Nenhuma prévia cadastrada nesta seção.
          </div>

        )}
      </div>
    </section>
  );
}

function CarouselPreview({
  groups,
  bgClass = "bg-[#f7f7f7]",
  onOpen
}: {
  groups: CarouselGroup[];
  bgClass?: string;
  onOpen: (item: PackMedia) => void;
}) {
  return (
    <section className={cn("py-14 sm:py-18", bgClass)}>
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8 lg:px-10">
        <p className="text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
          Criativo
        </p>
        <h2 className="mx-auto mt-3 max-w-[46rem] text-center font-display text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.9] text-black">
          Carrossel
        </h2>

        {groups.length > 0 ? (
          <div className="mt-9 space-y-5">
            {groups.map((group, index) => (
              <div key={group.key} className="rounded-[8px] border border-black/10 bg-white p-3">
                <div className="flex items-center justify-between gap-4 px-1 pb-3">
                  <h3 className="text-[1rem] font-semibold text-black">Carrossel {index + 1}</h3>
                  <span className="text-[0.86rem] text-black/48">{group.items.length} imagens</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {group.items.map((item) => {
                    const src = resolveMediaUrl(item.thumbPath || item.filePath);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onOpen(item)}
                        className="group overflow-hidden rounded-[8px] border border-black/10 bg-[#f4f1ea] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={item.altText}
                            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center text-black/42">
                            Sem imagem
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-[8px] border border-black/10 bg-white p-8 text-center text-black/58">
            Nenhum carrossel cadastrado.
          </div>
        )}
      </div>
    </section>
  );
}

function OfferBlock({ pack }: { pack: PackDetail }) {
  return (
    <section id="pricing" className="py-14 sm:py-18">
      <div className="mx-auto w-full max-w-[980px] px-6 md:px-8 lg:px-10">
        <div className="grid gap-9 rounded-[8px] border border-black/12 bg-white p-6 shadow-[0_18px_50px_rgba(8,8,8,0.07)] md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            {pack.price?.badgeText ? (
              <span className="inline-flex rounded-[8px] bg-black px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                {pack.price.badgeText}
              </span>
            ) : null}

            <h2 className="mt-5 font-display text-[clamp(2.1rem,4vw,4rem)] leading-[0.9] text-black">
              Pacote completo para Instagram
            </h2>

            <ul className="mt-6 space-y-3 text-[0.98rem] leading-[1.45] text-black/72">
              {pack.benefits.map((benefit) => (
                <li key={benefit.id} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-black" />
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center rounded-[8px] bg-[#f7f7f7] p-6 text-center">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
              Tudo isso por apenas
            </p>
            {pack.price?.oldPriceCents ? (
              <p className="mt-3 text-[0.95rem] text-black/42 line-through">
                {formatCurrency(pack.price.oldPriceCents)}
              </p>
            ) : null}
            <p className="mt-2 text-[2.5rem] font-bold leading-none text-black">
              {pack.price ? formatCurrency(pack.price.priceCents) : "Preço sob consulta"}
            </p>

            {pack.price?.installmentText ? (
              <p className="mt-3 text-[0.94rem] text-black/58">{pack.price.installmentText}</p>
            ) : null}
            <CtaButton pack={pack} label="EU QUERO ESSE PACK" highlight className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PackDetailPage() {
  const { slug } = useParams();
  const [pack, setPack] = useState<PackDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error" | "config">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPack = async () => {
      if (!hasSupabaseConfig) {
        setStatus("config");
        return;
      }

      if (!slug) {
        setStatus("not-found");
        return;
      }

      try {
        const data = await getPublishedPackBySlug(slug);

        if (!isMounted) {
          return;
        }

        if (!data) {
          setStatus("not-found");
          return;
        }

        setPack(data);
        setStatus("ready");
        document.title = data.seoTitle || `${data.title} - Brandly`;
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar o pack.");

        setStatus("error");
      }
    };

    void loadPack();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const openLightbox = (item: PackMedia) => {
    const src = resolveMediaUrl(item.filePath);

    if (src) {
      setLightbox({ src, alt: item.altText });
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-white p-8 text-black/64">Carregando pack...</div>;
  }


  if (status === "config") {
    return (
      <div className="min-h-screen bg-white p-8 text-black">
        <Link to="/" className="inline-flex items-center gap-2 text-[0.96rem] font-medium">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="mt-10 max-w-[42rem] rounded-[8px] border border-black/10 bg-[#f8f8f8] p-8">
          <h1 className="text-[1.5rem] font-semibold">Conteúdo indisponível</h1>
          <p className="mt-3 text-black/68">Esta página será exibida assim que tudo estiver pronto.</p>
        </div>

      </div>
    );
  }

  if (status === "not-found" || !pack) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-black">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
          Pack não encontrado
        </p>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.88]">
          Essa página ainda não está publicada
        </h1>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[8px] bg-black px-5 py-3 text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar para a vitrine
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return <div className="min-h-screen bg-white p-8 text-red-900">{errorMessage}</div>;
  }

  const heroImage = resolveMediaUrl(pack.heroImage || pack.thumbnailImage);

  return (
    <main className="bg-white text-black">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-5 px-6 py-4 md:px-8 lg:px-10">
          <Link to="/" className="text-[1.85rem] font-semibold leading-none hover:opacity-70 transition-opacity">
            Brandly
          </Link>
          <Link to="/#packs" className="inline-flex items-center gap-2 text-[0.96rem] font-medium hover:opacity-50 transition-opacity">
            <ArrowLeft className="size-4" />
            Ver outros packs
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1180px] px-6 pb-10 pt-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[8px] border border-black/10 bg-[#f4f1ea]">
          {heroImage ? (
            <img src={heroImage} alt={pack.heroAlt} className="max-h-[72vh] w-full object-cover" />
          ) : (
            <div className="flex min-h-[28rem] items-center justify-center text-black/42">Sem capa</div>
          )}
        </div>

        <div className="mx-auto max-w-[760px] py-9 text-center">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44">
            {pack.categoryName}
          </p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.86] text-black">
            {pack.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[40rem] text-[1.08rem] leading-[1.55] text-black/68">
            {pack.longDescription || pack.shortDescription}
          </p>
          <CtaButton pack={pack} isAnchor className="mt-7" />
        </div>
      </section>

      <GalleryGrid
        title="Posts"
        eyebrow="Impactantes"
        items={pack.posts}
        aspectClass="aspect-square"
        onOpen={openLightbox}
      />

      {pack.feed && pack.feed.length > 0 ? (
        <GalleryGrid
          title="Feed"
          eyebrow="Estratégicos"
          items={pack.feed}
          aspectClass="aspect-[4/5]"
          bgClass="bg-[#f7f7f7]"
          onOpen={openLightbox}
        />
      ) : null}


      <CarouselPreview groups={pack.carouselGroups} bgClass="bg-white" onOpen={openLightbox} />

      <CtaButton pack={pack} isAnchor className="bg-white px-6 py-12 text-center" />

      <GalleryGrid
        title="Stories"
        eyebrow="Inovadores"
        items={pack.stories}
        aspectClass="aspect-[9/16]"
        bgClass="bg-[#f7f7f7]"
        onOpen={openLightbox}
      />

      <OfferBlock pack={pack} />

      <TestimonialCarousel />

      <section className="py-14 sm:py-18">
        <div className="mx-auto w-full max-w-[980px] px-6 md:px-8 lg:px-10">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.9]">Dúvidas frequentes</h2>
          <div className="mt-8 divide-y divide-black/10 rounded-[8px] border border-black/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1rem] font-semibold">
                  <span>{faq.question}</span>
                  <span className="text-black/42 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[46rem] text-[0.96rem] leading-[1.55] text-black/64">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Fechar imagem"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-[8px] bg-white text-black"
          >
            <X className="size-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[92vh] max-w-[92vw] rounded-[8px] object-contain"
          />
        </div>
      ) : null}

      <Footer />
    </main>
  );
}
