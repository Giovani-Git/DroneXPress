import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, User, Mail, Lock, Phone, Building2, MapPin, CreditCard, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { onlyLetters, onlyNumbers, onlyLettersAndNumbers, formatCEP, formatPhone, validatePhone } from '../utils/validation';

const emptyAddress = { rua: '', numero: '', bairro: '', cidade: '', cep: '' };

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState({ ...emptyAddress });
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep1() {
    if (!name || !email || !password || !confirm) {
      setError('Preencha todos os campos');
      return false;
    }
    if (password !== confirm) {
      setError('Senhas nao conferem');
      return false;
    }
    if (password.length < 6) {
      setError('Senha deve ter no minimo 6 caracteres');
      return false;
    }
    return true;
  }

  function goToStep2(e) {
    e.preventDefault();
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      login(data.user, data.token);
      const payload = { name, phone, company, address, paymentMethod };
      await api.updateProfile(payload).catch(() => {});
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:bg-white/[0.08] transition-all text-base";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-6 pt-24 pb-16">
      <div className="glass-card rounded-3xl p-8 lg:p-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold neon-text inline-flex items-center gap-2">
            <Star className="w-5 h-5 text-neon-blue" /> DroneXPress
          </Link>
          <p className="text-gray-400 mt-2 text-lg">Crie sua conta</p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${step === 1 ? 'gradient-bg text-white' : 'text-gray-500'}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">{step > 1 ? <Check className="w-3 h-3" /> : '1'}</span>
              Dados
            </div>
            <div className="w-8 h-px bg-white/10" />
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${step === 2 ? 'gradient-bg text-white' : 'text-gray-500'}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">2</span>
              Endereco
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-6 text-sm leading-relaxed">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={goToStep2} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <User className="w-4 h-4" /> Nome
              </label>
              <input type="text" value={name} onChange={(e) => setName(onlyLetters(e.target.value))}
                className={inputClass} placeholder="Seu nome completo" required />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className={inputClass} placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Lock className="w-4 h-4" /> Senha
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className={inputClass} placeholder="Minimo 6 caracteres" minLength={6} required />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Lock className="w-4 h-4" /> Confirmar Senha
              </label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className={inputClass} placeholder="Repita a senha" minLength={6} required />
            </div>
            <button type="submit"
              className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 text-base flex items-center justify-center gap-2">
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Phone className="w-4 h-4" /> Telefone
                </label>
                <input type="text" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className={inputClass} placeholder="(54) 99999-0000" inputMode="numeric" maxLength={16} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Building2 className="w-4 h-4" /> Empresa
                </label>
                <input type="text" value={company} onChange={(e) => setCompany(onlyLettersAndNumbers(e.target.value))}
                  className={inputClass} placeholder="Opcional" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MapPin className="w-4 h-4" /> Endereco
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={address.rua} onChange={(e) => updateAddress('rua', e.target.value)}
                    className="col-span-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue text-base" placeholder="Rua" required />
                  <input type="text" value={address.numero} onChange={(e) => updateAddress('numero', onlyNumbers(e.target.value))}
                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue text-base" placeholder="Numero" inputMode="numeric" required />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={address.bairro} onChange={(e) => updateAddress('bairro', onlyLetters(e.target.value))}
                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue text-base" placeholder="Bairro" required />
                  <input type="text" value={address.cidade} onChange={(e) => updateAddress('cidade', onlyLetters(e.target.value))}
                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue text-base" placeholder="Cidade" required />
                  <input type="text" value={address.cep} onChange={(e) => updateAddress('cep', formatCEP(e.target.value))}
                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue text-base" placeholder="CEP" inputMode="numeric" maxLength={9} />
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <CreditCard className="w-4 h-4" /> Metodo de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['cartao', 'pix', 'boleto'].map((m) => (
                  <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                      paymentMethod === m ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                    }`}>
                    {m === 'cartao' ? 'Cartao' : m === 'pix' ? 'Pix' : 'Boleto'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all duration-200 text-base flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 text-base flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Cadastrando...</>
                ) : (
                  <><Check className="w-4 h-4" /> Criar Conta</>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Ja tem conta?{' '}
          <Link to="/login" className="text-neon-blue hover:underline font-medium">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}