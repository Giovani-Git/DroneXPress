import { Target, Eye, Heart, Leaf, Rocket, Shield, TrendingUp, Award, Zap, Globe, Users, Cpu } from 'lucide-react';

const timeline = [
  { year: '2023', title: 'Fundacao', desc: 'A DroneXPress nasceu em Passo Fundo, RS, com a missao de revolucionar as entregas urbanas.' },
  { year: '2024', title: 'Primeiras Operacoes', desc: 'Realizamos as primeiras entregas experimentais entre Passo Fundo e Marau.' },
  { year: '2025', title: 'Expansao Regional', desc: 'Expandimos a operacao para 8 cidades no Rio Grande do Sul.' },
  { year: '2026', title: 'Frota Inteligente', desc: 'Implementamos o sistema DroneX AI e nos tornamos referencia em logistica sustentavel.' },
];

const values = [
  { icon: Zap, title: 'Inovacao', desc: 'Buscamos constantemente novas tecnologias para melhorar a experiencia de entrega.', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  { icon: Leaf, title: 'Sustentabilidade', desc: 'Compromisso com o meio ambiente atraves de operacoes 100% eletricas.', color: 'text-green-400', bg: 'bg-green-500/15' },
  { icon: Shield, title: 'Seguranca', desc: 'Protocolos rigorosos de seguranca em todas as etapas da operacao.', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { icon: Heart, title: 'Compromisso', desc: 'Dedicacao total a satisfacao dos nossos clientes e parceiros.', color: 'text-red-400', bg: 'bg-red-500/15' },
  { icon: Users, title: 'Pessoas', desc: 'Valorizamos nossos colaboradores e a comunidade onde estamos inseridos.', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { icon: Award, title: 'Excelencia', desc: 'Padrao de qualidade em cada entrega, do primeiro ao ultimo quilometro.', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
];

export default function Company() {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-16 pb-16">
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-neon-blue/20">
          <span className="text-3xl font-bold text-white">DX</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">DroneXPress</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Revolucionando a logistica com entregas inteligentes por drones</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="glass-card rounded-3xl p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-neon-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white">Nossa Missao</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Conectar pessoas e negocios atraves de entregas ultrarrápidas por drones, promovendo eficiencia logistica, 
            sustentabilidade e inovacao tecnologica. Transformamos a forma como produtos sao transportados, 
            tornando entregas mais rapidas, seguras e ecologicamente responsaveis.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Nossa Visao</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Ser a plataforma de entregas por drone mais confiavel e inovadora da America Latina, 
            liderando a transformacao digital da logistica urbana.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Nossos Valores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="glass-card rounded-2xl p-6 hover:neon-glow transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${v.color}`} />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 lg:p-10">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Nossa Historia</h2>
        <div className="space-y-6">
          {timeline.map((t) => (
            <div key={t.year} className="glass rounded-xl p-5">
              <span className="text-neon-blue font-bold text-sm">{t.year}</span>
              <h3 className="text-white text-lg font-bold mt-1">{t.title}</h3>
              <p className="text-gray-400 mt-1 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Diferenciais Competitivos</h2>
          </div>
          <ul className="space-y-4">
            {[
              'Entregas ate 80% mais rapidas que metodos tradicionais',
              'Rastreamento em tempo real com mapa interativo',
              'DroneX AI: inteligencia artificial para otimizacao de rotas',
              '100% eletrico e zero emissoes de carbono',
              'Cobertura em 8 cidades do Rio Grande do Sul',
              'Sistema de manutencao preditiva da frota',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <Rocket className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Impacto Ambiental</h2>
          </div>
          <p className="text-gray-400 leading-relaxed mb-6">
            Acreditamos que a tecnologia pode e deve caminhar junto com a sustentabilidade. 
            Nossos drones 100% eletricos substituem veiculos a combustao, reduzindo significativamente 
            a emissao de gases poluentes nas areas urbanas.
          </p>
          <ul className="space-y-4">
            {[
              'Zero emissoes diretas de CO2',
              'Reducao de poluicao sonora nas cidades',
              'Embalagens biodegradaveis e reciclaveis',
              'Otimizacao de rotas para menor consumo energetico',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <Leaf className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center glass-card rounded-3xl p-10">
        <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Objetivos para 2027</h2>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Expandir para 30 cidades no sul do Brasil, dobrar nossa frota para 50 drones, 
          atingir 100% de energia renovavel em nossas operacoes e processar mais de 10.000 entregas por mes.
        </p>
      </div>
    </div>
  );
}
