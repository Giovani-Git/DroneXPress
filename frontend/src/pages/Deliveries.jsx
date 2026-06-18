import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, ChevronRight, Package, CheckCircle, Clock, Truck, Cpu } from 'lucide-react';
import { api } from '../api';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getDeliveries().then((data) => {
      setDeliveries(data || []);
    }).catch((err) => console.error('Erro ao carregar entregas:', err)).finally(() => setLoading(false));
  }, []);

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

  const statusIcons = {
    pedido_criado: Clock,
    aguardando_aprovacao: Clock,
    drone_selecionado: Cpu,
    preparando_coleta: Package,
    coleta_realizada: Package,
    em_rota: Truck,
    proximo_ao_destino: MapPin,
    entregue: CheckCircle,
    cancelado: Package,
  };

  const filtered = filter === 'all' ? deliveries : deliveries.filter((d) => d.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Entregas</h1>
            <p className="text-gray-400 text-lg mt-2">Historico de entregas</p>
          </div>
          <Link
            to="/deliveries/new"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow text-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nova Entrega
          </Link>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pedido_criado', 'drone_selecionado', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                filter === s ? 'gradient-bg text-white' : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'Todas' : statusLabels[s] || s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-blue/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-neon-blue/60" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Nenhuma entrega {filter !== 'all' ? 'nesse status' : 'ainda'}</h3>
            <p className="text-gray-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
              {filter !== 'all' ? 'Tente selecionar outro filtro para ver mais resultados.' : 'Solicite sua primeira entrega e acompanhe tudo em tempo real pelo mapa interativo.'}
            </p>
            {filter === 'all' && (
              <Link to="/deliveries/new"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all text-base">
                <Plus className="w-5 h-5" /> Solicitar Entrega
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((d) => {
              const StatusIcon = statusIcons[d.status] || Truck;
              return (
                <Link
                  key={d.id}
                  to={`/deliveries/${d.id}`}
                  className="block glass-card rounded-2xl p-5 lg:p-6 hover:neon-glow transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        d.status === 'entregue' ? 'bg-emerald-500/20' : 'bg-neon-blue/10'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${d.status === 'entregue' ? 'text-emerald-400' : 'text-neon-blue'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-lg">{d.origin}</span>
                          <span className="text-gray-500">&rarr;</span>
                          <span className="text-white font-medium text-lg">{d.destination}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                          <span>{d.distance}km</span>
                          <span>{d.estimated_time}min</span>
                          <span>{d.weight}kg</span>
                          <span className="text-green-400 font-medium">R$ {d.cost?.toFixed(2)}</span>
                        </div>
                        {d.drone_name && (
                          <p className="text-xs text-gray-600 mt-2">Drone: {d.drone_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end lg:self-center">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[d.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {statusLabels[d.status] || d.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
    </div>
  );
}
