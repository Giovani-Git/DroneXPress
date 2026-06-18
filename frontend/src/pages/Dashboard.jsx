import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Plus, ArrowRight, Cpu, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DashboardBanner from '../components/illustrations/DashboardBanner';
import WeatherWidget from '../components/WeatherWidget';

const PIE_COLORS = ['#00d4ff', '#7b61ff', '#ffd93d', '#ff6b6b', '#6bcb77', '#4d96ff'];

const statusLabels = {
  pedido_criado: 'Pedido Criado', aguardando_aprovacao: 'Aguardando Aprovacao',
  drone_selecionado: 'Drone Selecionado', preparando_coleta: 'Preparando Coleta',
  coleta_realizada: 'Coleta Realizada', em_rota: 'Em Rota',
  proximo_ao_destino: 'Proximo ao Destino', entregue: 'Entregue', cancelado: 'Cancelado',
};

const statusColors = {
  pedido_criado: 'bg-gray-500/20 text-gray-400', aguardando_aprovacao: 'bg-yellow-500/20 text-yellow-400',
  drone_selecionado: 'bg-blue-500/20 text-blue-400', preparando_coleta: 'bg-purple-500/20 text-purple-400',
  coleta_realizada: 'bg-cyan-500/20 text-cyan-400', em_rota: 'bg-indigo-500/20 text-indigo-400',
  proximo_ao_destino: 'bg-green-500/20 text-green-400', entregue: 'bg-emerald-500/20 text-emerald-400',
  cancelado: 'bg-red-500/20 text-red-400',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0, avgCost: 0 });
  const [recent, setRecent] = useState([]);
  const [drones, setDrones] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDeliveries().catch(() => []),
      api.getDrones().catch(() => []),
    ]).then(([deliveries, droneList]) => {
      const total = deliveries.length;
      const active = deliveries.filter((d) => d.status !== 'entregue' && d.status !== 'cancelado').length;
      const delivered = deliveries.filter((d) => d.status === 'entregue').length;
      const totalCost = deliveries.reduce((sum, d) => sum + (d.cost || 0), 0);
      const avgCost = total > 0 ? totalCost / total : 0;
      setStats({ total, active, delivered, avgCost });
      setRecent(deliveries.slice(0, 5));

      const statusCounts = {};
      deliveries.forEach((d) => {
        statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
      });
      setChartData(Object.entries(statusCounts).map(([k, v]) => ({ status: k, count: v })));
      setDrones(droneList || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total de Entregas', value: stats.total, icon: Package, color: 'text-neon-blue' },
    { label: 'Em Andamento', value: stats.active, icon: Clock, color: 'text-yellow-400' },
    { label: 'Entregues', value: stats.delivered, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Custo Medio', value: `R$ ${stats.avgCost.toFixed(2)}`, icon: DollarSign, color: 'text-purple-400' },
  ];

  const availableDrones = drones.filter((d) => d.status === 'disponivel').length;
  const inUseDrones = drones.filter((d) => d.status !== 'disponivel').length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Bem-vindo, {user?.name}</p>
        </div>
        <Link
          to="/deliveries/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow text-sm"
        >
          <Plus className="w-4 h-4" /> Nova Entrega
        </Link>
      </div>

      <div className="mb-8 rounded-2xl overflow-hidden">
        <DashboardBanner className="w-full h-auto" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card rounded-2xl p-5 lg:p-6 relative group hover:neon-glow transition-all duration-300">
              <div className="absolute top-3 right-3 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Icon className="w-20 h-20 text-white" />
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        <WeatherWidget />

        <div className="lg:col-span-2 glass-card rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Status das Entregas</h2>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barCategoryGap={12} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="status" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => statusLabels[v] || v} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#111128', border: '1px solid #00d4ff30', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  labelFormatter={(v) => statusLabels[v] || v}
                />
                <Bar dataKey="count" fill="#00d4ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-500">Nenhum dado disponivel</div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Resumo</h2>
          </div>

          <div className="space-y-5">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Drones Disponiveis</span>
                <Cpu className="w-4 h-4 text-neon-blue" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{availableDrones}</span>
                <span className="text-xs text-gray-500">de {drones.length}</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-neon-blue transition-all duration-500" style={{ width: `${drones.length > 0 ? (availableDrones / drones.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Drones em Uso</span>
                <Truck className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{inUseDrones}</span>
                <span className="text-xs text-gray-500">{stats.active} entregas ativas</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-yellow-400 transition-all duration-500" style={{ width: `${drones.length > 0 ? (inUseDrones / drones.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Entregas Concluidas</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stats.delivered}</span>
                <span className="text-xs text-gray-500">{stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% de entregas</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-400 transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Entregas Recentes</h2>
          </div>
          {recent.length > 0 && (
            <Link to="/deliveries" className="flex items-center gap-1 text-neon-blue hover:underline text-sm font-medium">
              Ver Todas <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Nenhuma entrega encontrada</p>
            <Link to="/deliveries/new" className="text-neon-blue hover:underline font-medium inline-flex items-center gap-1">
              Solicitar primeira entrega <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle px-6 lg:px-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-3 pr-4 font-medium">Rota</th>
                    <th className="text-left py-3 pr-4 font-medium">Distancia</th>
                    <th className="text-left py-3 pr-4 font-medium">Valor</th>
                    <th className="text-left py-3 pr-4 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 text-white hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <Link to={`/deliveries/${d.id}`} className="hover:text-neon-blue transition-colors">
                          {d.origin} &rarr; {d.destination}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{d.distance}km</td>
                      <td className="py-3 pr-4 text-green-400 font-medium">R$ {d.cost?.toFixed(2)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[d.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {statusLabels[d.status] || d.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
