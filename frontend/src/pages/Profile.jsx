import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building2, MapPin, CreditCard, Lock, Save, AlertCircle, CheckCircle, Trash2, Eye, Bell } from 'lucide-react';
import ProfileCover from '../components/illustrations/ProfileCover';
import DroneAvatar from '../components/illustrations/DroneAvatar';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { onlyLetters, onlyNumbers, onlyLettersAndNumbers, formatCEP, formatPhone } from '../utils/validation';

const emptyAddress = { rua: '', numero: '', bairro: '', cidade: '', cep: '' };

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState({ ...emptyAddress });
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showName, setShowName] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPromo, setNotifPromo] = useState(false);
  const [language, setLanguage] = useState('pt-BR');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tab, setTab] = useState('personal');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      setAddress(user.address || { ...emptyAddress });
      setPaymentMethod(user.paymentMethod || 'cartao');
      setCardNumber(user.cardNumber || '');
      setCardName(user.cardName || '');
      setCardExpiry(user.cardExpiry || '');
      setCardCvv(user.cardCvv || '');
      setShowName(user.showName !== false);
      setShowEmail(user.showEmail !== false);
      setShowPhone(user.showPhone !== false);
      setNotifEmail(user.notifEmail !== false);
      setNotifSms(user.notifSms || false);
      setNotifPromo(user.notifPromo || false);
      setLanguage(user.language || 'pt-BR');
    }
  }, [user]);

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { name, phone, company, address, paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, showName, showEmail, showPhone, notifEmail, notifSms, notifPromo, language };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const data = await api.updateProfile(payload);
      updateUser({ ...data, language, showName, showEmail, showPhone, notifEmail, notifSms, notifPromo, cardNumber, cardName, cardExpiry, cardCvv });
      setCurrentPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await api.deleteProfile();
      logout();
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setDeleting(false);
    }
  }

  const tabs = [
    { id: 'personal', key: 'personal', icon: User, label: 'Dados Pessoais' },
    { id: 'payment', key: 'payment', icon: CreditCard, label: 'Pagamento' },
    { id: 'privacy', key: 'privacy', icon: Eye, label: 'Privacidade' },
    { id: 'security', key: 'security', icon: Lock, label: 'Seguranca' },
  ];

  const inputClass = "w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:bg-white/[0.08] transition-all text-lg";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Meu Perfil</h1>
        <p className="text-gray-400 text-base mt-1">Gerencie suas informacoes pessoais</p>
      </div>

      <div className="rounded-2xl overflow-hidden mb-6">
        <ProfileCover className="w-full h-auto" />
      </div>

      <div className="glass-card rounded-3xl p-8 lg:p-10 mb-8">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/10">
          <DroneAvatar size={80} className="flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base whitespace-nowrap transition-all duration-200 font-medium ${
                  tab === tabItem.id ? 'gradient-bg text-white' : 'glass text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" /> {tabItem.label}
              </button>
            );
          })}
        </div>

        {message.text && (
          <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl mb-6 text-sm leading-relaxed ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          {tab === 'personal' && (
            <div className="space-y-6">
              <div>
                  <label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                    <User className="w-5 h-5" /> Nome
                  </label>
                <input type="text" value={name} onChange={(e) => setName(onlyLetters(e.target.value))}
                  className={inputClass} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
<label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                  <Phone className="w-5 h-5" /> Telefone
                  </label>
                  <input type="text" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className={inputClass} placeholder="(54) 99999-0000" inputMode="numeric" maxLength={16} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                    <Building2 className="w-4 h-4" /> Empresa
                  </label>
                  <input type="text" value={company} onChange={(e) => setCompany(onlyLettersAndNumbers(e.target.value))}
                    className={inputClass} placeholder="Sua empresa" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input type="email" value={user?.email || ''} disabled
                  className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed text-base" />
                <p className="text-sm text-gray-600 mt-1.5">O email nao pode ser alterado</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" /> Endereco
                </label>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <input type="text" value={address.rua} onChange={(e) => updateAddress('rua', e.target.value)}
                        className={inputClass} placeholder="Rua" />
                    </div>
                    <div>
                      <input type="text" value={address.numero} onChange={(e) => updateAddress('numero', onlyNumbers(e.target.value))}
                        className={inputClass} placeholder="Numero" inputMode="numeric" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input type="text" value={address.bairro} onChange={(e) => updateAddress('bairro', onlyLetters(e.target.value))}
                      className={inputClass} placeholder="Bairro" />
                    <input type="text" value={address.cidade} onChange={(e) => updateAddress('cidade', onlyLetters(e.target.value))}
                      className={inputClass} placeholder="Cidade" />
                    <input type="text" value={address.cep} onChange={(e) => updateAddress('cep', formatCEP(e.target.value))}
                      className={inputClass} placeholder="CEP" inputMode="numeric" maxLength={9} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'payment' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'cartao', label: 'Cartao', desc: 'Credito/Debito', icon: CreditCard },
                  { id: 'pix', label: 'Pix', desc: 'Transferencia instantanea', icon: CreditCard },
                  { id: 'boleto', label: 'Boleto', desc: 'Pagamento bancario', icon: CreditCard },
                ].map((m) => (
                  <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                    className={`glass rounded-2xl p-5 text-left transition-all duration-200 ${
                      paymentMethod === m.id ? 'border-neon-blue ring-1 ring-neon-blue' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <m.icon className={`w-5 h-5 ${paymentMethod === m.id ? 'text-neon-blue' : 'text-gray-400'}`} />
                      {paymentMethod === m.id && <CheckCircle className="w-5 h-5 text-neon-blue" />}
                    </div>
                    <p className="text-white font-medium text-base">{m.label}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>

              {paymentMethod === 'cartao' && (
                <div className="glass rounded-2xl p-6 lg:p-8 space-y-5">
                  <p className="text-white font-medium text-base">Cartao</p>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Numero do Cartao</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all text-lg"
                      placeholder="0000 0000 0000 0000" inputMode="numeric" maxLength={19} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Nome no Cartao</label>
                    <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all text-lg"
                      placeholder="NOME COMO ESTA NO CARTAO" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Validade</label>
                      <input type="text" value={cardExpiry} onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardExpiry(v);
                      }} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all text-lg"
                        placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                      <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all text-lg"
                        placeholder="***" inputMode="numeric" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="glass rounded-2xl p-6 lg:p-8">
                  <p className="text-gray-400 text-base leading-relaxed">
                    Ao selecionar Pix, voce recebera o codigo QR e a chave Pix no momento da confirmacao da entrega para realizar o pagamento.
                  </p>
                </div>
              )}

              {paymentMethod === 'boleto' && (
                <div className="glass rounded-2xl p-6 lg:p-8">
                  <p className="text-gray-400 text-base leading-relaxed">
                    Ao selecionar Boleto, o boleto bancario sera gerado automaticamente apos a confirmacao da entrega, com vencimento em 3 dias uteis.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-neon-blue" /> Visibilidade do Perfil
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-neon-blue" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Mostrar Nome</p>
                        <p className="text-gray-500 text-sm">Exibe seu nome no perfil e nas entregas</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowName(!showName)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${showName ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${showName ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Mostrar Email</p>
                        <p className="text-gray-500 text-sm">Exibe seu email nas informacoes do perfil</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowEmail(!showEmail)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${showEmail ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${showEmail ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Mostrar Telefone</p>
                        <p className="text-gray-500 text-sm">Exibe seu telefone nas informacoes do perfil</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowPhone(!showPhone)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${showPhone ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${showPhone ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                </div>
              </div>

              <div className="section-divider !h-px"></div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-neon-blue" /> Notificacoes
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bell className="w-5 h-5 text-neon-blue" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Notificacoes por Email</p>
                        <p className="text-gray-500 text-sm">Receba atualizacoes das entregas por email</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setNotifEmail(!notifEmail)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${notifEmail ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${notifEmail ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Notificacoes por SMS</p>
                        <p className="text-gray-500 text-sm">Receba alertas de entregas via SMS</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setNotifSms(!notifSms)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${notifSms ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${notifSms ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between glass rounded-2xl p-5 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bell className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-base">Promocoes e Novidades</p>
                        <p className="text-gray-500 text-sm">Receba ofertas especiais e novidades da DroneXpress</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setNotifPromo(!notifPromo)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${notifPromo ? 'bg-neon-blue' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${notifPromo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                </div>
              </div>

            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div>
                <label className="flex items-center gap-2 text-base text-gray-400 mb-2">
                  <Lock className="w-4 h-4" /> Senha Atual
                </label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass} placeholder="Deixe em branco para nao alterar" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-base text-gray-400 mb-2">Nova Senha</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass} placeholder="Minimo 6 caracteres" minLength={6} />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 text-base"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando...</>
              ) : (
                <><Save className="w-5 h-5" /> Salvar</>
              )}
            </button>

            <button type="button" onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 text-base font-medium">
              <Trash2 className="w-5 h-5" /> Excluir Conta
            </button>
          </div>
        </form>

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setDeleteConfirm(false)}>
            <div className="glass-card rounded-3xl p-8 max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-xl text-center mb-3">Excluir Conta</h3>
              <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita.
                Todas as suas entregas serao removidas permanentemente.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setDeleteConfirm(false)} disabled={deleting}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-medium">
                  Cancelar
                </button>
                <button onClick={handleDeleteAccount} disabled={deleting}
                  className="flex-1 py-3.5 rounded-xl bg-red-500/80 text-white font-semibold hover:bg-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Excluindo...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Excluir</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
