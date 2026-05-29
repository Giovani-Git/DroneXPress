import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown, LifeBuoy, FileText, AlertTriangle, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
      <button onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left text-white font-medium hover:bg-white/[0.02] transition-colors text-base gap-4">
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-neon-blue flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4 text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}

const faqs = [
  {
    q: 'Como funciona o processo de entrega?',
    a: 'Solicite a entrega informando origem, destino e peso. Nosso sistema calcula distancia, tempo e custo. Um drone e designado automaticamente para realizar a coleta e entrega. Voce acompanha tudo pelo mapa interativo.',
  },
  {
    q: 'Quanto tempo leva uma entrega?',
    a: 'Entregas dentro da mesma cidade levam de 10 a 30 minutos. Entre cidades vizinhas, ate 60 minutos. O tempo exato e exibido na simulacao antes de confirmar.',
  },
  {
    q: 'Quanto custa uma entrega?',
    a: 'O valor base e R$ 15,00, acrescido de R$ 1,20 por km e R$ 2,50 por kg. Drones mais rapidos podem ter custo maior. Voce ve o valor exato na simulacao.',
  },
  {
    q: 'Qual o peso maximo que posso enviar?',
    a: 'Nossos drones transportam ate 100kg. O drone Tufao-T1 e o mais potente, com capacidade para 100kg. O sistema sugere automaticamente o drone ideal para sua carga.',
  },
  {
    q: 'Como rastrear minha entrega?',
    a: 'Acesse o menu Entregas, clique na entrega desejada e veja o mapa com a rota e a posicao do drone em tempo real, alem do progresso atualizado.',
  },
  {
    q: 'Quais cidades sao atendidas?',
    a: 'Atualmente Passo Fundo e Marau, no Rio Grande do Sul. Estamos em expansao para Carazinho, Soledade e Erechim.',
  },
  {
    q: 'O que fazer se minha entrega atrasar?',
    a: 'Va em Entregas, clique na entrega e use o botao "Reportar Problema". Selecione "Atraso na entrega" e descreva a situacao. Nossa equipe analisara o caso.',
  },
  {
    q: 'Como cancelar uma entrega?',
    a: 'Acesse os detalhes da entrega, clique em "Reportar Problema" e selecione "Quero cancelar". Analisaremos sua solicitacao.',
  },
];

const contactChannels = [
  { icon: MessageCircle, label: 'Chat Online', desc: 'Seg a Sex, 8h as 18h', action: 'Iniciar Chat', color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  { icon: Phone, label: 'Telefone', desc: '(54) 3000-0000', action: 'Ligar', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Mail, label: 'Email', desc: 'suporte@dronexpress.com', action: 'Enviar Email', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: LifeBuoy, label: 'Central de Ajuda', desc: 'Base de conhecimento', action: 'Acessar', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

export default function Support() {
  const { user } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState('problema');
  const [reportDesc, setReportDesc] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState('');

  async function handleSendReport() {
    if (!reportDesc.trim()) return;
    setSendingReport(true);
    setReportError('');
    try {
      await api.createReport({
        type: reportType,
        description: reportDesc,
      });
      setReportSent(true);
    } catch (err) {
      setReportError(err.message || 'Erro ao enviar reporte');
    } finally {
      setSendingReport(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-5">
          <HelpCircle className="w-8 h-8 text-neon-blue" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Ajuda & Suporte</h1>
        <p className="text-gray-400 text-lg mt-2">Como podemos ajudar?</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-14">
        {contactChannels.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.label} className="glass-card rounded-2xl p-5 lg:p-6 text-center hover:neon-glow transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl ${ch.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${ch.color}`} />
              </div>
              <h3 className="text-white font-semibold text-base mb-1">{ch.label}</h3>
              <p className="text-gray-500 text-xs mb-4">{ch.desc}</p>
              <span className={`text-xs font-medium ${ch.color} group-hover:underline cursor-pointer`}>{ch.action} &rarr;</span>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-neon-blue" /> Perguntas Frequentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {user && (
        <div className="glass-card rounded-3xl p-8 lg:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Problema com uma entrega?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Reporte diretamente aqui. Nossa equipe analisara e respondera em ate 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { setShowReport(true); setReportError(''); setReportSent(false); setReportDesc(''); }}
              className="px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all text-base">
              Reportar Problema
            </button>
            <Link to="/deliveries"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-all text-base font-medium">
              Ver Entregas
            </Link>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => { if (!sendingReport) setShowReport(false); }}>
          <div className="glass-card rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Reportar Problema</h2>
              </div>
              <button onClick={() => { setShowReport(false); setReportError(''); }} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Reporte enviado!</h3>
                <p className="text-gray-400 text-sm">Nossa equipe analisara o caso e respondera em ate 24h.</p>
                <button onClick={() => { setShowReport(false); setReportSent(false); setReportDesc(''); }}
                  className="mt-6 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all">
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Descreva o problema que esta enfrentando
                </p>

                <div className="mb-5">
                  <label className="text-gray-300 text-sm font-medium block mb-2">Tipo de problema</label>
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                    style={{ colorScheme: 'dark' }}>
                    <option value="problema" style={{ background: '#1a1a3e', color: '#fff' }}>Problema na entrega</option>
                    <option value="atraso" style={{ background: '#1a1a3e', color: '#fff' }}>Atraso na entrega</option>
                    <option value="cancelar" style={{ background: '#1a1a3e', color: '#fff' }}>Quero cancelar</option>
                    <option value="extraviado" style={{ background: '#1a1a3e', color: '#fff' }}>Pacote extraviado</option>
                    <option value="danificado" style={{ background: '#1a1a3e', color: '#fff' }}>Pacote danificado</option>
                    <option value="outro" style={{ background: '#1a1a3e', color: '#fff' }}>Outro</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-gray-300 text-sm font-medium block mb-2">Descricao</label>
                  <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all text-sm min-h-[120px] resize-none"
                    placeholder="Descreva o problema em detalhes..." />
                </div>

                {reportError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                    <X className="w-4 h-4 flex-shrink-0" /> {reportError}
                  </div>
                )}
                <div className="flex gap-3 justify-end">
                  <button onClick={() => { setShowReport(false); setReportError(''); }} disabled={sendingReport}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 transition-all disabled:opacity-50">
                    Cancelar
                  </button>
                  <button onClick={handleSendReport} disabled={sendingReport || !reportDesc.trim()}
                    className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                    {sendingReport ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}