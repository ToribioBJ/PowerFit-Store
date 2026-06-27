import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChartBar,
  FaBox,
  FaExclamationTriangle,
  FaTags,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
  FaStore
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'products' | 'alerts' | 'promotions' | 'orders';
  setActiveTab: (tab: 'dashboard' | 'products' | 'alerts' | 'promotions' | 'orders') => void;
  lowStockCount: number;
  pendingOrdersCount: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  pendingOrdersCount
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-glass-panel rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 w-full min-w-0 lg:sticky lg:top-[30px] z-20 shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
      <div className="px-1 pb-2 lg:pb-4 border-b border-border-brand/40 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/src/assets/nerito_logo.png"
            alt="NERITO"
            className="h-8 lg:h-10 w-8 lg:w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-brand font-bold text-[1.1rem] lg:text-[1.25rem] tracking-wide text-text-primary uppercase">
            NERITO<span className="text-accent">ADMIN</span>
          </span>
        </Link>
        <span className="text-[0.55rem] lg:text-[0.62rem] bg-accent text-white font-title font-black uppercase px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-full flex items-center gap-1 shadow-glow-accent">
          <FaUserShield className="text-[0.65rem] lg:text-[0.7rem]" />
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-row lg:flex-col gap-1.5 lg:gap-2 w-full overflow-x-auto lg:overflow-visible scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 lg:gap-3.5 w-max lg:w-full px-3.5 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 border-0
            ${activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-accent to-[#A84433] text-white shadow-glow-accent scale-[1.02]'
              : 'text-text-primary hover:bg-primary/15 hover:text-text-primary lg:hover:translate-x-1.5 hover:scale-[1.02]'
            }`}
        >
          <FaChartBar className="text-[1rem] lg:text-[1.1rem]" /> Dashboard
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 lg:gap-3.5 w-max lg:w-full px-3.5 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 border-0
            ${activeTab === 'products'
              ? 'bg-gradient-to-r from-accent to-[#A84433] text-white shadow-glow-accent scale-[1.02]'
              : 'text-text-primary hover:bg-primary/15 hover:text-text-primary lg:hover:translate-x-1.5 hover:scale-[1.02]'
            }`}
        >
          <FaBox className="text-[1rem] lg:text-[1.1rem]" /> Inventario
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center justify-between w-max lg:w-full px-3.5 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 border-0
            ${activeTab === 'alerts'
              ? 'bg-gradient-to-r from-accent to-[#A84433] text-white shadow-glow-accent scale-[1.02]'
              : 'text-text-primary hover:bg-primary/15 hover:text-text-primary lg:hover:translate-x-1.5 hover:scale-[1.02]'
            }`}
        >
          <div className="flex items-center gap-2 lg:gap-3.5">
            <FaExclamationTriangle className="text-[1rem] lg:text-[1.1rem]" /> Alertas Stock
          </div>
          {lowStockCount > 0 && (
            <span className={`w-5 lg:w-6 h-5 lg:h-6 rounded-full flex items-center justify-center text-[0.6rem] lg:text-[0.68rem] font-black transition-colors duration-300
              ${activeTab === 'alerts'
                ? 'bg-white text-accent'
                : 'bg-red-500/10 text-red-500 border border-red-500/25'
              }`}
            >
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`flex items-center gap-2 lg:gap-3.5 w-max lg:w-full px-3.5 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 border-0
            ${activeTab === 'promotions'
              ? 'bg-gradient-to-r from-accent to-[#A84433] text-white shadow-glow-accent scale-[1.02]'
              : 'text-text-primary hover:bg-primary/15 hover:text-text-primary lg:hover:translate-x-1.5 hover:scale-[1.02]'
            }`}
        >
          <FaTags className="text-[1rem] lg:text-[1.1rem]" /> Promociones
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center justify-between w-max lg:w-full px-3.5 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer shrink-0 border-0
            ${activeTab === 'orders'
              ? 'bg-gradient-to-r from-accent to-[#A84433] text-white shadow-glow-accent scale-[1.02]'
              : 'text-text-primary hover:bg-primary/15 hover:text-text-primary lg:hover:translate-x-1.5 hover:scale-[1.02]'
            }`}
        >
          <div className="flex items-center gap-2 lg:gap-3.5">
            <FaClipboardList className="text-[1rem] lg:text-[1.1rem]" /> Pedidos
          </div>
          {pendingOrdersCount > 0 && (
            <span className={`w-5 lg:w-6 h-5 lg:h-6 rounded-full flex items-center justify-center text-[0.6rem] lg:text-[0.68rem] font-black transition-colors duration-300
              ${activeTab === 'orders'
                ? 'bg-white text-accent shadow-sm'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
              }`}
            >
              {pendingOrdersCount}
            </span>
          )}
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="border-t border-border-brand/40 pt-3 lg:pt-4 mt-2 lg:mt-auto flex flex-row lg:flex-col gap-2 w-full">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center lg:justify-start gap-2 lg:gap-3.5 px-3 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer border border-border-brand/40 text-text-primary hover:bg-primary/15 hover:text-text-primary no-underline text-center lg:w-full"
        >
          <FaStore className="text-[1rem] lg:text-[1.1rem]" />
          <span className="hidden sm:inline lg:inline">Volver a </span>Tienda
        </Link>
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center lg:justify-start gap-2 lg:gap-3.5 px-3 py-2.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-title font-black text-[0.72rem] lg:text-[0.8rem] uppercase tracking-widest transition-all duration-300 cursor-pointer border border-red-500/25 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] lg:w-full"
        >
          <FaSignOutAlt className="text-[1rem] lg:text-[1.1rem]" />
          <span className="hidden sm:inline lg:inline">Cerrar Sesión</span>
          <span className="inline sm:hidden lg:hidden">Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
