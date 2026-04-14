import { useState, useEffect, type ComponentProps } from "react";
import { ArrowDown } from "lucide-react";
import { VideoBackground } from "./components/media/video-background";
import { cn } from "./lib/utils";

const navigationLinks = ["Packs", "Categorias", "FAQ", "Contato"];

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

function StatBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="hidden text-right lg:block">
      <h2 className="font-display text-[1.875rem] leading-[1.1] tracking-tight text-black xl:text-[2.25rem]">
        {title}
      </h2>
      <p className="mt-3 ml-auto max-w-[22rem] text-[1.05rem] leading-[1.45] text-[#1a1a1a]">
        {body}
      </p>
    </div>
  );
}

export default function App() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(true);

  useEffect(() => {
    const checkViewportAndNetwork = () => {
      // Verifica tamanho da tela
      setIsLargeDesktop(window.innerWidth >= 1440);

      // Detecção de Rede e Performance
      const conn = (navigator as any).connection;
      const isSlow = conn && (['slow-2g', '2g', '3g'].includes(conn.effectiveType) || conn.saveData);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Se a conexão for lenta ou o hardware for limitado, desativamos o vídeo para economizar recursos
      if (isSlow || prefersReducedMotion) {
        setShouldPlayVideo(false);
      }
    };
    
    checkViewportAndNetwork();
    window.addEventListener("resize", checkViewportAndNetwork);
    return () => window.removeEventListener("resize", checkViewportAndNetwork);
  }, []);

  // Define qual imagem mostrar no final baseado no tamanho da tela
  const finalPoster = isLargeDesktop 
    ? "/media/hero-poster-last-frame.png?v=2" 
    : "/media/hero-poster.png?v=2";

  return (
    <main
      className="relative flex h-[100svh] flex-col overflow-hidden bg-[#f5f3ee] text-[#080808]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Camada de Poster (FICA SEMPRE NO FUNDO) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={videoEnded ? finalPoster : "/media/hero-poster.png?v=2"}
          alt=""
          className="h-full w-full object-cover object-center transition-opacity duration-700"
          loading="eager"
        />
      </div>

      {/* Camada de Vídeo (FICA POR CIMA E DESAPARECE NO FINAL) */}
      {shouldPlayVideo && (
        <div className={cn(
          "fixed inset-0 z-1 pointer-events-none transition-opacity duration-1000",
          videoEnded ? "opacity-0 invisible" : "opacity-100"
        )}>
          <VideoBackground
            src="/media/hero-presentation-original.mp4?v=2"
            poster="/media/hero-poster.png?v=2"
            containerClassName="h-full w-full"
            videoClassName="h-full w-full object-cover object-center"
            preload="auto"
            loop={false}
            onEnded={() => setVideoEnded(true)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Overlay de gradiente para legibilidade */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_8%,rgba(245,243,238,0.05)_48%,rgba(245,243,238,0.22)_100%)]" />

      <header className="relative z-10 flex-shrink-0 px-6 py-4 lg:px-12 lg:py-5">
        <nav className="flex items-center justify-between gap-5">
          <div className="text-[2.05rem] font-semibold tracking-[-0.055em] text-black lg:text-[2.3rem]">
            Brandly
          </div>

          <div className="hidden items-center gap-8 text-[1.02rem] text-[#111111] md:flex">
            {navigationLinks.map((link) => (
              <a key={link} href="#" className="transition-opacity duration-200 hover:opacity-60">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button
              type="button"
              className="hidden text-[1.05rem] text-[#111111] transition-opacity duration-200 hover:opacity-60"
            >
              Entrar
            </button>
            <button
              type="button"
              className="hidden rounded-[4px] bg-black px-5 py-2.5 text-[1.05rem] font-medium text-white transition-colors duration-200 hover:bg-black/85 lg:px-5"
            >
              Ver packs
            </button>
          </div>
        </nav>
      </header>

      <section className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pb-6 pt-4 lg:px-12 lg:pb-7 lg:pt-5">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(21rem,0.66fr)] lg:gap-14">
            <div className="max-w-[25rem]">
              <h1 className="font-display flex flex-col gap-1 text-[3rem] leading-[0.85] tracking-tight text-black lg:text-[3.75rem]">
                <span className="block">PACKS PRONTOS</span>
                <span className="block">PARA EDITAR</span>
                <span className="block">E POSTAR</span>
              </h1>

              <p className="hidden max-w-[23rem] text-[1.12rem] leading-[1.4] text-[#181818] lg:mt-5 lg:block lg:text-[1.14rem]">
                Artes e materiais para redes sociais, organizados para você escolher rápido,
                editar em minutos e comprar sem complicação.
              </p>

            </div>

            <StatBlock
              title="PRONTO PARA EDITAR"
              body="Escolha o pack ideal, ajuste textos, cores e informações e publique sem começar do zero."
            />
          </div>

          <div className="mt-8 grid items-start gap-8 lg:mt-[24rem] lg:max-xl:mt-[20rem] lg:grid-cols-[minmax(0,0.84fr)_minmax(21rem,0.66fr)] lg:gap-14">
            <div className="mt-[24rem] max-w-[24rem] lg:mt-0">
              <p className="text-[1.03rem] leading-[1.42] text-[#1a1a1a] lg:text-[1.08rem]">
                Para pequenas empresas e empreendedores que precisam manter as redes em dia
                com mais praticidade, rapidez e organização.
              </p>

              <div className="mt-3 flex items-center gap-3">
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

            <StatBlock
              title="TUDO ORGANIZADO"
              body="Encontre packs por tema, formato e objetivo para decidir mais rápido e comprar com clareza."
            />
          </div>

        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-6 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-3 rounded-full bg-black py-1 pr-1 pl-7 text-[1.08rem] font-medium text-white shadow-[0_14px_28px_rgba(8,8,8,0.08)] transition-colors duration-200 hover:bg-black/85 max-[340px]:gap-2 max-[340px]:pl-5 max-[340px]:pr-0.5 max-[340px]:text-[0.9rem] lg:bottom-8"
      >
        <span className="whitespace-nowrap">Ver packs</span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-black max-[340px]:size-9">
          <ArrowDown className="size-4 max-[340px]:size-3.5" strokeWidth={2.1} />
        </span>
      </button>
    </main>
  );
}
