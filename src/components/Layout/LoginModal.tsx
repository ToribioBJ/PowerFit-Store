import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaUserShield, FaUserCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (success) {
        onClose();
        setUsername('');
        setPassword('');
        const normalizedUser = username.trim().toLowerCase();
        if (normalizedUser === 'admin') {
          navigate('/admin');
        }
      } else {
        setError('Credenciales inválidas. Inténtelo de nuevo o use un atajo.');
      }
    }, 800);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      {/* Modal Card container */}
      <div className="max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <div className="admin-glass-panel p-6 sm:p-8 rounded-3xl border border-border-brand/40 shadow-2xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-[#b34835] rounded-3xl blur opacity-5 pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-primary/20 transition-all cursor-pointer border-0 bg-transparent"
            title="Cerrar"
          >
            <FaTimes size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <img
              className="mx-auto h-12 w-12 object-contain drop-shadow-[0_0_15px_rgba(168,60,44,0.3)]"
              src="/src/assets/nerito_logo.png"
              alt="NERITO SUPLEMENTS"
            />
            <h2 className="mt-2 text-2xl font-brand font-black text-gradient uppercase tracking-wide">
              Iniciar Sesión
            </h2>
            <p className="mt-1 text-[0.65rem] text-text-secondary tracking-widest uppercase">
              Ingresa a tu cuenta de PowerFit Store
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/35 text-red-500 text-xs font-bold py-2.5 px-4 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.62rem] uppercase text-text-secondary font-black tracking-widest">
                Usuario / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted/60">
                  <FaUser size={12} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin o tu nombre"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2 pl-9 pr-4 w-full rounded-xl text-xs outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.62rem] uppercase text-text-secondary font-black tracking-widest">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted/60">
                  <FaLock size={12} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2 pl-9 pr-9 w-full rounded-xl text-xs outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted/60 hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent"
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 text-[0.7rem] font-extrabold uppercase tracking-widest shadow-glow cursor-pointer border-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  Iniciar Sesión <FaSignInAlt />
                </span>
              )}
            </button>
          </form>

          {/* Quick Access Shortcuts */}
          <div className="mt-6 pt-5 border-t border-border-brand/35">
            <p className="text-[0.55rem] text-text-secondary uppercase font-bold tracking-widest text-center mb-2.5">
              Acceso Rápido de Prueba (Simulado)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="flex items-center justify-center gap-1 bg-[#923a2b]/10 border border-[#923a2b]/25 hover:bg-[#923a2b]/20 text-[#c96251] py-1.5 px-2 rounded-xl text-[0.62rem] font-bold uppercase transition-all cursor-pointer"
              >
                <FaUserShield size={10} /> Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('cliente', 'cliente123')}
                className="flex items-center justify-center gap-1 bg-[#847c69]/10 border border-[#847c69]/25 hover:bg-[#847c69]/20 text-text-secondary py-1.5 px-2 rounded-xl text-[0.62rem] font-bold uppercase transition-all cursor-pointer"
              >
                <FaUserCheck size={10} /> Cliente Demo
              </button>
            </div>
            <p className="text-[0.55rem] text-text-muted text-center mt-2.5 leading-relaxed">
              Cualquier otro usuario (mín. 3 letras) y contraseña (mín. 4) se ingresará como Cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
