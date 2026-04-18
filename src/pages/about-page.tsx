import { Footer } from "../components/layout/footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Zap, ShieldCheck, Headphones } from "lucide-react";
import { motion, Variants } from "motion/react";

export function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-black/[0.02] rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-black/[0.01] rounded-full blur-[100px]" />
      </div>

      {/* Navigation Bar - Standardized to match PackDetailPage */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-5 px-6 py-4 md:px-8 lg:px-10">
          <Link to="/" className="text-[1.85rem] font-semibold leading-none hover:opacity-70 transition-opacity">
            Brandly
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[0.96rem] font-medium hover:opacity-50 transition-opacity">
              <ArrowLeft className="size-4" />
              <span>Voltar ao Início</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative pt-16 md:pt-24 pb-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Title & Subtext Section - Left Aligned */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-display leading-[0.9] tracking-tighter text-[#080808]">
                Design de <span className="text-black/30 italic font-medium">alto nível</span> para marcas que buscam protagonismo.
              </h1>
              <p className="text-2xl md:text-3xl font-medium leading-[1.2] text-black/40 tracking-tight max-w-4xl">
                A Brandly nasceu para simplificar a excelência visual, unindo a agilidade de um estúdio com a qualidade de grandes agências.
              </p>
            </motion.div>
            
            {/* Content Section - Darker and Justified */}
            <motion.div variants={itemVariants} className="mt-20">
              <div className="space-y-12">
                <div className="h-px w-full bg-black/[0.05]" />
                
                <div className="space-y-10 text-xl md:text-2xl text-black/75 leading-[1.7] text-justify font-light italic">
                  <p>
                    Acreditamos que no ambiente digital saturado de hoje, um design medíocre é invisível. Nossa missão é garantir que sua marca não apenas apareça, mas se destaque com elegância e propósito. Criamos ativos que comunicam autoridade e profissionalismo em cada detalhe.
                  </p>
                  <p>
                    Desenvolvemos packs estratégicos pensados para transformar seu feed em uma vitrine de alto impacto. Oferecemos autonomia para empreendedores que sabem que a imagem é o primeiro ponto de contato com o cliente em um ecossistema digital cada vez mais visual e competitivo.
                  </p>
                  <p>
                    Com a Brandly, você elimina a confusão visual e foca no que realmente importa: o crescimento do seu negócio através de uma presença consistente, moderna e profissional em todas as suas frentes de comunicação.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Value Pillars Section (Instead of raw numbers) */}
            <motion.div 
              variants={itemVariants} 
              className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="p-8 rounded-2xl bg-white border border-black/[0.03] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all group overflow-hidden relative">
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-24 h-24 bg-black/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="size-12 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <Zap className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Agilidade Real</h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  Designs de alto nível prontos para uso, economizando centenas de horas de criação.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-black/[0.03] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all group overflow-hidden relative">
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-24 h-24 bg-black/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="size-12 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Qualidade Premium</h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  Cada elemento é curado por designers especialistas em conversão e estética moderna.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-black/[0.03] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all group overflow-hidden relative">
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-24 h-24 bg-black/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="size-12 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Fácil Edição</h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  Processo intuitivo que permite que você mantenha sua essência de forma descomplicada.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-black/[0.03] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all group overflow-hidden relative">
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-24 h-24 bg-black/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="size-12 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <Headphones className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Suporte Direto</h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  Time especializado pronto para ajudar você a extrair o melhor dos nossos materiais.
                </p>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-32 md:mt-40 text-center"
            >
              <div className="bg-black text-white rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[30%] h-[50%] bg-white/10 rounded-full blur-[80px] group-hover:bg-white/15 transition-colors" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-6xl font-display leading-[0.9] tracking-tighter">
                    Pronto para elevar sua marca?
                  </h2>
                  <p className="text-white/60 text-lg">
                    Explore nossa curadoria de packs e comece a postar com a qualidade que seu negócio merece hoje mesmo.
                  </p>
                  <div className="pt-4">
                    <Link 
                      to="/#packs" 
                      className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Ver Catálogo
                      <Sparkles className="size-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
