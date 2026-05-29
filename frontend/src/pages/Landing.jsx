import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Leaf, Radio, Shield, DollarSign, Package, Microscope, Cpu, Target, Building2, Pill, UtensilsCrossed, Stethoscope, ShoppingBag, Search, ClipboardCheck, Rocket, Star, Check, CheckCircle } from 'lucide-react';
import DroneAnimation from '../components/DroneAnimation';
import DroneHero from '../components/illustrations/DroneHero';
import TechIllustration from '../components/illustrations/TechIllustration';
import SustainabilityIllustration from '../components/illustrations/SustainabilityIllustration';
import LogisticsIllustration from '../components/illustrations/LogisticsIllustration';
import Footer from '../components/Footer';

function Section({ id, children, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(entry.target); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`py-32 lg:py-48 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ paddingLeft: '256px', paddingRight: '256px' }}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 tracking-tight">
      {children}
    </h2>
  );
}

function SectionSubtitle({ children }) {
  return (
    <p className="text-gray-400 text-center mb-16 lg:mb-20 text-base lg:text-lg leading-relaxed">
      {children}
    </p>
  );
}

function BenefitCard({ icon: Icon, title, description }) {
  return (
    <div className="glass-card rounded-2xl p-8 hover:neon-glow transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-neon-blue" />
      </div>
      <h3 className="text-white font-semibold text-xl mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center relative group hover:neon-glow transition-all duration-300">
      <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="text-white font-semibold text-xl mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
      <button
        className="w-full px-8 py-5 flex items-center justify-between text-left text-white font-medium hover:bg-white/[0.02] transition-colors text-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="pr-4">{question}</span>
        <svg className={`w-5 h-5 text-neon-blue flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-8 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

function ComparisonBar({ label, drone, traditional, unit }) {
  const max = Math.max(drone, traditional);
  return (
    <div className="mb-6 last:mb-0">
      <p className="text-white text-base font-medium mb-3">{label}</p>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-neon-blue text-sm font-medium w-28 flex-shrink-0 text-right">DroneXPress</span>
          <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full gradient-bg transition-all duration-1000" style={{ width: `${(drone / max) * 100}%` }}></div>
          </div>
          <span className="text-neon-blue text-sm font-medium w-20 flex-shrink-0">{drone}{unit}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm w-28 flex-shrink-0 text-right">Tradicional</span>
          <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gray-600 transition-all duration-1000" style={{ width: `${(traditional / max) * 100}%` }}></div>
          </div>
          <span className="text-gray-500 text-sm w-20 flex-shrink-0">{traditional}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function JourneyCard({ step, title, description, icon: Icon }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center relative group hover:neon-glow transition-all duration-300">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-lg">
        {step}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mt-4 mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-neon-blue" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

        <section className="min-h-screen flex items-center justify-center relative" style={{ paddingLeft: '256px', paddingRight: '256px' }}>
          <div className="text-center max-w-5xl py-24">
            <div className="animate-fade-in mb-16 flex justify-center">
              <DroneHero className="w-full max-w-xl h-auto" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 animate-slide-up tracking-tight">
              <span className="gradient-text">DroneXPress</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 animate-slide-up delay-100 font-light tracking-wide">
              O futuro das entregas já começou.
            </p>
            <p className="text-gray-400 text-lg lg:text-xl mb-16 animate-slide-up delay-200 leading-relaxed">
              Entregas ultrarrápidas com drones autônomos. Tecnologia de ponta para levar
              o que você precisa, onde precisar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up delay-300">
              <Link
                to="/register"
                className="px-10 py-4 rounded-2xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow text-lg"
              >
                Solicitar Entrega
              </Link>
              <a
                href="#inovacao"
                className="px-10 py-4 rounded-2xl border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all duration-200 text-lg font-medium"
              >
                Inovação
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="sobre">
        <div className="grid md:grid-cols-2 gap-20 lg:gap-28 items-center">
          <div>
            <SectionTitle>Sobre a DroneXPress</SectionTitle>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              A DroneXPress nasceu em Passo Fundo, RS, com a missão de revolucionar as entregas
              na região. Utilizamos drones autônomos de última geração para realizar entregas
              rápidas, seguras e sustentáveis.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Nossa frota de drones Fênix e Águia são capazes de transportar cargas de até 100kg
              com velocidade máxima de 130km/h, cobrindo distâncias de até 50km.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Atendemos farmácias, restaurantes, hospitais e e-commerces em Passo Fundo e Marau,
              com planos de expansão para todo o Rio Grande do Sul.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-7 h-7 text-neon-blue" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-3">Nossa Missão</h3>
            <p className="text-gray-400 leading-relaxed text-lg max-w-md mx-auto">
              Tornar as entregas mais rápidas, acessíveis e sustentáveis através da tecnologia
              de drones autônomos.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="glass rounded-xl py-5 px-3">
                <div className="text-3xl font-bold gradient-text">+500</div>
                <div className="text-gray-500 text-sm mt-1">Entregas</div>
              </div>
              <div className="glass rounded-xl py-5 px-3">
                <div className="text-3xl font-bold gradient-text">6</div>
                <div className="text-gray-500 text-sm mt-1">Drones</div>
              </div>
              <div className="glass rounded-xl py-5 px-3">
                <div className="text-3xl font-bold gradient-text">2</div>
                <div className="text-gray-500 text-sm mt-1">Cidades</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="inovacao" className="bg-dark-card/50 relative">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-20 pointer-events-none">
          <TechIllustration className="w-full h-full" />
        </div>
        <SectionTitle>Inovação Tecnológica</SectionTitle>
        <SectionSubtitle>
          Drones autônomos com inteligência artificial simulada para entregas mais inteligentes, rápidas e seguras.
        </SectionSubtitle>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-16">
          <div className="glass-card rounded-3xl p-8 lg:p-10 hover:neon-glow transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6">
              <Cpu className="w-7 h-7 text-neon-blue" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-4">Drones Autônomos</h3>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Nossos drones utilizam sistemas avançados de navegação autônoma com sensores
              de obstáculos, GPS de alta precisão e inteligência artificial para calcular
              a melhor rota em tempo real.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                </div>
                <span>Navegação GPS + sensores LiDAR</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                </div>
                <span>IA encontra a melhor rota automaticamente</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                </div>
                <span>Pouso autônomo com precisão de 2cm</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full" />
                </div>
                <span>Evita obstáculos em tempo real</span>
              </li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-8 lg:p-10 hover:neon-glow transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Microscope className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-4">Logística Inteligente</h3>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Nosso sistema de logística usa algoritmos inteligentes para otimizar rotas,
              agrupar entregas e reduzir o tempo de espera. Tudo calculado automaticamente.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </div>
                <span>Roteirização inteligente</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </div>
                <span>Alocação automática de drones</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </div>
                <span>Priorização de entregas urgentes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </div>
                <span>Relatórios de eficiência</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 lg:p-10 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-6 h-6 text-neon-blue" />
          </div>
          <p className="text-neon-blue text-xl lg:text-2xl font-medium mb-3">
            IA encontrou a melhor rota para sua entrega
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Simulação de inteligência artificial aplicada à logística de entregas — tecnologia que aprende e otimiza cada percurso.
          </p>
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="como-funciona" className="relative">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-56 h-56 opacity-15 pointer-events-none">
          <LogisticsIllustration className="w-full h-full" />
        </div>
        <SectionTitle>Como Funciona</SectionTitle>
        <SectionSubtitle>
          Em apenas 3 passos simples, sua entrega está a caminho. Rápido, prático e sem complicação.
        </SectionSubtitle>
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          <StepCard
            number="1"
            title="Solicite"
            description="Informe origem, destino e peso da carga. Nosso sistema calcula distância, tempo e custo automaticamente com precisão."
          />
          <StepCard
            number="2"
            title="Prepare"
            description="Embale seus itens e aguarde o drone. Você recebe uma estimativa de chegada em tempo real com notificações."
          />
          <StepCard
            number="3"
            title="Receba"
            description="Acompanhe o voo pelo radar interativo e receba sua entrega diretamente no local indicado com segurança."
          />
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="comparativo" className="bg-dark-card/50">
        <SectionTitle>DroneXPress vs Entrega Tradicional</SectionTitle>
        <SectionSubtitle>
          Veja como a tecnologia transforma a logística de entregas em todos os aspectos.
        </SectionSubtitle>
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 lg:p-12">
          <ComparisonBar label="Tempo de Entrega (centro da cidade)" drone={12} traditional={45} unit=" min" />
          <ComparisonBar label="Custo por km rodado" drone={1.20} traditional={3.50} unit=" /km" />
          <ComparisonBar label="Emissão de CO₂ por entrega" drone={0} traditional={2.5} unit=" kg" />
          <ComparisonBar label="Capacidade de entregas por hora" drone={8} traditional={3} unit="" />
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="publico">
        <SectionTitle>Público-Alvo</SectionTitle>
        <SectionSubtitle>
          Soluções inteligentes para os setores que mais precisam de agilidade e eficiência nas entregas.
        </SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="glass-card rounded-2xl p-8 text-center hover:neon-glow transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <Pill className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">Farmácias</h3>
            <p className="text-gray-400 leading-relaxed">Entregas rápidas de medicamentos e produtos farmacêuticos com segurança e rastreamento completo.</p>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center hover:neon-glow transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <UtensilsCrossed className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">Restaurantes</h3>
            <p className="text-gray-400 leading-relaxed">Delivery ultrarrápido mantendo a temperatura e qualidade dos alimentos durante o trajeto.</p>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center hover:neon-glow transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">Hospitais</h3>
            <p className="text-gray-400 leading-relaxed">Transporte urgente de materiais médicos, exames e suprimentos hospitalares com prioridade.</p>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center hover:neon-glow transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">E-commerce</h3>
            <p className="text-gray-400 leading-relaxed">Entregas de produtos com agilidade que encanta clientes, fideliza vendas e reduz cancelamentos.</p>
          </div>
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="persona" className="bg-dark-card/50">
        <SectionTitle>Persona</SectionTitle>
        <SectionSubtitle>
          Conheça Lucas Andrade, o perfil do cliente que a DroneXPress foi criada para atender.
        </SectionSubtitle>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                LA
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">Lucas Andrade</h3>
                <p className="text-neon-blue text-base">Empresário Farmacêutico</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                </div>
                <span className="text-lg"><strong className="text-white">32 anos</strong>, empreendedor no setor farmacêutico</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                </div>
                <span className="text-lg">Precisa reduzir <strong className="text-white">atrasos nas entregas</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                </div>
                <span className="text-lg">Busca diminuir <strong className="text-white">custos operacionais</strong> do frete</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                </div>
                <span className="text-lg">Quer oferecer <strong className="text-white">entregas mais rápidas</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-neon-blue rounded-full" />
                </div>
                <span className="text-lg">Se preocupa com <strong className="text-white">sustentabilidade</strong></span>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <h3 className="text-white font-bold text-2xl mb-6">Desafios do Lucas</h3>
            <div className="space-y-5">
              <div className="glass rounded-2xl p-5">
                <p className="text-gray-400 leading-relaxed text-base">
                  "Meus clientes reclamam que as entregas demoram muito. Já perdi vendas
                  por causa da demora dos motoboys no trânsito."
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-gray-400 leading-relaxed text-base">
                  "O custo com entregas tradicionais está cada vez mais alto. Preciso de
                  uma alternativa mais econômica e eficiente."
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-gray-400 leading-relaxed text-base">
                  "Quero uma solução moderna que transmita confiança e inovação para
                  meus clientes."
                </p>
              </div>
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-neon-blue/10 border border-neon-blue/20">
              <div className="flex items-center gap-3 text-neon-blue text-base font-medium leading-relaxed">
                <CheckCircle className="w-5 h-5 text-neon-blue flex-shrink-0" />
                <span>DroneXPress resolve: entregas em minutos, custos reduzidos e rastreamento em tempo real</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="jornada">
        <SectionTitle>Jornada do Cliente</SectionTitle>
        <SectionSubtitle>
          Como a DroneXPress acompanha cada etapa da experiência do cliente, do primeiro contato à fidelização.
        </SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-neon-blue via-purple-500 to-neon-blue opacity-30"></div>
          <JourneyCard
            step="1"
            icon={Search}
            title="Descoberta"
            description="O cliente conhece a DroneXPress por indicação ou pesquisa. Descobre entregas por drone na sua região."
          />
          <JourneyCard
            step="2"
            icon={ClipboardCheck}
            title="Consideração"
            description="Analisa benefícios: velocidade, custo, sustentabilidade. Compara com entregas tradicionais."
          />
          <JourneyCard
            step="3"
            icon={Rocket}
            title="Decisão"
            description="Solicita uma entrega teste, experimenta a plataforma e confirma a primeira entrega com drone."
          />
          <JourneyCard
            step="4"
            icon={Star}
            title="Pós-Compra"
            description="Acompanha a entrega pelo mapa, recebe notificações e vira cliente recorrente."
          />
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="sustentabilidade" className="bg-dark-card/50 relative">
        <div className="absolute left-0 bottom-0 w-64 h-64 opacity-20 pointer-events-none">
          <SustainabilityIllustration className="w-full h-full" />
        </div>
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          <div>
            <SectionTitle>Sustentabilidade</SectionTitle>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Na DroneXPress, acreditamos que inovação e sustentabilidade andam juntas.
              Nossos drones são 100% elétricos, alimentados por energia renovável.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Cada entrega feita por drone evita a emissão de CO₂ comparada a veículos
              tradicionais. Nosso objetivo é neutralizar 100% das emissões até 2026.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg mb-8">
              Além disso, contribuímos para a redução do trânsito urbano, já que os drones
              voam por rotas aéreas, liberando as vias para outros veículos.
            </p>
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="glass-card rounded-2xl p-5 lg:p-6 text-center">
                <div className="text-3xl font-bold gradient-text">0</div>
                <div className="text-gray-500 text-sm mt-1">Emissão CO₂</div>
              </div>
              <div className="glass-card rounded-2xl p-5 lg:p-6 text-center">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-gray-500 text-sm mt-1">Energia Limpa</div>
              </div>
              <div className="glass-card rounded-2xl p-5 lg:p-6 text-center">
                <div className="text-3xl font-bold gradient-text">85%</div>
                <div className="text-gray-500 text-sm mt-1">Menos Poluição</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-6 text-center">Compromisso Verde</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-lg mb-1">Redução de Poluentes</p>
                  <p className="text-gray-400 leading-relaxed">Drones elétricos não emitem gases poluentes durante a operação</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-lg mb-1">Menos Trânsito</p>
                  <p className="text-gray-400 leading-relaxed">Entregas aéreas reduzem a quantidade de veículos nas ruas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-lg mb-1">Compensação de Carbono</p>
                  <p className="text-gray-400 leading-relaxed">Parcerias com projetos de reflorestamento na região Sul</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-lg mb-1">Energia Renovável</p>
                  <p className="text-gray-400 leading-relaxed">Baterias recarregadas com energia solar nas bases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="beneficios">
        <SectionTitle>Benefícios</SectionTitle>
        <SectionSubtitle>
          Por que escolher a DroneXPress para suas entregas? Motivos que fazem a diferença no seu dia a dia.
        </SectionSubtitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <BenefitCard
            icon={Zap}
            title="Velocidade"
            description="Entregas em minutos, não em horas. Nossos drones voam a até 130km/h, atravessando a cidade sem trânsito."
          />
          <BenefitCard
            icon={Leaf}
            title="Sustentável"
            description="Drones 100% elétricos. Zero emissão de carbono durante as entregas. Tecnologia limpa para um futuro melhor."
          />
          <BenefitCard
            icon={Radio}
            title="Rastreamento"
            description="Acompanhe sua entrega em tempo real pelo nosso sistema de rastreamento com mapa interativo e notificações."
          />
          <BenefitCard
            icon={Shield}
            title="Segurança"
            description="Sistema de navegação inteligente com sensores de obstáculos e GPS de alta precisão para entregas seguras."
          />
          <BenefitCard
            icon={DollarSign}
            title="Economia"
            description="Preços competitivos a partir de R$ 15,00. Sem taxa de urgência. Custo menor que entregas tradicionais."
          />
          <BenefitCard
            icon={Package}
            title="Capacidade"
            description="Cargas de até 100kg. Ideal para documentos, alimentos, medicamentos, eletrônicos e muito mais."
          />
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="parceiros" className="bg-dark-card/50">
        <SectionTitle>Parceiros</SectionTitle>
        <SectionSubtitle>
          Empresas que confiam na DroneXPress para suas entregas diárias.
        </SectionSubtitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-10">
          {['Farmácia Vita', 'Pizzaria Solar', 'Hospital São Lucas', 'Mercado Fácil', 'Auto Peças FM', 'Paper & Cia'].map((p) => (
            <div key={p} className="glass-card rounded-xl p-6 lg:p-8 text-center hover:neon-glow transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-5 h-5 text-neon-blue" />
              </div>
              <p className="text-white font-medium text-sm lg:text-base">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Section id="faq">
        <SectionTitle>FAQ</SectionTitle>
        <SectionSubtitle>
          Perguntas frequentes sobre a DroneXPress. Tire suas dúvidas e descubra como funciona.
        </SectionSubtitle>
        <div className="max-w-4xl mx-auto space-y-6">
          <FAQItem
            question="Como funciona o processo de entrega?"
            answer="Você solicita a entrega pelo nosso sistema informando origem, destino e peso. Um drone é designado automaticamente, coleta a carga no local de origem e entrega no destino. Você pode acompanhar todo o trajeto pelo nosso mapa interativo."
          />
          <FAQItem
            question="Quais cidades são atendidas?"
            answer="Atualmente atendemos Passo Fundo e Marau, no Rio Grande do Sul. Estamos em processo de expansão para Carazinho, Soledade e Erechim."
          />
          <FAQItem
            question="Qual o peso máximo que posso enviar?"
            answer="Nossos drones podem transportar cargas de até 100kg, dependendo do modelo. O drone Tufão-T1 é o mais potente da frota, com capacidade para 100kg."
          />
          <FAQItem
            question="Quanto tempo leva uma entrega?"
            answer="O tempo varia conforme a distância. Entregas dentro da mesma cidade podem levar de 10 a 30 minutos. Entre cidades vizinhas, até 60 minutos."
          />
          <FAQItem
            question="Quanto custa uma entrega?"
            answer="O valor base é R$ 15,00, acrescido de R$ 1,20 por km e R$ 2,50 por kg. Você pode simular o custo exato antes de solicitar."
          />
          <FAQItem
            question="Como faço para acompanhar minha entrega?"
            answer="Após solicitar a entrega, você pode acessar o painel do cliente e clicar na entrega desejada para ver o mapa com a rota e a posição do drone em tempo real."
          />
          <FAQItem
            question="Como a DroneXPress ajuda o meio ambiente?"
            answer="Nossos drones são 100% elétricos e não emitem CO₂. Cada entrega por drone evita a poluição de veículos tradicionais. Também compensamos carbono com projetos de reflorestamento na região Sul."
          />
        </div>
      </Section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <section className="py-32 lg:py-48" style={{ paddingLeft: '256px', paddingRight: '256px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-10 lg:p-16 max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-7 h-7 text-neon-blue" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Pronto para experimentar o futuro?
          </h2>
            <p className="text-gray-400 text-lg lg:text-xl mb-10 leading-relaxed">
              Junte-se à revolução das entregas inteligentes. Solicite sua primeira entrega
              com DroneXPress e descubra a velocidade do amanhã.
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-4 rounded-2xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow text-lg"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ margin: '0 256px' }}></div>

      <Footer />
    </div>
  );
}
