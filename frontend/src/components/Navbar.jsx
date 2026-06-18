import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const isAdmin = user?.role === 'admin';

  function handleLogout() {
    logout();
    navigate('/');
  }

  const linkClass = (path) =>
    `transition-colors duration-200 ${location.pathname === path ? 'text-neon-blue' : 'text-gray-300 hover:text-neon-blue'}`;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/deliveries', label: 'Entregas' },
        { to: '/drones', label: 'Drones' },
        { to: '/profile', label: 'Perfil' },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
      ]
    : [];

  const landingLinks = [
    { href: '#inovacao', label: 'Inovacao' },
    { href: '#publico', label: 'Publico' },
    { href: '#persona', label: 'Persona' },
    { href: '#jornada', label: 'Jornada' },
    { href: '#sustentabilidade', label: 'Sustentabilidade' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'glass' : 'bg-dark-bg/95 backdrop-blur-xl border-b border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 text-xl lg:text-2xl font-bold neon-text">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm font-bold">DX</div>
            DroneXPress
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isLanding && !user && landingLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-gray-400 hover:text-neon-blue transition-colors duration-200 text-sm font-medium whitespace-nowrap">
                {l.label}
              </a>
            ))}
            {isLanding && user && (
              <Link to="/dashboard" className="text-gray-400 hover:text-neon-blue transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
            {!isLanding && navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={`${linkClass(l.to)} text-sm font-medium`}>
                {l.label}
              </Link>
            ))}
            <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex-shrink-0" title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-gray-500 text-sm truncate max-w-[120px]">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-all duration-200 flex-shrink-0"
              >
                <User className="w-4 h-4" /> Entrar
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-6 space-y-1 border-t border-white/5 pt-4">
            {isLanding && !user && landingLinks.map((l) => (
              <a key={l.href} href={l.href} className="block px-4 py-2.5 text-gray-400 hover:text-neon-blue transition-colors text-sm" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            {isLanding && user && (
              <Link to="/dashboard" className="block px-4 py-2.5 text-gray-300 hover:text-neon-blue text-sm" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            {!isLanding && navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="block px-4 py-2.5 text-gray-300 hover:text-neon-blue transition-colors text-sm" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-red-400 text-sm mt-2">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            )}
            {!user && (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 text-neon-blue text-sm mt-2" onClick={() => setMenuOpen(false)}>
                <User className="w-4 h-4" /> Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
