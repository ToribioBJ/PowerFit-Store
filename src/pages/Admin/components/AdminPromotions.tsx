import React from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Promotion } from '../../../interfaces';
import { FaEdit } from 'react-icons/fa';

interface AdminPromotionsProps {
  onEditPromo: (promo: Promotion) => void;
}

const AdminPromotions: React.FC<AdminPromotionsProps> = ({ onEditPromo }) => {
  const { promotions } = useStore();

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const savings = promo.originalPrice - promo.price;
          return (
            <div key={promo.id} className="admin-glass-panel p-5 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-300 hover:-translate-y-1">
              <div>
                {/* Savings Badge */}
                <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.62rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(146,58,43,0.35)] z-10 tracking-widest">
                  Ahorra S/ {savings.toFixed(2)}
                </span>

                {/* Image Preview Area */}
                <div className="relative bg-white rounded-xl overflow-hidden aspect-[16/10] mb-4 flex items-center justify-center p-3 border border-border-brand/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]">
                  <img src={promo.image} alt={promo.name} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>

                <h3 className="font-title font-extrabold text-base mb-2 text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                  {promo.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                  {promo.description}
                </p>

                {/* Products list detail */}
                <div className="bg-primary/50 border border-border-brand/40 p-3.5 rounded-xl mb-4 text-text-primary">
                  <span className="text-[0.62rem] text-text-muted font-bold uppercase tracking-widest block mb-2">Contenido Combo:</span>
                  <div className="flex flex-col gap-1.5">
                    {promo.productsIncluded.map(prod => (
                      <div key={prod.id} className="text-xs text-text-primary/90 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                        {prod.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Pricing block */}
                <div className="flex items-center justify-between mb-4 border-t border-border-brand/35 pt-3.5">
                  <div>
                    <span className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest block">Precio Oferta</span>
                    <span className="text-lg font-title font-black text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">S/ {promo.price.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest block">Original</span>
                    <span className="text-xs font-bold text-text-secondary line-through">S/ {promo.originalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onEditPromo(promo)}
                    className="btn-secondary py-2 px-3 text-[0.7rem] tracking-wider font-extrabold cursor-pointer flex-1"
                  >
                    <FaEdit /> Editar Combo
                  </button>
                  <div className="bg-primary/45 border border-border-brand/40 rounded-xl p-2 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[0.55rem] text-text-muted uppercase font-bold tracking-wider">Stock</span>
                    <span className={`text-xs font-black ${promo.stock <= 5 ? 'text-red-500' : 'text-text-primary'}`}>{promo.stock} u.</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPromotions;
