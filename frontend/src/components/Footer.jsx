import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-20 lg:pt-28 pb-12" style={{ paddingLeft: '256px', paddingRight: '256px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-xl lg:text-2xl font-bold neon-text mb-5">
              <Star className="w-6 h-6 text-neon-blue" />
              DroneXPress
            </div>
            <p className="text-gray-400 leading-relaxed">
              O futuro das entregas já começou. Tecnologia drone a serviço da sua conveniência e do planeta.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Empresa</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#sobre" className="hover:text-neon-blue transition-colors">Sobre</a></li>
              <li><a href="#inovacao" className="hover:text-neon-blue transition-colors">Inovação</a></li>
              <li><a href="#publico" className="hover:text-neon-blue transition-colors">Público</a></li>
              <li><a href="#persona" className="hover:text-neon-blue transition-colors">Persona</a></li>
              <li><a href="#jornada" className="hover:text-neon-blue transition-colors">Jornada</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Serviços</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#como-funciona" className="hover:text-neon-blue transition-colors">Como funciona</a></li>
              <li><a href="#beneficios" className="hover:text-neon-blue transition-colors">Benefícios</a></li>
              <li><a href="#sustentabilidade" className="hover:text-neon-blue transition-colors">Sustentabilidade</a></li>
              <li><a href="#comparativo" className="hover:text-neon-blue transition-colors">Comparativo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Regiões</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Passo Fundo - RS</li>
              <li>Marau - RS</li>
              <li className="text-gray-600">(Em expansão)</li>
            </ul>
            <h4 className="text-white font-semibold text-lg mt-8 mb-5">Acesso</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/login" className="hover:text-neon-blue transition-colors">Área do cliente</Link></li>
              <li><Link to="/register" className="hover:text-neon-blue transition-colors">Cadastre-se</Link></li>
            </ul>
          </div>
        </div>
        <div className="section-divider mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 DroneXPress. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">Feito com <Star className="w-3.5 h-3.5 text-neon-blue" /> no Rio Grande do Sul</p>
        </div>
      </div>
    </footer>
  );
}
