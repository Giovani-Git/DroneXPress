import { useState, useEffect } from 'react';
import { Cpu, Gauge, Weight, Battery, Wifi, Zap, AlertTriangle } from 'lucide-react';
import { api } from '../api';

const droneIcons = [Cpu, Gauge, Zap, Wifi, Battery, Cpu];

const statusConfig = {
  disponivel: { color: 'bg-green-500/20 text-green-400', label: 'Disponivel' },
  em_entrega: { color: 'bg-blue-500/20 text-blue-400', label: 'Em Entrega' },
  carregando: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Carregando' },
};

export default function DronePage() {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDrones().then(setDrones).catch((err) => setError(err.message || 'Erro ao carregar drones')).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">Nossa Frota</h1>
          </div>
          <p className="text-gray-400 text-lg lg:text-xl text-center">
            Conheca os drones da DroneXPress &mdash; tecnologia de ponta para entregas rapidas e seguras.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}. Verifique se o servidor esta rodando.</span>
            <button onClick={() => { setError(''); setLoading(true); api.getDrones().then(setDrones).catch((err) => setError(err.message)).finally(() => setLoading(false)); }}
              className="ml-auto px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all text-xs font-medium whitespace-nowrap">
              Tentar novamente
            </button>
          </div>
        )}

        {drones.length === 0 && !error && (
          <div className="text-center py-20">
            <Cpu className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum drone disponivel no momento.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {drones.map((drone, idx) => {
            const status = statusConfig[drone.status] || statusConfig.disponivel;
            const Icon = droneIcons[idx % droneIcons.length];
            return (
              <div key={drone.id} className="glass-card rounded-3xl p-6 lg:p-8 hover:neon-glow transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-neon-blue" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white text-center mb-1">{drone.name}</h3>
                <p className="text-gray-500 text-sm text-center mb-6">{drone.model}</p>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Velocidade</span>
                    </div>
                    <span className="text-white font-semibold">{drone.speed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Carga Maxima</span>
                    </div>
                    <span className="text-white font-semibold">{drone.max_weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Bateria</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{
                          width: `${drone.battery}%`,
                          background: drone.battery > 50 ? 'linear-gradient(90deg, #00d4ff, #00ff88)' : drone.battery > 20 ? 'linear-gradient(90deg, #ffaa00, #ffdd00)' : 'linear-gradient(90deg, #ff4444, #ff6666)',
                        }} />
                      </div>
                      <span className="text-white text-sm font-medium w-10 text-right">{drone.battery}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className={`inline-block px-5 py-2 rounded-full text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
