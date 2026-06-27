import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaTrash, FaSignInAlt, FaSignOutAlt, FaUser, FaUserShield } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/contacto', label: 'Contacto' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginModalOpen(true);
      // Limpiar el estado de ubicación para evitar bucles de redirección
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const prevCartCountRef = useRef(cartCount);
  const autoCloseTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsMiniCartOpen(true);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => setIsMiniCartOpen(false), 3000) as unknown as number;
    }
    prevCartCountRef.current = cartCount;
    return () => { if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current); };
  }, [cartCount]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);



  return (
    <>
      {/* ─── NAV BAR ─────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-[1000] border-b border-white/[0.07] transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-[#0a0a0a] shadow-[0_2px_20px_rgba(0,0,0,0.6)]'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[68px] px-3 min-[380px]:px-5 md:px-10">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 min-[380px]:gap-3 group shrink-0"
            onClick={closeMobileMenu}
          >
            <img
              src="/src/assets/nerito_logo.png"
              alt="NERITO"
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="leading-none">
              <span className="font-brand font-bold text-[1.05rem] min-[380px]:text-[1.25rem] tracking-wide text-white">
                NERITO<span className="text-accent">SUPLEMENTS</span>
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-title font-bold text-[0.8rem] uppercase tracking-[0.12em] px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/6'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">

            {/* Login / User Profile Dropdown (Desktop Only) */}
            {user ? (
              <div 
                className="hidden md:block relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-white/14 hover:border-white/20 transition-all duration-200 text-xs font-title font-extrabold cursor-pointer border-0"
                >
                  <FaUser className="text-[0.75rem] text-accent" />
                  <span className="max-w-[90px] truncate text-[0.75rem] uppercase tracking-wider">{user.username}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 pt-3 w-48 z-[1010] animate-fadeIn">
                    <div className="bg-[#110E0B] border border-white/10 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl p-1.5 flex flex-col gap-1">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[0.75rem] font-bold text-white/80 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-wider"
                        >
                          <FaUserShield className="text-accent text-[0.85rem]" />
                          Panel Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-lg text-[0.75rem] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer border-0 uppercase tracking-wider font-title"
                      >
                        <FaSignOutAlt className="text-[0.8rem]" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-white/14 hover:border-white/20 transition-all duration-200 text-[0.72rem] font-title font-extrabold uppercase tracking-widest cursor-pointer border-0"
                title="Iniciar Sesión"
              >
                <FaSignInAlt className="text-[0.82rem]" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </button>
            )}

            {/* Cart + mini-cart */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
                setIsMiniCartOpen(true);
              }}
              onMouseLeave={() => setIsMiniCartOpen(false)}
            >
              <Link
                to="/carrito"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-white/14 hover:border-white/20 transition-all duration-200"
                title="Ver Carrito"
              >
                <FaShoppingCart className="text-[0.95rem]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white font-title font-black text-[0.6rem] min-w-[17px] h-[17px] rounded-full flex items-center justify-center leading-none shadow-[0_0_12px_rgba(168,60,44,0.7)]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mini-cart dropdown */}
              {isMiniCartOpen && (
                <div 
                  className="absolute top-full right-0 pt-3 w-[340px] hidden sm:block z-[1010]"
                >
                  <div
                    onClick={() => {
                      navigate('/carrito');
                      setIsMiniCartOpen(false);
                    }}
                    className="bg-[#110E0B] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl cursor-pointer hover:border-white/15 transition-all duration-200 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/8">
                      <h3 className="font-title font-extrabold text-[0.9rem] uppercase tracking-wider text-white">
                        Mi Carrito
                      </h3>
                      <span className="text-[0.7rem] font-bold bg-accent/15 text-accent border border-accent/25 px-2 py-0.5 rounded-full">
                        {cartCount} ítem{cartCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {cartItems.length === 0 ? (
                      <p className="text-center py-6 text-white/30 text-sm">Carrito vacío</p>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2.5 max-h-[210px] overflow-y-auto scrollbar-none">
                          {cartItems.map(({ product, quantity }) => {
                            const p = product.price * (1 - product.discount / 100);
                            return (
                              <div 
                                key={product.id} 
                                className="flex items-center gap-3 pb-2.5 border-b border-white/6 last:border-0 last:pb-0"
                              >
                                <div className="w-11 h-11 shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden p-0.5">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[0.82rem] font-bold text-white/90 truncate">{product.name}</p>
                                  <p className="text-[0.72rem] text-accent font-black mt-0.5">S/ {p.toFixed(2)}</p>
                                </div>
                                
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity - 1);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[0.8rem] transition-colors duration-200 cursor-pointer"
                                    title="Disminuir"
                                  >
                                    -
                                  </button>
                                  <span className="text-white font-bold text-[0.8rem] min-w-[14px] text-center">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity + 1);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[0.8rem] transition-colors duration-200 cursor-pointer"
                                    title="Aumentar"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromCart(product.id);
                                    }}
                                    className="text-white/20 hover:text-red-400 transition-colors duration-200 p-1 rounded-lg hover:bg-red-400/8 cursor-pointer ml-1"
                                    title="Eliminar"
                                  >
                                    <FaTrash size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-2.5 border-t border-white/8">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white/40 text-[0.8rem] font-bold uppercase tracking-wider">Total</span>
                            <span className="text-accent font-title font-black text-[1.1rem]">S/ {cartTotal.toFixed(2)}</span>
                          </div>
                          <p className="text-center text-[0.7rem] text-white/30 uppercase tracking-widest mt-1">
                            Haz clic aquí para ver tu carrito
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-white/14 transition-all duration-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <FaTimes className="text-[0.95rem]" /> : <FaBars className="text-[0.95rem]" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU ─────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[998] md:hidden" onClick={closeMobileMenu}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed left-4 right-4 top-[76px] z-[999] md:hidden bg-[#110E0B] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
      >
        {/* Accent line top */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <nav className="flex flex-col p-4 gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center h-12 px-4 rounded-xl font-title font-extrabold text-[0.95rem] uppercase tracking-wide transition-all duration-200 ${isActive
                  ? 'text-white bg-white/10 border border-white/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Auth Section */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-col gap-3">
          {user ? (
            <>
               <div className="flex items-center gap-3 px-3 py-1.5">
                 <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                   <FaUser size={13} />
                 </div>
                 <div className="leading-none">
                   <p className="text-xs font-black text-white/95 uppercase tracking-wide truncate">{user.username}</p>
                   <p className="text-[0.62rem] text-text-secondary truncate mt-1">{user.email}</p>
                 </div>
               </div>
               
               {user.role === 'admin' && (
                 <Link
                   to="/admin"
                   onClick={closeMobileMenu}
                   className="flex items-center justify-center gap-2 h-11 w-full bg-accent/15 border border-accent/25 hover:bg-accent/25 text-white rounded-xl text-xs font-title font-extrabold uppercase tracking-wider transition-all duration-200"
                 >
                   <FaUserShield size={13} className="text-accent" /> Panel Admin
                 </Link>
               )}
               
               <button
                 onClick={() => {
                   logout();
                   closeMobileMenu();
                   navigate('/');
                 }}
                 className="flex items-center justify-center gap-2 h-11 w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-title font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer border-0"
               >
                 <FaSignOutAlt size={13} /> Cerrar Sesión
               </button>
            </>
          ) : (
            <button
              onClick={() => {
                closeMobileMenu();
                setIsLoginModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 h-11 w-full btn-primary text-xs font-title font-extrabold uppercase tracking-wider cursor-pointer border-0"
            >
              <FaSignInAlt size={13} /> Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;
