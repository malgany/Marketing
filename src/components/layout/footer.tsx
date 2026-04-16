import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Brandly</h2>
            <p className="text-white/60 max-w-sm text-lg leading-relaxed">
              Transformando a presença digital de empreendedores através do design estratégico. Especialistas em packs prontos para redes sociais.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm uppercase tracking-widest font-bold mb-6 text-white/40">Links Úteis</h3>
            <ul className="space-y-4">
              <li><Link to="/#packs" className="hover:text-white/60 transition-colors">Ver Packs</Link></li>
              <li><Link to="/sobre" className="hover:text-white/60 transition-colors">Quem Somos</Link></li>
              <li><a href="#packs" className="hover:text-white/60 transition-colors">Categorias</a></li>
              <li><a href="#packs" className="hover:text-white/60 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest font-bold mb-6 text-white/40">Redes Sociais</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-white/60 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white/60 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white/60 transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            © {currentYear} Brandly. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
