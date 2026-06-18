import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronLeft, Clock, CheckCircle, XCircle, Eye, Trash2, User } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

const typeLabels = {
  atraso: 'Atraso na entrega', cancelar: 'Quero cancelar',
  extraviado: 'Pacote extraviado', danificado: 'Pacote danificado',
  problema: 'Problema na entrega', outro: 'Outro',
  extravio: 'Extravio de pacote', local_errado: 'Entregue no local errado',
  drone_problema: 'Problema com o drone',
};

export default function MyReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getReports().then(setReports).catch((err) => console.error('Erro ao carregar reports:', err)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{user?.role === 'admin' ? 'Reports dos Usuarios' : 'Meus Reports'}</h1>
          <p className="text-gray-400 text-base mt-1">{user?.role === 'admin' ? 'Visualize todos os reports enviados pelos usuarios' : 'Acompanhe seus reports e respostas da equipe'}</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-amber-400/60" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-1">Nenhum reporte enviado</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Se algo der errado com uma entrega, voce pode abrir um chamado na pagina de detalhes da entrega ou pelo Suporte.
          </p>
          <Link to="/deliveries" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold text-base hover:opacity-90 transition-all">
            Ver Minhas Entregas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-neon-blue' : ''}`}>
                  <button onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.status === 'aberto' ? 'bg-amber-500/15' : 'bg-green-500/15'}`}>
                      <MessageSquare className={`w-5 h-5 ${r.status === 'aberto' ? 'text-amber-400' : 'text-green-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-base truncate">{typeLabels[r.type] || r.typeLabel || r.type}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{r.delivery_route || 'Entrega'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${r.status === 'aberto' ? 'bg-amber-500/15 text-amber-400' : 'bg-green-500/15 text-green-400'}`}>
                      {r.status === 'aberto' ? 'Aberto' : 'Respondido'}
                    </span>
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-3 border-t border-white/5">
                    <div className="grid sm:grid-cols-2 gap-5 mb-6 text-base">
                      {user?.role === 'admin' && r.user_name && (
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Usuario</p>
                          <p className="text-white text-base flex items-center gap-2"><User className="w-4 h-4 text-neon-blue" /> {r.user_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Tipo</p>
                        <p className="text-white text-base">{typeLabels[r.type] || r.typeLabel || r.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Data</p>
                        <p className="text-white text-base">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-gray-500 text-sm mb-1">Descricao</p>
                      <p className="text-gray-300 text-base leading-relaxed bg-white/[0.03] rounded-xl p-5">{r.description}</p>
                    </div>
                    {r.response && (
                      <div className="mb-2 p-5 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-neon-blue" />
                          <p className="text-sm text-neon-blue font-medium">Resposta da equipe</p>
                        </div>
                        <p className="text-base text-gray-300 leading-relaxed">{r.response}</p>
                      </div>
                    )}
                    {r.status === 'respondido' && (
                      <button onClick={async () => {
                        if (!confirm('Tem certeza que deseja excluir este report?')) return;
                        try {
                          await api.deleteReport(r.id);
                          setReports((prev) => prev.filter((x) => x.id !== r.id));
                        } catch (err) {
                          alert(err.message || 'Erro ao excluir report');
                        }
                      }}
                        className="mt-4 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Excluir Report
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}