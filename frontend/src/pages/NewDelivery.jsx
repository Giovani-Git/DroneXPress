import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Package, Truck, AlertCircle, Check, ArrowRight, Cpu, Gauge, Star, DollarSign, CreditCard } from 'lucide-react';
import { api } from '../api';
import { useNotifications } from '../contexts/NotificationContext';
import { onlyDigits, onlyLetters, onlyNumbers, formatCEP } from '../utils/validation';

const CITY_OPTIONS = ['Passo Fundo', 'Marau', 'Carazinho', 'Soledade', 'Erechim', 'Caxias do Sul', 'Porto Alegre'];

const emptyAddress = { rua: '', numero: '', bairro: '', cidade: '', cep: '' };

const inputClass = "w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:bg-white/[0.08] transition-all text-base";

function AddressFields({ prefix, address, onChange }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-400 mb-2">Rua</label>
          <input type="text" value={address.rua} onChange={(e) => onChange('rua', e.target.value)}
            className={inputClass} placeholder="Rua" required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">N&uacute;mero</label>
          <input type="text" value={address.numero} onChange={(e) => onChange('numero', onlyNumbers(e.target.value))}
            className={inputClass} placeholder="N&ordm;" required inputMode="numeric" />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Bairro</label>
          <input type="text" value={address.bairro} onChange={(e) => onChange('bairro', onlyLetters(e.target.value))}
            className={inputClass} placeholder="Bairro" required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Cidade</label>
          <input list={`${prefix}-cities`} value={address.cidade} onChange={(e) => onChange('cidade', onlyLetters(e.target.value))}
            className={inputClass} placeholder="Cidade" required />
          <datalist id={`${prefix}-cities`}>
            {CITY_OPTIONS.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">CEP</label>
          <input type="text" value={address.cep} onChange={(e) => onChange('cep', formatCEP(e.target.value))}
            className={inputClass} placeholder="00000-000" inputMode="numeric" maxLength={9} />
        </div>
      </div>
    </div>
  );
}

export default function NewDelivery() {
  const [origin, setOrigin] = useState({ ...emptyAddress });
  const [destination, setDestination] = useState({ ...emptyAddress });
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [step, setStep] = useState('form');
  const [simulation, setSimulation] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  function updateOrigin(field, value) {
    setOrigin((prev) => ({ ...prev, [field]: value }));
  }
  function updateDest(field, value) {
    setDestination((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSimulate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.simulateDelivery(origin, destination, parseFloat(weight));
      setSimulation(data);
      const recommended = data.availableDrones?.find((d) => d.recommended);
      if (recommended) setSelectedDrone(recommended.id);
      setStep('select-drone');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const data = await api.createDelivery(origin, destination, parseFloat(weight), selectedDrone, description, company);
      addNotification({
        icon: data.drone_id ? 'em_andamento' : 'pendente',
        title: data.drone_id ? 'Entrega a caminho!' : 'Entrega solicitada',
        message: `Sua entrega de ${data.origin} para ${data.destination} foi ${data.drone_id ? 'iniciada' : 'cadastrada'}. ${data.drone_id ? `Drone ${data.drone_name} a caminho.` : 'Aguardando drone disponivel.'}`,
      });
      navigate(`/deliveries/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Nova Entrega</h1>
        <p className="text-gray-400 text-lg mt-2">Preencha os endere&ccedil;os de origem e destino</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl mb-6 text-sm leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 'form' && (
        <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8">
          <form onSubmit={handleSimulate} className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-neon-blue" />
                </div>
                <h2 className="text-xl font-bold text-white">Origem</h2>
              </div>
              <AddressFields prefix="origin" address={origin} onChange={updateOrigin} />
            </div>

            <div className="section-divider" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Destino</h2>
              </div>
              <AddressFields prefix="dest" address={destination} onChange={updateDest} />
            </div>

            <div className="section-divider" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Carga</h2>
                  <p className="text-gray-500 text-sm mt-1">Informe o peso aproximado da carga</p>
                </div>
              </div>
              <div className="max-w-xs">
                <label className="block text-sm text-gray-400 mb-2">Peso (kg)</label>
                <input type="number" step="0.1" min="0.1" max="100"
                  value={weight} onChange={(e) => setWeight(e.target.value)}
                  className={inputClass} placeholder="Ex: 5.5" required />
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Descricao do pacote</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:bg-white/[0.08] transition-all text-base min-h-[100px] resize-none"
                  placeholder="Ex: Eletronicos, roupas, documentos..." />
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Empresa (opcional)</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                  className={inputClass} placeholder="Nome da empresa" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Calculando...</>
              ) : (
                <><ArrowRight className="w-5 h-5" /> Simular Entrega</>
              )}
            </button>
          </form>
        </div>
      )}

      {step === 'select-drone' && simulation && (
        <div className="animate-slide-up space-y-8">
          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <h2 className="text-xl font-bold text-white mb-8">Resultado da Simula&ccedil;&atilde;o</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="glass rounded-2xl p-6 text-center">
                <MapPin className="w-5 h-5 text-neon-blue mx-auto mb-3" />
                <p className="text-gray-400 text-xs mb-2">Dist&acirc;ncia</p>
                <p className="text-2xl font-bold text-white">{simulation.distance} km</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <Gauge className="w-5 h-5 text-neon-blue mx-auto mb-3" />
                <p className="text-gray-400 text-xs mb-2">Tempo</p>
                <p className="text-2xl font-bold text-neon-blue">{simulation.estimatedTime} min</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <Package className="w-5 h-5 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400 text-xs mb-2">Peso</p>
                <p className="text-2xl font-bold text-white">{simulation.weight} kg</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <Truck className="w-5 h-5 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400 text-xs mb-2">Custo</p>
                <p className="text-2xl font-bold text-green-400">R$ {simulation.cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Selecionar Drone</h2>
                <p className="text-gray-400 text-sm mt-1">Escolha o drone ideal para sua entrega</p>
              </div>
            </div>

            {simulation.availableDrones?.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
                <p className="text-red-400 font-medium text-xl mb-2">N&atilde;o h&aacute; drones dispon&iacute;veis para essa carga.</p>
                <p className="text-gray-500 text-sm">O peso informado excede a capacidade m&aacute;xima de todos os drones dispon&iacute;veis.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {simulation.availableDrones.map((drone) => {
                  const isSelected = selectedDrone === drone.id;
                  return (
                    <button key={drone.id} onClick={() => setSelectedDrone(drone.id)}
                      className={`text-left glass rounded-2xl p-6 transition-all duration-200 relative ${
                        isSelected
                          ? 'border-neon-blue neon-glow ring-1 ring-neon-blue'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {drone.recommended && (
                        <div className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1 rounded-full gradient-bg text-white text-xs font-bold shadow-lg">
                          <Star className="w-3 h-3" /> Recomendado
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold text-lg">{drone.name}</h3>
                        {isSelected && <Check className="w-5 h-5 text-neon-blue" />}
                      </div>
                      <p className="text-gray-500 text-xs mb-4">{drone.model}</p>
                      <div className="space-y-2.5 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Capacidade</span>
                          <span className="text-white font-medium">{drone.max_weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-gray-500" />
                            <span>Velocidade</span>
                          </div>
                          <span className="text-white font-medium">{drone.speed} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                            <span>Custo</span>
                          </div>
                          <span className="text-green-400 font-medium">R$ {drone.droneCost?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bateria</span>
                          <span className="text-white font-medium">{drone.battery}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {simulation.availableDrones?.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button onClick={() => setStep('payment')} disabled={!selectedDrone}
                  className="flex-1 py-4 rounded-2xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow disabled:opacity-50 text-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" /> Continuar para Pagamento
                </button>
                <button onClick={() => { setStep('form'); setSimulation(null); setSelectedDrone(null); setPaymentMethod('cartao'); }}
                  className="px-10 py-4 rounded-2xl border border-white/20 text-gray-300 hover:bg-white/5 transition-all duration-200 text-lg font-medium"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'payment' && simulation && selectedDrone && (
        <div className="animate-slide-up space-y-8">
          <div className="glass-card rounded-3xl p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirmar Pagamento</h2>
                <p className="text-gray-400 text-sm mt-1">Revise os detalhes da entrega e escolha a forma de pagamento</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Rota</p>
                <p className="text-amber-400 font-medium text-sm">Base: Passo Fundo</p>
                <ArrowRight className="w-4 h-4 text-amber-400/60 my-2" />
                <p className="text-white font-medium">{origin.rua}, {origin.numero} - {origin.bairro}</p>
                <p className="text-gray-500 text-sm">{origin.cidade} - {origin.cep}</p>
                <ArrowRight className="w-5 h-5 text-neon-blue my-3" />
                <p className="text-white font-medium">{destination.rua}, {destination.numero} - {destination.bairro}</p>
                <p className="text-gray-500 text-sm">{destination.cidade} - {destination.cep}</p>
              </div>
              <div className="glass rounded-2xl p-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Resumo</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distancia</span>
                    <span className="text-white font-medium">{simulation.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tempo estimado</span>
                    <span className="text-white font-medium">{simulation.estimatedTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peso</span>
                    <span className="text-white font-medium">{simulation.weight} kg</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Descricao</span>
                      <span className="text-white font-medium truncate max-w-[140px]">{description}</span>
                    </div>
                  )}
                  {company && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Empresa</span>
                      <span className="text-white font-medium">{company}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Drone</span>
                    <span className="text-white font-medium">{simulation.availableDrones.find(d => d.id === selectedDrone)?.name}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300 font-medium">Valor Total</span>
                      <span className="text-green-400 font-bold text-lg">R$ {simulation.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Forma de Pagamento</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'cartao', label: 'Cartao', desc: 'Credito/Debito' },
                  { id: 'pix', label: 'Pix', desc: 'Transferencia instantanea' },
                  { id: 'boleto', label: 'Boleto', desc: 'Pagamento bancario' },
                ].map((m) => (
                  <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                    className={`glass rounded-2xl p-5 text-left transition-all duration-200 ${
                      paymentMethod === m.id ? 'border-neon-blue ring-1 ring-neon-blue' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className="text-white font-medium text-base">{m.label}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 py-4 rounded-2xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 neon-glow disabled:opacity-50 text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processando...</>
                ) : (
                  <><Check className="w-5 h-5" /> Confirmar Pagamento</>
                )}
              </button>
              <button onClick={() => setStep('select-drone')}
                className="px-10 py-4 rounded-2xl border border-white/20 text-gray-300 hover:bg-white/5 transition-all duration-200 text-lg font-medium"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
