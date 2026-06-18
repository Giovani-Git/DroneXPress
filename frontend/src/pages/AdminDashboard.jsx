import { useState, useEffect } from 'react';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Cpu, Package, Trash2, Shield, UserX, ArrowUpDown, CheckCircle, XCircle, AlertCircle, MessageSquare, Eye } from 'lucide-react';

const COLORS = ['#00d4ff', '#7b61ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];

const statusLabels = {
  pedido_criado: 'Pedido Criado', aguardando_aprovacao: 'Aguardando Aprovacao',
  drone_selecionado: 'Drone Selecionado', preparando_coleta: 'Preparando Coleta',
  coleta_realizada: 'Coleta Realizada', em_rota: 'Em Rota',
  proximo_ao_destino: 'Proximo ao Destino', entregue: 'Entregue', cancelado: 'Cancelado',
};

const statusOptions = ['pedido_criado', 'aguardando_aprovacao', 'drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue', 'cancelado'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [drones, setDrones] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [editingDrone, setEditingDrone] = useState(null);
  const [droneForm, setDroneForm] = useState({});
  const [reports, setReports] = useState([]);
  const [filterReport, setFilterReport] = useState('todos');
  const [expandedReport, setExpandedReport] = useState(null);
  const [reportResponse, setReportResponse] = useState({});

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (tab === 'reports') {
      api.admin.getReports().then(setReports).catch(() => {});
    }
  }, [tab]);

  function loadAll() {
    setLoading(true);
    Promise.all([
      api.admin.getStats().catch(() => null),
      api.admin.getUsers().catch(() => []),
      api.admin.getDrones().catch(() => []),
      api.admin.getDeliveries().catch(() => []),
    ])
      .then(([s, u, d, del]) => {
        setStats(s);
        setUsers(u);
        setDrones(d);
        setDeliveries(del);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function showMsg(type, text) {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
  }

  async function handleDeleteUser(id) {
    if (!confirm('Tem certeza que deseja remover este usuario?')) return;
    try {
      await api.admin.deleteUser(id);
      showMsg('success', 'Usuario removido com sucesso');
      const s = await api.admin.getStats();
      setStats(s);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      showMsg('error', err.message);
    }
  }

  async function handleToggleAdmin(id, currentRole) {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await api.admin.updateUser(id, { role: newRole });
      showMsg('success', `Usuario alterado para ${newRole === 'admin' ? 'Admin' : 'Usuario'}`);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      showMsg('error', err.message);
    }
  }

  function startEditDrone(drone) {
    setEditingDrone(drone.id);
    setDroneForm({ name: drone.name, model: drone.model, speed: drone.speed, battery: drone.battery, max_weight: drone.max_weight, status: drone.status });
  }

  async function handleSaveDrone(id) {
    try {
      await api.admin.updateDrone(id, droneForm);
      showMsg('success', 'Drone atualizado com sucesso');
      setDrones((prev) => prev.map((d) => d.id === id ? { ...d, ...droneForm } : d));
      setEditingDrone(null);
    } catch (err) {
      showMsg('error', err.message);
    }
  }

  async function handleUpdateDeliveryStatus(id, status) {
    try {
      await api.admin.updateDelivery(id, { status });
      showMsg('success', `Status alterado para ${statusLabels[status] || status}`);
      setDeliveries((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    } catch (err) {
      showMsg('error', err.message);
    }
  }

  async function handleDeleteDelivery(id) {
    if (!confirm('Tem certeza que deseja remover esta entrega?')) return;
    try {
      await api.admin.deleteDelivery(id);
      showMsg('success', 'Entrega removida com sucesso');
      setDeliveries((prev) => prev.filter((d) => d.id !== id));
      const s = await api.admin.getStats();
      setStats(s);
    } catch (err) {
      showMsg('error', err.message);
    }
  }

  const ucfirst = (s) => s?.charAt(0).toUpperCase() + s?.slice(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visao Geral', icon: Package },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'drones', label: 'Drones', icon: Cpu },
    { id: 'deliveries', label: 'Entregas', icon: Package },
    { id: 'reports', label: 'Reports', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Painel Administrativo</h1>
          <p className="text-gray-400 mt-1">Gerencie a plataforma DroneXPress</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
          <ArrowUpDown className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {actionMsg.text && (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-6 text-sm leading-relaxed ${
          actionMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                tab === t.id ? 'gradient-bg text-white' : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && stats && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
            {(() => {
              const delivered = deliveries.filter((d) => d.status === 'entregue');
              const totalRevenue = delivered.reduce((s, d) => s + (d.cost || 0), 0);
              const canceled = deliveries.filter((d) => d.status === 'cancelado').length;
              const completionRate = stats.totalDeliveries > 0 ? Math.round((delivered.length / stats.totalDeliveries) * 100) : 0;
              const cards = [
                { label: 'Usuarios', value: stats.totalUsers, color: 'text-white' },
                { label: 'Drones', value: stats.totalDrones, color: 'text-white' },
                { label: 'Disponiveis', value: stats.availableDrones, color: 'text-green-400' },
                { label: 'Total Entregas', value: stats.totalDeliveries, color: 'text-neon-blue' },
                { label: 'Ativas', value: stats.activeDeliveries, color: 'text-yellow-400' },
                { label: 'Faturamento', value: `R$ ${totalRevenue.toFixed(2)}`, color: 'text-emerald-400' },
                { label: 'Conclusao', value: `${completionRate}%`, color: 'text-cyan-400' },
                { label: 'Canceladas', value: canceled, color: 'text-red-400' },
                { label: 'Receita Media', value: delivered.length > 0 ? `R$ ${(totalRevenue / delivered.length).toFixed(2)}` : 'R$ 0,00', color: 'text-purple-400' },
                { label: 'Drones Ociosos', value: stats.availableDrones, color: 'text-green-400' },
              ];
              return cards.map((c) => (
                <div key={c.label} className="glass-card rounded-2xl p-6 text-center hover:neon-glow transition-all duration-300">
                  <p className="text-gray-400 text-sm mb-2">{c.label}</p>
                  <p className={`text-3xl lg:text-4xl font-bold ${c.color}`}>{c.value}</p>
                </div>
              ));
            })()}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            <div className="glass-card rounded-3xl p-6 lg:p-8">
              <h3 className="text-white font-semibold text-lg mb-6">Status das Entregas</h3>
              {stats.deliveriesByStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={stats.deliveriesByStatus} barCategoryGap={8} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="status" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => statusLabels[v] || v} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111128', border: '1px solid #00d4ff30', borderRadius: '12px' }}
                      labelFormatter={(v) => statusLabels[v] || v} />
                    <Bar dataKey="count" fill="#00d4ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 py-12 text-center">Nenhum dado disponivel</p>
              )}
            </div>

            <div className="glass-card rounded-3xl p-6 lg:p-8">
              <h3 className="text-white font-semibold text-lg mb-6">Distribuicao</h3>
              {stats.deliveriesByStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={stats.deliveriesByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%"
                      outerRadius={110} innerRadius={50}
                      label={({ status, percent }) => `${(statusLabels[status] || status).slice(0, 8)} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}>
                      {stats.deliveriesByStatus.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111128', border: '1px solid #00d4ff30', borderRadius: '12px' }}
                      labelFormatter={(v) => statusLabels[v] || v} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 py-12 text-center">Nenhum dado disponivel</p>
              )}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 lg:p-8">
            <h3 className="text-white font-semibold text-lg mb-6">Entregas Recentes</h3>
            {stats.recentDeliveries?.length > 0 ? (
              <div className="overflow-x-auto -mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle px-6 lg:px-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                        <th className="text-left py-3 pr-4 font-medium">Usuario</th>
                        <th className="text-left py-3 pr-4 font-medium">Rota</th>
                        <th className="text-left py-3 pr-4 font-medium">Status</th>
                        <th className="text-left py-3 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentDeliveries.map((d) => (
                        <tr key={d.id} className="border-b border-white/5 text-white hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4">{d.user_name}</td>
                          <td className="py-3 pr-4 text-gray-400">{d.origin} &rarr; {d.destination}</td>
                          <td className="py-3 pr-4">
                            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
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
            ) : (
              <p className="text-gray-500 py-8 text-center">Nenhuma entrega recente</p>
            )}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="glass-card rounded-3xl p-6 lg:p-8">
          <h3 className="text-white font-semibold text-lg mb-6">Gerenciar Usuarios</h3>
          <div className="overflow-x-auto -mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle px-6 lg:px-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-3 pr-4 font-medium">Nome</th>
                    <th className="text-left py-3 pr-4 font-medium">Email</th>
                    <th className="text-left py-3 pr-4 font-medium">Empresa</th>
                    <th className="text-left py-3 pr-4 font-medium">Tipo</th>
                    <th className="text-left py-3 pr-6 font-medium">Acoes</th>
                    <th className="text-left py-3 font-medium">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 text-white hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-medium">{u.name}</td>
                      <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                      <td className="py-3 pr-4 text-gray-400">{u.company || '-'}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="py-3 pr-6">
                        <div className="flex items-center gap-2">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleToggleAdmin(u.id, u.role)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all text-xs font-medium flex items-center gap-1.5" title="Tornar admin">
                              <Shield className="w-3.5 h-3.5" /> Admin
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-xs font-medium flex items-center gap-1.5" title="Remover usuario">
                              <UserX className="w-3.5 h-3.5" /> Remover
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'drones' && (
        <div className="space-y-4 lg:space-y-6">
          {drones.map((drone) => {
            const isEditing = editingDrone === drone.id;
            const statusConf = {
              disponivel: 'text-green-400 bg-green-500/20',
              em_entrega: 'text-blue-400 bg-blue-500/20',
              carregando: 'text-yellow-400 bg-yellow-500/20',
            };
            return (
              <div key={drone.id} className={`glass-card rounded-2xl p-6 lg:p-8 transition-all duration-300 ${isEditing ? 'border-neon-blue ring-1 ring-neon-blue' : ''}`}>
                {isEditing ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold text-lg">Editando: {drone.name}</h4>
                      <button onClick={() => setEditingDrone(null)} className="text-gray-400 hover:text-white text-sm">Cancelar</button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Nome</label>
                        <input type="text" value={droneForm.name} onChange={(e) => setDroneForm((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Modelo</label>
                        <input type="text" value={droneForm.model} onChange={(e) => setDroneForm((p) => ({ ...p, model: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Velocidade (km/h)</label>
                        <input type="number" value={droneForm.speed} onChange={(e) => setDroneForm((p) => ({ ...p, speed: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Bateria (%)</label>
                        <input type="number" min="0" max="100" value={droneForm.battery} onChange={(e) => setDroneForm((p) => ({ ...p, battery: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Carga Max (kg)</label>
                        <input type="number" value={droneForm.max_weight} onChange={(e) => setDroneForm((p) => ({ ...p, max_weight: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Status</label>
                        <select value={droneForm.status} onChange={(e) => setDroneForm((p) => ({ ...p, status: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue">
                          <option value="disponivel">Disponivel</option>
                          <option value="em_entrega">Em Entrega</option>
                          <option value="carregando">Carregando</option>
                          <option value="manutencao">Manutencao</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => handleSaveDrone(drone.id)}
                      className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all">
                      Salvar Alteracoes
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-white font-semibold text-lg">{drone.name}</h4>
                        <span className="text-gray-500 text-sm">{drone.model}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusConf[drone.status] || ''}`}>
                          {drone.status === 'disponivel' ? 'Disponivel' : drone.status === 'em_entrega' ? 'Em Entrega' : drone.status === 'manutencao' ? 'Manutencao' : 'Carregando'}
                        </span>
                        {drone.status !== 'manutencao' && drone.status !== 'em_entrega' && (
                          <button onClick={async () => {
                            try {
                              await api.admin.maintenanceDrone(drone.id, 'start');
                              showMsg('success', `${drone.name} enviado para manutencao`);
                              setDrones((prev) => prev.map((d) => d.id === drone.id ? { ...d, status: 'manutencao' } : d));
                            } catch (err) { showMsg('error', err.message); }
                          }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Enviar para manutencao">
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                        {drone.status === 'manutencao' && (
                          <button onClick={async () => {
                            try {
                              const res = await api.admin.maintenanceDrone(drone.id, 'end');
                              showMsg('success', `${drone.name} voltou a operacao`);
                              setDrones((prev) => prev.map((d) => d.id === drone.id ? { ...d, status: 'disponivel', battery: 100 } : d));
                            } catch (err) { showMsg('error', err.message); }
                          }}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all" title="Finalizar manutencao">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => startEditDrone(drone)}
                          className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all" title="Editar drone">
                          <Cpu className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="glass rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs">Velocidade</p>
                        <p className="text-white font-medium mt-0.5">{drone.speed} km/h</p>
                      </div>
                      <div className="glass rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs">Carga Max</p>
                        <p className="text-white font-medium mt-0.5">{drone.max_weight} kg</p>
                      </div>
                      <div className="glass rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs">Bateria</p>
                        <p className={`font-medium mt-0.5 ${drone.battery > 50 ? 'text-green-400' : drone.battery > 20 ? 'text-yellow-400' : 'text-red-400'}`}>{drone.battery}%</p>
                      </div>
                      <div className="glass rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs">Categoria</p>
                        <p className="text-white font-medium mt-0.5 capitalize">{drone.category || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'deliveries' && (
        <div className="glass-card rounded-3xl p-6 lg:p-8">
          <h3 className="text-white font-semibold text-lg mb-6">Gerenciar Entregas</h3>
          <div className="overflow-x-auto -mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle px-6 lg:px-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-3 pr-4 font-medium">Usuario</th>
                    <th className="text-left py-3 pr-4 font-medium">Rota</th>
                    <th className="text-left py-3 pr-4 font-medium">Distancia</th>
                    <th className="text-left py-3 pr-4 font-medium">Valor</th>
                    <th className="text-left py-3 pr-6 font-medium">Acoes</th>
                    <th className="text-left py-3 pr-4 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 text-white hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">{d.user_name}</td>
                      <td className="py-3 pr-4 text-gray-400">{d.origin} &rarr; {d.destination}</td>
                      <td className="py-3 pr-4">{d.distance}km</td>
                      <td className="py-3 pr-4 text-green-400 font-medium">R$ {d.cost?.toFixed(2)}</td>
                      <td className="py-3 pr-6">
                        <button onClick={() => handleDeleteDelivery(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-xs font-medium flex items-center gap-1.5" title="Remover entrega">
                          <Trash2 className="w-3.5 h-3.5" /> Remover
                        </button>
                      </td>
                      <td className="py-3 pr-4">
                        <select value={d.status} onChange={(e) => handleUpdateDeliveryStatus(d.id, e.target.value)}
                          className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30 focus:outline-none cursor-pointer appearance-none">
                          {statusOptions.map((s) => (
                            <option key={s} value={s} className="bg-dark-card text-white">{statusLabels[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 text-gray-400 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="glass-card rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-white font-semibold text-lg">Reports de Usuarios</h3>
            <select value={filterReport} onChange={(e) => setFilterReport(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue">
              <option value="todos">Todos</option>
              <option value="aberto">Abertos</option>
              <option value="respondido">Respondidos</option>
            </select>
          </div>
          {reports.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">Nenhum reporte encontrado</p>
          ) : (
            <div className="space-y-4">
              {reports
                .filter((r) => filterReport === 'todos' || r.status === filterReport)
                .map((r) => {
                  const isOpen = expandedReport === r.id;
                  const typeLabels = { atraso: 'Atraso', cancelar: 'Cancelamento', extraviado: 'Extraviado', danificado: 'Danificado', problema: 'Problema', outro: 'Outro' };
                  return (
                    <div key={r.id} className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-neon-blue' : ''}`}>
                      <button onClick={() => setExpandedReport(isOpen ? null : r.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.status === 'aberto' ? 'bg-amber-500/15' : 'bg-green-500/15'}`}>
                            <MessageSquare className={`w-5 h-5 ${r.status === 'aberto' ? 'text-amber-400' : 'text-green-400'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{r.user_name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{typeLabels[r.type] || r.type} &middot; {new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${r.status === 'aberto' ? 'bg-amber-500/15 text-amber-400' : 'bg-green-500/15 text-green-400'}`}>
                            {r.status === 'aberto' ? 'Aberto' : 'Respondido'}
                          </span>
                          <Eye className="w-4 h-4 text-gray-500" />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-white/5">
                          <div className="text-sm text-gray-300 mb-4 leading-relaxed">{r.description}</div>
                          {r.response && (
                            <div className="mb-4 p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
                              <p className="text-xs text-neon-blue font-medium mb-1">Sua resposta:</p>
                              <p className="text-sm text-gray-300">{r.response}</p>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <textarea value={reportResponse[r.id] || ''} onChange={(e) => setReportResponse((p) => ({ ...p, [r.id]: e.target.value }))}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-blue resize-none min-h-[60px]"
                              placeholder="Responder reporte..." />
                            <div className="flex gap-2">
                              <button onClick={async () => {
                                const resp = reportResponse[r.id];
                                if (!resp?.trim()) return;
                                try {
                                  await api.admin.updateReport(r.id, { response: resp, status: 'respondido' });
                                  showMsg('success', 'Reporte respondido');
                                  const updated = await api.admin.getReports();
                                  setReports(updated);
                                  setReportResponse((p) => ({ ...p, [r.id]: '' }));
                                } catch { showMsg('error', 'Erro ao responder'); }
                              }}
                                className="px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 transition-all whitespace-nowrap">
                                Responder
                              </button>
                              <button onClick={async () => {
                                if (!confirm('Remover este reporte?')) return;
                                try {
                                  await api.admin.deleteReport(r.id);
                                  showMsg('success', 'Reporte removido');
                                  setReports((prev) => prev.filter((x) => x.id !== r.id));
                                } catch { showMsg('error', 'Erro ao remover'); }
                              }}
                                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all whitespace-nowrap">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
