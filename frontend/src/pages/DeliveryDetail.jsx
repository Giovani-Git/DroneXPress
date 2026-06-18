import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Navigation, Package, Truck, Clock, DollarSign, Cpu, Calendar, ChevronLeft, AlertTriangle, X, Send, XCircle } from 'lucide-react';
import { api } from '../api';
import TrackingMap from '../components/TrackingMap';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export default function DeliveryDetail() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState('problema');
  const [reportDesc, setReportDesc] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [simProgress, setSimProgress] = useState(0);
  const [localStatus, setLocalStatus] = useState(null);
  const milestonesRef = useRef({});
  const pendingTimerRef = useRef(null);

  function getBaseProgress(status, isPf) {
    if (isPf) {
      return { pedido_criado: 0, aguardando_aprovacao: 0, drone_selecionado: 0,
        preparando_coleta: 0, coleta_realizada: 5, em_rota: 30,
        proximo_ao_destino: 60, entregue: 100, cancelado: 0 }[status] || 0;
    }
    return { pedido_criado: 0, aguardando_aprovacao: 0, drone_selecionado: 10,
      preparando_coleta: 15, coleta_realizada: 20, em_rota: 45,
      proximo_ao_destino: 70, entregue: 100, cancelado: 0 }[status] || 0;
  }

  useEffect(() => {
    api.getDelivery(id).then((d) => {
      setDelivery(d);
      setLocalStatus(d.status);
      milestonesRef.current = {};

      const originCity = d.originAddress?.cidade || d.origin;
      const pf = originCity?.toLowerCase() === 'passo fundo';
      const baseProgress = getBaseProgress(d.status, pf);
      setSimProgress(baseProgress);

      if ((d.status === 'pedido_criado' || d.status === 'aguardando_aprovacao') && d.drone_id) {
        pendingTimerRef.current = setTimeout(async () => {
          try {
            await api.updateDeliveryStatus(d.id, 'drone_selecionado');
            setLocalStatus('drone_selecionado');
            const bp = getBaseProgress('drone_selecionado', pf);
            setSimProgress(bp);
            const sk = `drone_sim_${d.id}_start`;
            const offset = (bp / 0.35) * 1000;
            localStorage.setItem(sk, Date.now() - offset);
          } catch (err) {
            console.error('Erro ao iniciar entrega:', err);
          }
        }, 15000);
      }

      const startKey = `drone_sim_${d.id}_start`;
      if (['drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino'].includes(d.status)) {
        const offset = (baseProgress / 0.35) * 1000;
        localStorage.setItem(startKey, Date.now() - offset);
      } else {
        localStorage.removeItem(startKey);
      }
    }).catch((err) => console.error('Erro ao carregar entrega:', err)).finally(() => setLoading(false));

    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (!delivery || ['pedido_criado', 'aguardando_aprovacao', 'entregue', 'cancelado'].includes(localStatus)) return;

    const activeStatuses = ['drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino'];
    if (Object.keys(milestonesRef.current).length === 0 && activeStatuses.includes(localStatus)) {
      const statusIdx = ['pedido_criado', 'drone_selecionado', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue'];
      const idx = statusIdx.indexOf(localStatus);
      if (idx >= 1) milestonesRef.current.selecionado = true;
      if (idx >= 2) milestonesRef.current.coletado = true;
      if (idx >= 3) milestonesRef.current.transito = true;
      if (idx >= 4) milestonesRef.current.proximo = true;
    }

    const SPEED = 0.35;
    const startKey = `drone_sim_${delivery.id}_start`;
    let startTime = localStorage.getItem(startKey);
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(startKey, startTime);
    }
    startTime = parseFloat(startTime);

    let animId;

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min(elapsed * SPEED, 100);
      setSimProgress(pct);

      const originCity = delivery.originAddress?.cidade || delivery.origin;
      const pf = originCity?.toLowerCase() === 'passo fundo';
      const tColeta = pf ? 5 : 20;
      const tRota = pf ? 30 : 45;
      const tProximo = pf ? 60 : 70;

      if (pct >= tColeta && !milestonesRef.current.coletado) {
        milestonesRef.current.coletado = true;
        setLocalStatus('coleta_realizada');
        addNotification({ icon: 'coletado', title: 'Coleta realizada!', message: 'O drone pegou seu pacote e esta a caminho do destino.' });
        api.updateDeliveryStatus(delivery.id, 'coleta_realizada').catch((err) => console.error('Erro ao atualizar status coleta_realizada:', err));
      }

      if (pct >= tRota && !milestonesRef.current.transito) {
        milestonesRef.current.transito = true;
        setLocalStatus('em_rota');
        api.updateDeliveryStatus(delivery.id, 'em_rota').catch((err) => console.error('Erro ao atualizar status em_rota:', err));
      }

      if (pct >= tProximo && !milestonesRef.current.proximo) {
        milestonesRef.current.proximo = true;
        setLocalStatus('proximo_ao_destino');
        api.updateDeliveryStatus(delivery.id, 'proximo_ao_destino').catch((err) => console.error('Erro ao atualizar status proximo_ao_destino:', err));
      }

      if (pct >= 100 && !milestonesRef.current.entregue) {
        milestonesRef.current.entregue = true;
        setLocalStatus('entregue');
        addNotification({ icon: 'entregue', title: 'Entrega concluida!', message: 'Seu pacote foi entregue com sucesso.' });
        api.updateDeliveryStatus(delivery.id, 'entregue').catch((err) => console.error('Erro ao atualizar status entregue:', err));
        localStorage.removeItem(startKey);
        return;
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [delivery?.id, localStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Entrega nao encontrada</p>
          <Link to="/deliveries" className="text-neon-blue hover:underline font-medium inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Voltar para entregas
          </Link>
        </div>
      </div>
    );
  }

  const statusLabels = {
    pedido_criado: 'Pedido Criado',
    aguardando_aprovacao: 'Aguardando Aprovacao',
    drone_selecionado: 'Drone Selecionado',
    preparando_coleta: 'Preparando Coleta',
    coleta_realizada: 'Coleta Realizada',
    em_rota: 'Em Rota',
    proximo_ao_destino: 'Proximo ao Destino',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };

  const statusSteps = ['pedido_criado', 'drone_selecionado', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue'];

  const stepPct = 100 / statusSteps.length;
  const statusColor = localStatus === 'entregue' ? 'bg-green-500/20 text-green-400'
    : localStatus === 'cancelado' ? 'bg-red-500/20 text-red-400'
    : 'bg-blue-500/20 text-blue-400';
  const canCancel = localStatus && !['entregue', 'cancelado', 'pedido_criado'].includes(localStatus);
  const cancelFee = canCancel ? Math.round((5 + (simProgress / 100) * delivery.cost * 0.4) * 100) / 100 : 0;

  const originCity = delivery.originAddress?.cidade || delivery.origin;
  const destCity = delivery.destAddress?.cidade || delivery.destination;
  const isPfOrigin = originCity?.toLowerCase() === 'passo fundo';
  const routeLabel = isPfOrigin
    ? `Passo Fundo → ${destCity}`
    : `Passo Fundo → ${originCity} (coleta) → ${destCity}`;

  const infoFields = [
    { label: 'Rota', value: routeLabel, icon: Navigation, color: 'text-neon-blue' },
    { label: 'Origem', value: delivery.origin, icon: MapPin, color: 'text-neon-blue' },
    { label: 'Destino', value: delivery.destination, icon: Navigation, color: 'text-purple-400' },
    { label: 'Descricao', value: delivery.description || '—', icon: Package, color: 'text-cyan-400' },
    { label: 'Empresa', value: delivery.company ? `${delivery.company}${delivery.company_cnpj ? ` (${delivery.company_cnpj})` : ''}` : '—', icon: Truck, color: 'text-amber-400' },
    { label: 'Distancia', value: `${delivery.distance} km`, icon: MapPin, color: 'text-neon-blue' },
    { label: 'Peso', value: `${delivery.weight} kg`, icon: Package, color: 'text-green-400' },
    { label: 'Tempo Estimado', value: `${delivery.estimated_time} min`, icon: Clock, color: 'text-neon-blue' },
    { label: 'Custo', value: `R$ ${delivery.cost?.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Drone', value: delivery.drone_name || 'Aguardando', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Data', value: new Date(delivery.created_at).toLocaleDateString('pt-BR'), icon: Calendar, color: 'text-gray-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
        <Link to="/deliveries" className="text-neon-blue hover:underline font-medium mb-8 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Voltar para entregas
        </Link>

        <div className="glass-card rounded-3xl p-6 lg:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Detalhes da Entrega</h1>
                <p className="text-gray-400 text-sm mt-1">{delivery.origin} &rarr; {delivery.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {canCancel && (
                <button onClick={() => { setShowCancel(true); setCancelError(''); }}
                  className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all flex items-center gap-2">
                  Cancelar Entrega
                </button>
              )}
              {user?.role !== 'admin' && (
                <button onClick={() => { setShowReport(true); setReportError(''); setReportSent(false); setReportDesc(''); }}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-all flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Reportar Problema
                </button>
              )}
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusColor} whitespace-nowrap`}>
                {statusLabels[localStatus] || localStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {infoFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="glass rounded-2xl p-4 lg:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${field.color}`} />
                    <p className="text-gray-400 text-xs">{field.label}</p>
                  </div>
                  <p className="text-white font-medium">{field.value}</p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">Progresso da entrega</p>
              <span className="text-neon-blue font-bold text-sm">{Math.round(simProgress)}%</span>
            </div>
            <div className="flex items-center gap-1">
              {statusSteps.map((step, i) => {
                const dotFilled = i <= Math.floor(simProgress / stepPct);
                const linePct = i < Math.floor(simProgress / stepPct) ? 100
                  : i === Math.floor(simProgress / stepPct)
                    ? Math.min(Math.max(((simProgress - (Math.floor(simProgress / stepPct) * stepPct)) / stepPct) * 100, 0), 100)
                    : 0;
                const isCurrent = i === Math.floor(simProgress / stepPct);
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-all duration-700 ${
                      dotFilled
                        ? 'bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.6)]'
                        : isCurrent
                          ? 'bg-neon-blue/50 shadow-[0_0_8px_rgba(0,212,255,0.3)]'
                          : 'bg-gray-600'
                    }`} />
                    {i < statusSteps.length - 1 && (
                      <div className="flex-1 h-0.5 bg-gray-600 overflow-hidden rounded-full">
                        <div className="h-full bg-neon-blue transition-all duration-700 ease-out rounded-full"
                          style={{ width: `${linePct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {statusSteps.map((step) => (
                <span key={step} className={`text-[9px] sm:text-[10px] lg:text-[11px] leading-tight transition-colors duration-500 text-center ${
                  statusSteps.indexOf(step) <= Math.floor(simProgress / stepPct)
                    ? 'text-neon-blue' : 'text-gray-500'
                }`}>
                  {statusLabels[step] || step}
                </span>
              ))}
            </div>
          </div>
        </div>

        <TrackingMap
          base="Passo Fundo"
          origin={originCity}
          destination={destCity}
          progress={localStatus === 'pedido_criado' || localStatus === 'aguardando_aprovacao' ? 0 : simProgress}
        />

      {showCancel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => { if (!cancelling) setShowCancel(false); }}>
          <div className="glass-card rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Cancelar Entrega</h2>
                <p className="text-gray-400 text-sm mt-1">Esta acao nao pode ser desfeita</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 mb-6 space-y-3 text-sm">
              <p className="text-gray-300 leading-relaxed">
                O drone ja percorreu <strong className="text-white">{Math.round(simProgress)}%</strong> do trajeto total.
                Sera cobrada uma taxa de cancelamento proporcional a distancia percorrida.
              </p>
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Taxa base</span>
                  <span className="text-white">R$ 5,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Distancia percorrida ({Math.round(simProgress)}%)</span>
                  <span className="text-white">R$ {(cancelFee - 5).toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-base">
                  <span className="text-gray-200 font-medium">Total</span>
                  <span className="text-red-400 font-bold text-lg">R$ {cancelFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {cancelError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <X className="w-4 h-4 flex-shrink-0" /> {cancelError}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} disabled={cancelling}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 transition-all disabled:opacity-50">
                Manter Entrega
              </button>
              <button onClick={async () => {
                setCancelling(true);
                try {
                  const d = await api.updateDeliveryStatus(delivery.id, 'cancelado', simProgress);
                  setDelivery(d);
                  setLocalStatus('cancelado');
                  setSimProgress(0);
                  localStorage.removeItem(`drone_sim_${delivery.id}_start`);
                  milestonesRef.current = {};
                  addNotification({ icon: 'cancelado', title: 'Entrega cancelada', message: `Sua entrega foi cancelada. Taxa de cancelamento: R$ ${cancelFee.toFixed(2)}.` });
                  setShowCancel(false);
                } catch (err) {
                  setCancelError(err.message || 'Erro ao cancelar entrega');
                } finally {
                  setCancelling(false);
                }
              }} disabled={cancelling}
                className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {cancelling ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                Confirmar Cancelamento
              </button>
            </div>
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
                  Esta entrega apresenta algum problema? Informe abaixo para nossa equipe analisar.
                </p>

                <div className="mb-5">
                  <label className="text-gray-300 text-sm font-medium block mb-2">Tipo de problema</label>
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-blue transition-all text-sm"
                    style={{ colorScheme: 'dark' }}>
                    <option value="problema" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Problema na entrega</option>
                    <option value="atraso" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Atraso na entrega</option>
                    <option value="cancelar" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Quero cancelar</option>
                    <option value="extraviado" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Pacote extraviado</option>
                    <option value="danificado" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Pacote danificado</option>
                    <option value="outro" className="bg-dark-surface text-white" style={{ background: '#1a1a3e', color: '#fff' }}>Outro</option>
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
                  <button onClick={async () => {
                    if (!reportDesc.trim()) return;
                    setSendingReport(true);
                    setReportError('');
                    try {
                      await api.createReport({
                        delivery_id: delivery.id,
                        type: reportType,
                        description: reportDesc,
                      });
                      setReportSent(true);
                    } catch (err) {
                      setReportError(err.message || 'Erro ao enviar reporte');
                    } finally {
                      setSendingReport(false);
                    }
                  }} disabled={sendingReport || !reportDesc.trim()}
                    className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                    {sendingReport ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar Reporte
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
