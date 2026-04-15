import { useEffect, useState, type ComponentProps } from "react";
import { ArrowDown } from "lucide-react";
import { VideoBackground } from "../media/video-background";
import { cn } from "../../lib/utils";

const navigationLinks = [
  { label: "Packs", href: "#packs" },
  { label: "Categorias", href: "#packs" },
  { label: "FAQ", href: "#packs" },
  { label: "Contato", href: "#packs" }
];

function SocialButton({
  label,
  children
}: {
  label: string;
  children: ComponentProps<"svg">["children"];
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-7 items-center justify-center text-black transition-opacity duration-200 hover:opacity-65"
    >
      <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none">
        {children}
      </svg>
    </button>
  );
}

function StatBlock({
  title,
  body,
  className
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[24rem]", className)}>
      <h2 className="font-display text-[clamp(2rem,2.3vw,3rem)] leading-[0.95] text-black">
        {title}
      </h2>
      <p className="mt-3 max-w-[22rem] text-[1rem] leading-[1.48] text-[#1a1a1a] md:text-[1.03rem]">
        {body}
      </p>
    </div>
  );
}

function PrimaryCta() {
  return (
    <a
      href="#packs"
      className="inline-flex w-fit items-center gap-3 rounded-full bg-black py-1 pr-1 pl-7 text-[1rem] font-medium text-white shadow-[0_14px_28px_rgba(8,8,8,0.08)] transition-colors duration-200 hover:bg-black/85 sm:text-[1.05rem]"
    >
      <span className="whitespace-nowrap">Ver packs</span>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
        <ArrowDown className="size-4" strokeWidth={2.1} />
      </span>
    </a>
  );
}

export function HeroSection() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(true);

  useEffect(() => {
    const conn = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }).connection;
    const isSlow =
      conn && (["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? "") || conn.saveData);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isSlow || prefersReducedMotion) {
      setShouldPlayVideo(false);
    }
  }, []);

  return (
    <section className="hero-shell relative isolate min-h-[92svh] overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 hidden pointer-events-none md:block">
        <img
          src="/media/hero-poster.png?v=2"
          alt=""
          className="h-full w-full object-cover object-[54%_38%] transition-opacity duration-700 md:object-center"
          loading="eager"
        />
      </div>

      {shouldPlayVideo ? (
        <div
          className={cn(
            "absolute inset-0 z-[1] hidden pointer-events-none transition-opacity duration-[1500ms] ease-in-out md:block",
            videoEnded ? "opacity-0" : "opacity-100"
          )}
        >
          <VideoBackground
            src="/media/hero-presentation-original.mp4?v=2"
            poster="/media/hero-poster.png?v=2"
            containerClassName="h-full w-full"
            videoClassName="h-full w-full object-cover object-[54%_38%] md:object-center"
            preload="auto"
            loop={false}
            onEnded={() => setVideoEnded(true)}
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[3] hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_8%,rgba(245,243,238,0.05)_48%,rgba(245,243,238,0.22)_100%)] md:block" />

      <header className="relative z-10 pt-4 md:pt-5 lg:pt-6">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-8">
            <div className="justify-self-start text-[2.05rem] font-semibold text-black lg:text-[2.3rem]">
              Brandly
            </div>

            <div className="hidden items-center justify-center gap-8 text-[1.02rem] text-[#111111] md:flex">
              {navigationLinks.map((link) => (
                <a key={link.label} href={link.href} className="transition-opacity duration-200 hover:opacity-60">
                  {link.label}
                </a>
              ))}
            </div>

            <div aria-hidden="true" className="hidden justify-self-end md:block md:w-[8.5rem]" />
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] px-6 pb-14 pt-6 md:px-8 md:pb-16 md:pt-7 lg:px-10 lg:pb-20 lg:pt-6">
        <div className="grid w-full gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)] md:grid-rows-[auto_minmax(0,1fr)_auto] md:gap-x-8 md:gap-y-8 xl:grid-cols-[minmax(0,0.94fr)_minmax(21rem,0.92fr)_minmax(17rem,0.68fr)] xl:grid-rows-[auto_minmax(0,1fr)] xl:gap-x-10 xl:gap-y-6">
          <div className="order-1 flex max-w-[28rem] flex-col gap-6 md:col-start-1 md:row-start-1 md:gap-7 xl:max-w-[30rem] xl:self-start xl:pt-3">
            <div>
              <h1 className="font-display flex flex-col gap-1 text-[clamp(3.7rem,7vw,6.25rem)] leading-[0.86] text-black">
                <span className="block">PACKS PRONTOS</span>
                <span className="block">PARA EDITAR</span>
                <span className="block">E POSTAR</span>
              </h1>

              <p className="mt-5 max-w-[24rem] text-[1.12rem] leading-[1.42] text-[#181818] md:mt-6 md:text-[1.14rem]">
                Artes e materiais para redes sociais, organizados para voce escolher rapido,
                editar em minutos e comprar sem complicacao.
              </p>
            </div>

            <PrimaryCta />
          </div>

          <div className="order-2 hidden items-center justify-center md:col-start-2 md:row-span-2 md:row-start-1 md:flex md:self-center xl:col-start-2 xl:row-span-2 xl:row-start-1">
            <div
              aria-hidden="true"
              className="aspect-[4/5] w-full max-w-[clamp(17rem,31vw,34rem)]"
            />
          </div>

          <div className="order-3 max-w-[28rem] md:col-start-1 md:row-start-2 md:max-w-[25rem] md:self-end xl:row-start-2 xl:pb-3">
            <p className="text-[1.03rem] leading-[1.45] text-[#1a1a1a] md:text-[1.08rem]">
              Para pequenas empresas e empreendedores que precisam manter as redes em dia
              com mais praticidade, rapidez e organizacao.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <SocialButton label="Facebook">
                <path
                  fill="currentColor"
                  d="M18.74 3H5.26A2.26 2.26 0 0 0 3 5.26v13.48A2.26 2.26 0 0 0 5.26 21H12v-6.76H9.73v-2.62H12V9.69c0-2.26 1.34-3.53 3.4-3.53.97 0 1.98.17 1.98.17v2.22h-1.11c-1.09 0-1.43.68-1.43 1.38v1.69h2.44l-.39 2.62h-2.05V21h3.9A2.26 2.26 0 0 0 21 18.74V5.26A2.26 2.26 0 0 0 18.74 3Z"
                />
              </SocialButton>

              <SocialButton label="Instagram">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4.8"
                  stroke="currentColor"
                  strokeWidth="1.9"
                />
                <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="17.2" cy="6.9" r="1.15" fill="currentColor" />
              </SocialButton>

              <SocialButton label="YouTube">
                <path
                  d="M20.25 8.35a2.4 2.4 0 0 0-1.68-1.7C17.08 6.25 12 6.25 12 6.25s-5.08 0-6.57.4a2.4 2.4 0 0 0-1.68 1.7A25.28 25.28 0 0 0 3.35 12c0 1.24.14 2.46.4 3.65a2.4 2.4 0 0 0 1.68 1.7c1.49.4 6.57.4 6.57.4s5.08 0 6.57-.4a2.4 2.4 0 0 0 1.68-1.7c.26-1.19.4-2.41.4-3.65s-.14-2.46-.4-3.65Z"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
                <path d="m10.25 14.48 4.55-2.48-4.55-2.48v4.96Z" fill="currentColor" />
              </SocialButton>
            </div>
          </div>

          <div className="order-4 mt-2 grid gap-10 pt-10 md:col-span-2 md:row-start-3 md:mt-0 md:grid-cols-2 md:gap-10 md:pt-8 xl:col-span-1 xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:grid-cols-1 xl:content-between xl:pt-3">
            <StatBlock
              title="PRONTO PARA EDITAR"
              body="Escolha o pack ideal, ajuste textos, cores e informacoes e publique sem comecar do zero."
              className="xl:ml-auto xl:text-right"
            />

            <StatBlock
              title="TUDO ORGANIZADO"
              body="Encontre packs por tema, formato e objetivo para decidir mais rapido e comprar com clareza."
              className="xl:ml-auto xl:text-right xl:self-end"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
