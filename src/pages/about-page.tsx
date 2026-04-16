import { Footer } from "../components/layout/footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            Brandly
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[1rem] font-medium">
            <Link to="/" className="hover:opacity-50 transition-opacity">Voltar ao Início</Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-12 text-sm uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="size-4" />
            Votar para o início
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-display leading-[1.1] mb-8 tracking-tight">
              Não somos uma agência.<br/>
              Somos um <span className="text-black/40 italic font-medium">estúdio de design</span> para redes sociais.
            </h1>
            
            <div className="grid md:grid-cols-2 gap-12 mt-20">
              <div className="space-y-6 text-lg text-black/80 leading-relaxed">
                <p>
                  A Brandly nasceu para resolver um problema comum: a falta de tempo e recursos para manter uma presença visual impactante nas redes sociais.
                </p>
                <p>
                  Diferente de agências tradicionais que focam em gestão completa de tráfego e conteúdo, nós focamos na excelência visual. Acreditamos que um design de alto nível é a base para qualquer estratégia de sucesso.
                </p>
              </div>
              <div className="space-y-6 text-lg text-black/80 leading-relaxed">
                <p>
                  Criamos packs de artes prontos para editar e postar, pensados estrategicamente para diferentes nichos. Nosso objetivo é dar autonomia para empreendedores e pequenas empresas.
                </p>
                <p>
                  Com os nossos materiais, você não precisa ser um designer para ter uma rede social com aparência profissional e consistente.
                </p>
              </div>
            </div>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/5 pt-12">
              <div>
                <span className="block text-3xl font-bold mb-1">100+</span>
                <span className="text-sm text-black/50 uppercase tracking-widest">Packs Criados</span>
              </div>
              <div>
                <span className="block text-3xl font-bold mb-1">5000+</span>
                <span className="text-sm text-black/50 uppercase tracking-widest">Artes Editadas</span>
              </div>
              <div>
                <span className="block text-3xl font-bold mb-1">24/7</span>
                <span className="text-sm text-black/50 uppercase tracking-widest">Suporte Direto</span>
              </div>
              <div>
                <span className="block text-3xl font-bold mb-1">99%</span>
                <span className="text-sm text-black/50 uppercase tracking-widest">Satisfação</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
