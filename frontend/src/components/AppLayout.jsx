import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Cpu, User, Shield, LogOut, Menu, X, Bell, BellRing, Clock, Package as PackageIcon, Truck, CheckCircle, XCircle, HelpCircle, MessageSquare, Sun, Moon, Store, Activity, Building2, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../api';

const mainNav = [
  { to: '/dashboard', key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/deliveries', key: 'deliveries', icon: Package, label: 'Entregas' },
  { to: '/drones', key: 'drones', icon: Cpu, label: 'Drones' },
];

const secondaryNav = [
  { to: '/parceiros', key: 'parceiros', icon: Store, label: 'Parceiros' },
  { to: '/empresa', key: 'empresa', icon: Building2, label: 'Empresa' },
  { to: '/reports', key: 'reports', icon: MessageSquare, label: 'Reports' },
  { to: '/profile', key: 'profile', icon: User, label: 'Perfil' },
  { to: '/support', key: 'support', icon: HelpCircle, label: 'Suporte' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { notifications, unreadCount, addNotification, markAllRead, clearAll } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const generatedRef = useRef(false);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!user || generatedRef.current) return;
    generatedRef.current = true;

    if (localStorage.getItem('notifications_cleared')) return;

    clearAll();

    api.getDeliveries().then((deliveries) => {
      const activeStatuses = ['drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino'];
      const active = deliveries.filter((d) => activeStatuses.includes(d.status));
      if (active.length > 0) {
        addNotification({
          icon: 'em_rota',
          title: `${active.length} entrega(s) ativa(s)`,
          message: active.slice(0, 3).map((d) => `${d.origin} -> ${d.destination}`).join(', ') + (active.length > 3 ? ` e mais ${active.length - 3}` : ''),
          link: '/deliveries',
        });
      }

      deliveries.filter((d) => d.status === 'entregue').forEach((d) => {
        addNotification({ icon: 'entregue', title: 'Entrega concluida!', message: `Sua entrega de ${d.origin} para ${d.destination} foi entregue.`, link: `/deliveries/${d.id}` });
      });

      deliveries.filter((d) => d.status === 'cancelado').forEach((d) => {
        addNotification({ icon: 'cancelado', title: 'Entrega cancelada', message: `A entrega de ${d.origin} foi cancelada.`, link: `/deliveries/${d.id}` });
      });
    }).catch((err) => console.error('Erro ao carregar entregas para notificacoes:', err));

    api.getReports().then((reports) => {
      reports.filter((r) => r.status === 'respondido').forEach((r) => {
        addNotification({ icon: 'suporte', title: 'Reporte respondido', message: `Seu reporte sobre "${r.typeLabel || r.type}" foi respondido pela equipe.`, link: '/reports' });
      });
    }).catch((err) => console.error('Erro ao carregar reports para notificacoes:', err));

    if (user.role === 'admin') {
      api.admin.getReports().then((reports) => {
        const open = reports.filter((r) => r.status === 'aberto');
        if (open.length > 0) {
          addNotification({ icon: 'suporte', title: `${open.length} reporte(s) pendente(s)`, message: `Ha ${open.length} reporte(s) de usuarios aguardando resposta.`, link: '/admin' });
        }
      }).catch((err) => console.error('Erro ao carregar reports admin:', err));
    }
  }, [user]);

  const notifIcons = {
    pendente: Clock, em_andamento: Truck, coletado: PackageIcon,
    em_transito: Truck, proximo_da_entrega: PackageIcon, entregue: CheckCircle, cancelado: XCircle,
    pedido_criado: Clock, aguardando_aprovacao: Clock, drone_selecionado: Cpu,
    preparando_coleta: PackageIcon, coleta_realizada: PackageIcon, em_rota: Truck, proximo_ao_destino: MapPin,
    suporte: HelpCircle, erro: XCircle,
  };

  function handleLogout() {
    clearAll();
    localStorage.removeItem('notifications_cleared');
    generatedRef.current = false;
    logout();
    navigate('/');
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full w-80 bg-dark-card/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-7 h-20 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-neon-blue/20">DX</div>
              <div>
                <span className="text-xl font-bold neon-text">DroneXPress</span>
                <p className="text-[10px] text-gray-600 tracking-widest uppercase">Entregas por Drone</p>
              </div>
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-7 overflow-y-auto space-y-6">
            <div>
              <p className="px-4 text-[11px] font-semibold text-gray-600 uppercase tracking-[0.15em] mb-3">Menu Principal</p>
              <div className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-neon-blue/15 to-transparent text-neon-blue border-l-2 border-neon-blue shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        active ? 'bg-neon-blue/20' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                      }`}>
                        <Icon className={`w-5 h-5 ${active ? 'text-neon-blue' : 'text-gray-500 group-hover:text-gray-300'}`} />
                      </div>
                      <div>
                        <span>{item.label}</span>
                        {active && <p className="text-[11px] text-neon-blue/60 font-normal mt-px">Ativo</p>}
                      </div>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.8)]" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-4 text-[11px] font-semibold text-gray-600 uppercase tracking-[0.15em] mb-3">Geral</p>
              <div className="space-y-1">
                {secondaryNav.filter((item) => !(isAdmin && item.key === 'reports')).map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-neon-blue/15 to-transparent text-neon-blue border-l-2 border-neon-blue shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                      }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        active ? 'bg-neon-blue/20' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                      }`}>
                        <Icon className={`w-[18px] h-[18px] ${active ? 'text-neon-blue' : 'text-gray-500 group-hover:text-gray-300'}`} />
                      </div>
                      <span>{item.label}</span>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.8)]" />}
                    </Link>
                  );
                })}
                {isAdmin && (
                  <>
                  <Link to="/operations" onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                      location.pathname === '/operations'
                        ? 'bg-gradient-to-r from-neon-blue/15 to-transparent text-neon-blue border-l-2 border-neon-blue'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      location.pathname === '/operations' ? 'bg-neon-blue/20' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                    }`}>
                      <Activity className={`w-[18px] h-[18px] ${location.pathname === '/operations' ? 'text-neon-blue' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    </div>
                    <span>Operacoes</span>
                    {location.pathname === '/operations' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.8)]" />}
                  </Link>
                  <Link to="/admin" onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                      location.pathname === '/admin'
                        ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 border-l-2 border-amber-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      location.pathname === '/admin' ? 'bg-amber-500/20' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                    }`}>
                      <Shield className={`w-[18px] h-[18px] ${location.pathname === '/admin' ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    </div>
                    <span>Admin</span>
                    {location.pathname === '/admin' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
                  </Link>
                  </>
                )}
              </div>
            </div>
          </nav>

          <div className="px-4 py-5 border-t border-white/5">
            <div className="flex items-center gap-4 px-4 py-4 mb-2 rounded-2xl bg-white/[0.03]">
              <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-lg shadow-neon-blue/10">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <header className="sticky top-0 z-30 h-16 lg:h-20 bg-dark-bg/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-white font-semibold text-base">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname.startsWith('/deliveries') && (location.pathname === '/deliveries/new' ? 'Nova Entrega' : location.pathname === '/deliveries' ? 'Minhas Entregas' : 'Detalhes da Entrega')}
                {location.pathname.startsWith('/drones') && 'Frota de Drones'}
                {location.pathname.startsWith('/profile') && 'Meu Perfil'}
                {location.pathname.startsWith('/admin') && 'Painel Admin'}
                {location.pathname.startsWith('/support') && 'Suporte'}
                {location.pathname.startsWith('/reports') && (isAdmin ? 'Reports dos Usuarios' : 'Meus Reports')}
                {location.pathname.startsWith('/parceiros') && 'Parceiros'}
                {location.pathname.startsWith('/operations') && 'Centro de Operacoes'}
                {location.pathname.startsWith('/empresa') && 'Empresa'}
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all hidden sm:block" title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative" ref={notifRef}>
              <button className="relative text-gray-400 hover:text-white transition-colors" onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}>
                {unreadCount > 0 ? <BellRing className="w-5 h-5 animate-pulse-glow text-neon-blue" /> : <Bell className="w-5 h-5" />}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] flex items-center justify-center bg-neon-blue text-white text-xs font-bold rounded-full px-1.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 sm:w-[420px] glass-card rounded-2xl overflow-hidden z-50 animate-fade-in shadow-2xl border border-white/10">
                  <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <h4 className="text-white font-semibold text-base">Notificacoes</h4>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button onClick={clearAll} className="text-sm text-red-400 hover:underline">
                          Limpar
                        </button>
                        <button onClick={markAllRead} className="text-sm text-neon-blue hover:underline">
                          Marcar como lidas
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-12 text-center text-gray-500 text-base">
                        <Bell className="w-10 h-10 mx-auto mb-4 text-gray-600" />
                        Nenhuma notificacao
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const Icon = notifIcons[n.icon] || Bell;
                        return (
                          <div key={n.id}
                            onClick={() => { if (n.link) navigate(n.link); setNotifOpen(false); }}
                            className={`px-6 py-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.read ? 'bg-neon-blue/[0.03]' : ''}`}>
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                n.icon === 'entregue' ? 'bg-emerald-500/20' : n.icon === 'cancelado' ? 'bg-red-500/20' : 'bg-neon-blue/10'
                              }`}>
                                <Icon className={`w-5 h-5 ${n.icon === 'entregue' ? 'text-emerald-400' : n.icon === 'cancelado' ? 'text-red-400' : 'text-neon-blue'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-base font-medium leading-snug">{n.title}</p>
                                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{n.message}</p>
                                <p className="text-gray-600 text-xs mt-1.5">{new Date(n.created_at).toLocaleString('pt-BR')}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 max-w-[200px] lg:max-w-[300px]">
              <span className="truncate">Bem-vindo, <strong className="text-white">{user?.name?.split(' ')[0]}</strong></span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-8 py-8 animate-fade-in" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}