import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, Activity, AlertTriangle, MapPin, Navigation, Battery,
  TrendingUp, DollarSign, Leaf, Zap, Wind, CloudRain,
  CheckCircle, XCircle, Clock, ArrowRight, BarChart3,
  Target, Trophy, Download, FileText, Table,
  ChevronRight, AlertCircle, Info, Thermometer,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';
import { api } from '../api';

const PIE_COLORS = ['#00d4ff', '#7b61ff', '#ffd93d', '#ff6b6b', '#6bcb77', '#4d96ff', '#ff8c42', '#e040fb'];

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

const statusColors = {
  pedido_criado: 'bg-gray-500/20 text-gray-400',
  aguardando_aprovacao: 'bg-yellow-500/20 text-yellow-400',
  drone_selecionado: 'bg-blue-500/20 text-blue-400',
  preparando_coleta: 'bg-purple-500/20 text-purple-400',
  coleta_realizada: 'bg-cyan-500/20 text-cyan-400',
  em_rota: 'bg-indigo-500/20 text-indigo-400',
  proximo_ao_destino: 'bg-green-500/20 text-green-400',
  entregue: 'bg-emerald-500/20 text-emerald-400',
  cancelado: 'bg-red-500/20 text-red-400',
};

const droneStatusConfig = {
  disponivel: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Disponivel' },
  em_entrega: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Em Entrega' },
  carregando: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Carregando' },
  manutencao: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Manutencao' },
};

function AlertIcon({ type }) {
  if (type === 'critical') return <XCircle className="w-4 h-4 text-red-400" />;
  if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  return <Info className="w-4 h-4 text-blue-400" />;
}

function getBatteryColor(pct) {
  if (pct > 50) return 'from-cyan-400 to-emerald-400';
  if (pct > 20) return 'from-yellow-400 to-orange-400';
  return 'from-red-500 to-red-600';
}

function getBatteryTextColor(pct) {
  if (pct > 50) return 'text-emerald-400';
  if (pct > 20) return 'text-yellow-400';
  return 'text-red-400';
}

export default function OperationsCenter() {
  const [data, setData] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [sustainability, setSustainability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('center');
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');
  const [exportType, setExportType] = useState('deliveries');
  const mapRef = useRef(null);

  const tabs = [
    { id: 'center', label: 'Centro de Operacoes', icon: Activity },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'sustainability', label: 'Sustentabilidade', icon: Leaf },
    { id: 'reports', label: 'Exportar Relatorios', icon: FileText },
  ];

  useEffect(() => {
    Promise.all([
      api.getOperations().catch(() => null),
      api.getFinancial().catch(() => null),
      api.getRankings().catch(() => null),
      api.getSustainability().catch(() => null),
    ]).then(([ops, fin, rank, sus]) => {
      setData(ops);
      setFinancial(fin);
      setRankings(rank);
      setSustainability(sus);
    }).finally(() => setLoading(false));
  }, []);

  async function handleExport() {
    setExporting(true);
    setExportMsg('');
    try {
      const res = await api.exportData(exportType);
      const csv = [res.header.join(','), ...res.data.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dronexpress_${exportType}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg('Arquivo exportado com sucesso!');
    } catch {
      setExportMsg('Erro ao exportar');
    } finally {
      setExporting(false);
      setTimeout(() => setExportMsg(''), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando Centro de Operacoes...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center glass-card rounded-3xl p-10 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Erro ao conectar</p>
          <p className="text-gray-600 text-sm">Nao foi possivel carregar os dados operacionais. Verifique se o servidor esta rodando.</p>
        </div>
      </div>
    );
  }

  const { stats, drones, activeDeliveries, alerts } = data;

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Centro de Operacoes</h1>
            <p className="text-gray-400 text-sm mt-0.5">Monitoramento inteligente da frota DroneXPress</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                tab === t.id ? 'gradient-bg text-white shadow-lg shadow-neon-blue/20' : 'glass text-gray-400 hover:text-white'
              }`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 lg:gap-4">
            {[
              { label: 'Drones Ativos', value: stats.inTransit, icon: Cpu, color: 'text-blue-400' },
              { label: 'Disponiveis', value: stats.availableDrones, icon: CheckCircle, color: 'text-green-400' },
              { label: 'Em Manutencao', value: stats.inMaintenance, icon: AlertTriangle, color: 'text-red-400' },
              { label: 'Entregas Ativas', value: stats.activeDeliveries, icon: Navigation, color: 'text-cyan-400' },
              { label: 'Alertas', value: stats.alertsCount, icon: AlertCircle, color: 'text-yellow-400' },
              { label: 'Ocupacao Frota', value: `${stats.fleetUtilization}%`, icon: BarChart3, color: 'text-purple-400' },
              { label: 'Total Entregas', value: stats.totalDeliveries, icon: Target, color: 'text-white' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="glass-card rounded-2xl p-4 text-center hover:neon-glow transition-all duration-300">
                  <Icon className={`w-5 h-5 ${c.color} mx-auto mb-2`} />
                  <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">{c.label}</p>
                  <p className={`text-xl lg:text-2xl font-bold ${c.color}`}>{c.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-3xl p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-neon-blue" />
                  <h2 className="text-lg font-bold text-white">Mapa de Operacoes</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />Disponivel</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />Em Entrega</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Manutencao</span>
                </div>
              </div>
              <div className="relative glass rounded-2xl h-[400px] lg:h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card/50 to-dark-bg p-6 overflow-y-auto">
                  <div className="grid gap-3">
                    {drones.map((d) => {
                      const cfg = droneStatusConfig[d.status] || droneStatusConfig.disponivel;
                      return (
                        <div key={d.id}
                          onClick={() => setSelectedDrone(selectedDrone?.id === d.id ? null : d)}
                          className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-neon-blue/30 ${
                            selectedDrone?.id === d.id ? 'border-neon-blue ring-1 ring-neon-blue/50' : ''
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                                <Cpu className={`w-5 h-5 ${cfg.color}`} />
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">{d.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                  {d.position && (
                                    <span className="text-[11px] text-gray-500">{d.position.progress}% rota</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <Battery className="w-3 h-3 text-gray-500" />
                                  <span className={`text-xs font-medium ${getBatteryTextColor(d.battery)}`}>{d.battery}%</span>
                                </div>
                                <span className="text-xs text-gray-600">{d.speed} km/h</span>
                              </div>
                            </div>
                          </div>
                          {selectedDrone?.id === d.id && (
                            <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-3 text-xs">
                              <div className="glass rounded-lg p-2 text-center">
                                <p className="text-gray-500">Modelo</p>
                                <p className="text-white font-medium">{d.model}</p>
                              </div>
                              <div className="glass rounded-lg p-2 text-center">
                                <p className="text-gray-500">Carga Max</p>
                                <p className="text-white font-medium">{d.max_weight}kg</p>
                              </div>
                              <div className="glass rounded-lg p-2 text-center">
                                <p className="text-gray-500">Bateria</p>
                                <div className="flex items-center gap-1 justify-center mt-0.5">
                                  <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${getBatteryColor(d.battery)}`}
                                      style={{ width: `${d.battery}%` }} />
                                  </div>
                                  <span className={`text-white font-medium text-xs ${getBatteryTextColor(d.battery)}`}>{d.battery}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-neon-blue" />
                      Entregas Ativas ({activeDeliveries.length})
                    </h3>
                    {activeDeliveries.length === 0 ? (
                      <p className="text-gray-600 text-xs text-center py-6">Nenhuma entrega ativa no momento</p>
                    ) : (
                      <div className="space-y-2">
                        {activeDeliveries.map((d) => (
                          <Link key={d.id} to={`/deliveries/${d.id}`}
                            className="glass rounded-xl p-3 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                            <div className="min-w-0">
                              <p className="text-white text-xs font-medium truncate">{d.origin} &rarr; {d.destination}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[d.status] || ''}`}>
                                  {statusLabels[d.status] || d.status}
                                </span>
                                <span className="text-[10px] text-gray-600">{d.drone_name || '-'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                              <span>{d.progress}%</span>
                              <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-neon-blue transition-colors" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-bold text-white">DroneX AI</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue font-medium ml-auto">INTELIGENCIA</span>
                </div>
                {activeDeliveries.length > 0 ? (
                  <div className="space-y-3">
                    {activeDeliveries.slice(0, 3).map((d) => (
                      <div key={d.id} className="glass rounded-xl p-3">
                        <p className="text-white text-xs font-medium truncate mb-2">{d.origin} &rarr; {d.destination}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="glass rounded-lg p-2">
                            <p className="text-gray-500">Distancia</p>
                            <p className="text-white font-medium">{d.distance}km</p>
                          </div>
                          <div className="glass rounded-lg p-2">
                            <p className="text-gray-500">Tempo</p>
                            <p className="text-white font-medium">{d.estimated_time}min</p>
                          </div>
                          <div className="glass rounded-lg p-2">
                            <p className="text-gray-500">Custo</p>
                            <p className="text-green-400 font-medium">R${d.cost?.toFixed(2)}</p>
                          </div>
                          <div className="glass rounded-lg p-2">
                            <p className="text-gray-500">Consumo</p>
                            <p className="text-cyan-400 font-medium">{Math.round(d.distance * 0.12)}Wh</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-neon-blue mt-2 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Rota otimizada pela DroneX AI
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">Nenhuma rota ativa para analise</p>
                  </div>
                )}
              </div>

              <div className="glass-card rounded-3xl p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-bold text-white">Alertas</h2>
                  {alerts.length > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{alerts.length}</span>
                  )}
                </div>
                {alerts.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">Nenhum alerta no momento</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {alerts.map((a, i) => (
                      <div key={i} className={`glass rounded-xl p-3 flex items-start gap-3 ${
                        a.type === 'critical' ? 'border border-red-500/20' : a.type === 'warning' ? 'border border-yellow-500/20' : ''
                      }`}>
                        <AlertIcon type={a.type} />
                        <p className="text-gray-300 text-xs leading-relaxed">{a.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-3xl p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Battery className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">Baterias</h2>
                </div>
                <div className="space-y-2">
                  {drones.sort((a, b) => a.battery - b.battery).slice(0, 6).map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400 truncate">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${getBatteryColor(d.battery)}`}
                            style={{ width: `${d.battery}%` }} />
                        </div>
                        <span className={`font-medium w-8 text-right ${getBatteryTextColor(d.battery)}`}>{d.battery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'financial' && financial && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Receita (30 dias)', value: `R$ ${financial.thisMonthRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
              { label: 'Entregas (30 dias)', value: financial.thisMonthDeliveries, icon: Target, color: 'text-neon-blue' },
              { label: 'Receita Total', value: `R$ ${financial.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'Lucro Estimado', value: `R$ ${financial.estimatedProfit.toFixed(2)}`, icon: DollarSign, color: 'text-cyan-400' },
              { label: 'Projecao Anual', value: `R$ ${financial.projectedAnnual.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-400' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="glass-card rounded-2xl p-5 text-center hover:neon-glow transition-all">
                  <Icon className={`w-5 h-5 ${c.color} mx-auto mb-2`} />
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-white font-semibold mb-6">Receita Diaria (30 dias)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={financial.daily}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111128', border: '1px solid #00d4ff30', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#00d4ff" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-white font-semibold mb-6">Receita Mensal</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={financial.monthly} barCategoryGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111128', border: '1px solid #00d4ff30', borderRadius: '12px' }} />
                  <Bar dataKey="revenue" fill="#7b61ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-4">Resumo Financeiro</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Receita Total', value: financial.totalRevenue, color: 'text-green-400' },
                { label: 'Custo Operacional', value: financial.totalCost, color: 'text-red-400' },
                { label: 'Lucro Líquido', value: financial.estimatedProfit, color: 'text-cyan-400' },
                { label: 'Margem', value: `${financial.totalRevenue > 0 ? Math.round((financial.estimatedProfit / financial.totalRevenue) * 100) : 0}%`, color: 'text-purple-400' },
              ].map((c) => (
                <div key={c.label} className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className={`text-2xl font-bold ${c.color}`}>R$ {typeof c.value === 'number' ? c.value.toFixed(2) : c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'rankings' && rankings && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Drones Mais Utilizados</h3>
            </div>
            {rankings.topDrones.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">Nenhum dado disponivel</p>
            ) : (
              <div className="space-y-3">
                {rankings.topDrones.map((d, i) => (
                  <div key={d.name} className="glass rounded-xl p-3 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-amber-600/20 text-amber-500' : 'bg-white/5 text-gray-500'
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{d.name}</p>
                    </div>
                    <span className="text-neon-blue font-bold">{d.count} entregas</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-neon-blue" />
              <h3 className="text-lg font-bold text-white">Cidades com Mais Entregas</h3>
            </div>
            {rankings.topCities.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">Nenhum dado disponivel</p>
            ) : (
              <div className="space-y-3">
                {rankings.topCities.map((c, i) => (
                  <div key={c.city} className="glass rounded-xl p-3 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-amber-600/20 text-amber-500' : 'bg-white/5 text-gray-500'
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium capitalize">{c.city}</p>
                    </div>
                    <span className="text-neon-blue font-bold">{c.count} entregas</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Usuarios com Mais Pedidos</h3>
            </div>
            {rankings.topUsers.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">Nenhum dado disponivel</p>
            ) : (
              <div className="space-y-3">
                {rankings.topUsers.map((u, i) => (
                  <div key={u.name} className="glass rounded-xl p-3 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-amber-600/20 text-amber-500' : 'bg-white/5 text-gray-500'
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{u.name}</p>
                    </div>
                    <span className="text-neon-blue font-bold">{u.count} pedidos</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Desempenho da Frota</h3>
            </div>
            {rankings.dronePerformance.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">Nenhum dado disponivel</p>
            ) : (
              <div className="space-y-3">
                {rankings.dronePerformance.map((d, i) => (
                  <div key={d.name} className="glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-sm font-medium">{d.name}</p>
                        <p className="text-gray-500 text-xs">{d.model} &middot; {d.completed} entregas</p>
                      </div>
                      <span className={`text-xs font-medium ${d.successRate > 80 ? 'text-green-400' : d.successRate > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {d.successRate}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.successRate > 80 ? 'bg-green-400' : d.successRate > 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${d.successRate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'sustainability' && sustainability && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Impacto Ambiental Positivo</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              A DroneXPress esta comprometida com um futuro mais sustentavel. Veja o impacto ambiental gerado pelas nossas entregas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'CO2 Economizado', value: `${sustainability.co2EconomizadoKg} kg`, icon: CloudRain, color: 'text-emerald-400', desc: 'Comparado a veiculos tradicionais' },
              { label: 'Combustivel Economizado', value: `${sustainability.combustivelEconomizadoL} L`, icon: Wind, color: 'text-cyan-400', desc: 'Deixamos de queimar' },
              { label: 'Arvores Equivalentes', value: `${sustainability.arvoresEquivalentes}`, icon: Leaf, color: 'text-green-400', desc: 'Preservadas por ano' },
              { label: 'Distancia Total', value: `${sustainability.totalDistanceKm} km`, icon: Navigation, color: 'text-neon-blue', desc: 'Percorridos por drones' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="glass-card rounded-2xl p-6 text-center hover:neon-glow transition-all">
                  <Icon className={`w-8 h-8 ${c.color} mx-auto mb-3`} />
                  <p className="text-2xl font-bold text-white mb-1">{c.value}</p>
                  <p className="text-gray-400 text-sm mb-1">{c.label}</p>
                  <p className="text-gray-600 text-xs">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Nosso Compromisso</h3>
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="glass rounded-xl p-5">
                <Leaf className="w-6 h-6 text-green-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">Energia Limpa</h4>
                <p className="text-gray-400 leading-relaxed">Todos os nossos drones sao 100% eletricos, com zero emissoes durante a operacao.</p>
              </div>
              <div className="glass rounded-xl p-5">
                <Target className="w-6 h-6 text-neon-blue mb-3" />
                <h4 className="text-white font-semibold mb-2">Rotas Inteligentes</h4>
                <p className="text-gray-400 leading-relaxed">Nosso sistema DroneX AI otimiza rotas para minimizar o consumo de energia.</p>
              </div>
              <div className="glass rounded-xl p-5">
                <RecycleIcon className="w-6 h-6 text-cyan-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">Embalagens Sustentaveis</h4>
                <p className="text-gray-400 leading-relaxed">Utilizamos embalagens biodegradaveis e reciclaveis em todas as entregas.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="glass-card rounded-3xl p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Exportar Relatorios</h3>
              <p className="text-gray-400 text-sm">Exporte dados em formato CSV</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-gray-300 text-sm font-medium block mb-2">Tipo de relatorio</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'deliveries', label: 'Entregas', icon: Navigation },
                { type: 'drones', label: 'Drones', icon: Cpu },
                { type: 'users', label: 'Usuarios', icon: Table },
                { type: 'financial', label: 'Financeiro', icon: DollarSign },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.type} onClick={() => setExportType(opt.type)}
                    className={`glass rounded-xl p-4 text-left transition-all ${
                      exportType === opt.type ? 'border-neon-blue ring-1 ring-neon-blue/50' : ''
                    }`}>
                    <Icon className={`w-5 h-5 mb-2 ${exportType === opt.type ? 'text-neon-blue' : 'text-gray-500'}`} />
                    <p className="text-white text-sm font-medium">{opt.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {exportMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              exportMsg.includes('sucesso') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}>
              {exportMsg.includes('sucesso') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {exportMsg}
            </div>
          )}

          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50">
            {exporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>
      )}
    </div>
  );
}

function RecycleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="M14 16l-3 3 3 3" />
      <path d="M8.293 13.596L7.196 9.5 3.1 10.598" />
      <path d="M9.344 5.811l1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="M13.378 9.633L9.344 5.811l-3.822 4.034" />
    </svg>
  );
}
