import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Promotion } from '../../../interfaces';
import { FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface AdminPromotionsProps {
  onEditPromo: (promo: Promotion) => void;
}

const AdminPromotions: React.FC<AdminPromotionsProps> = ({ onEditPromo }) => {
  const { promotions } = useStore();

  // 3D Carousel Preview logic
  const [activeStory, setActiveStory] = useState(0);
  const totalStories = promotions.length;

  const nextStory = () => {
    setActiveStory((prev) => (prev === totalStories - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev === 0 ? totalStories - 1 : prev - 1));
  };

  const getCircularOffset = (index: number, active: number, total: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* ─── CARRUSEL PREVIEW SECTION ───────────────────────────── */}
      {promotions.length > 0 && (
        <div className="admin-glass-panel p-6 flex flex-col items-center gap-4 relative overflow-hidden border border-border-brand/40 shadow-glow-gold/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(146,58,43,0.04)_0%,transparent_75%)] pointer-events-none" />
          
          <div className="w-full flex justify-between items-center z-10">
            <div>
              <h3 className="text-sm font-title font-black uppercase text-gradient tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                Previsualización en Vivo: Carrusel de Tienda
              </h3>
              <p className="text-[0.62rem] text-text-secondary uppercase tracking-widest mt-0.5">
                Así es como se visualizan los banners en la portada del cliente (escala 3D)
              </p>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex gap-2">
              <button
                onClick={prevStory}
                className="w-7 h-7 rounded-lg bg-primary/45 border border-border-brand/30 hover:border-accent text-text-primary hover:text-accent flex items-center justify-center transition-all cursor-pointer text-xs"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextStory}
                className="w-7 h-7 rounded-lg bg-primary/45 border border-border-brand/30 hover:border-accent text-text-primary hover:text-accent flex items-center justify-center transition-all cursor-pointer text-xs"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Interactive 3D Stack container */}
          <div className="relative w-full max-w-lg h-[240px] mt-2 flex items-center justify-center">
            {promotions.map((promo, index) => {
              const offset = getCircularOffset(index, activeStory, totalStories);
              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;

              // Spacing matching scaling
              const translateX = offset * 9.5; // rem spacing
              const scale = isActive ? 1.05 : 0.78;
              const zIndex = isActive ? 30 : 10;
              const opacity = isActive ? 1 : Math.abs(offset) <= 1 ? 0.45 : 0;
              const blur = isActive ? '0px' : '1px';

              return (
                <div
                  key={promo.id}
                  onClick={() => {
                    if (isPrev) prevStory();
                    if (isNext) nextStory();
                  }}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}rem) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `blur(${blur})`,
                  }}
                  className={`absolute top-1/2 left-1/2 w-[125px] h-[220px] rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition-all duration-500 ease-in-out cursor-pointer select-none flex flex-col border
                    ${isActive
                      ? 'border-accent shadow-[0_0_20px_rgba(146,58,43,0.45)]'
                      : 'border-border-brand/25'
                    }`}
                >
                  <img
                    src={promo.image}
                    alt={promo.name}
                    className="w-full h-full object-cover block"
                  />
                  
                  {/* Overlay on Active */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080605] via-black/40 to-transparent pt-10 pb-3 px-2 flex flex-col items-center justify-end text-center">
                    <span className="text-[0.62rem] text-accent font-black tracking-wide truncate max-w-full">
                      S/ {promo.price.toFixed(2)}
                    </span>
                    {isActive && (
                      <span className="text-[0.45rem] text-white/40 uppercase font-bold tracking-widest mt-0.5 animate-pulse">
                        ACTIVO
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* promotions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const savings = promo.originalPrice - promo.price;
          return (
            <div tabIndex={0} key={promo.id} className="admin-glass-panel relative overflow-hidden h-[400px] rounded-2xl border border-border-brand/40 group hover:border-accent/50 hover:shadow-glow-accent focus-within:border-accent/50 focus-within:shadow-glow-accent outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              
              {/* Shimmer light effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-30" />

              {/* Savings Badge */}
              <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.62rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(146,58,43,0.35)] z-10 tracking-widest pointer-events-none">
                Ahorra S/ {savings.toFixed(2)}
              </span>

              {/* Image Container with Ambient Glowing Halo */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1411] to-[#0c0908] flex items-center justify-center p-6 transition-all duration-500 overflow-hidden">
                <div className="absolute w-[240px] h-[240px] rounded-full bg-accent/15 blur-[60px] pointer-events-none" />
                <img 
                  src={promo.image} 
                  alt={promo.name} 
                  className="max-w-[95%] max-h-[95%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] rounded-lg transition-transform duration-500 group-hover:scale-103" 
                />
              </div>

              {/* Details Overlay (slides up and fades in on hover/focus) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1210]/98 via-[#130d0b]/99 to-[#0a0706] p-5 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 group-active:translate-y-0 border-t border-accent/25 z-20 overflow-y-auto scrollbar-none">
                <div className="flex flex-col gap-3">
                  <h3 className="font-title font-extrabold text-base text-white leading-tight">
                    {promo.name}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-4 font-sans">
                    {promo.description}
                  </p>

                  {/* High Contrast Products list detail rendered as solid red pills */}
                  <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl text-white shadow-inner">
                    <span className="text-[0.62rem] text-white/50 font-black uppercase tracking-widest block mb-2.5">
                      Contenido del Combo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {promo.productsIncluded.map(prod => (
                        <span key={prod.id} className="text-[0.62rem] bg-accent text-white px-2.5 py-1.5 rounded-lg font-black flex items-center gap-1.5 uppercase tracking-wider shadow-[0_2px_8px_rgba(146,58,43,0.35)] border border-white/10 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                          {prod.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Pricing block with glowing background orb */}
                  <div className="flex items-center justify-between mb-4 border-t border-white/10 pt-3.5 relative">
                    <div className="absolute right-0 bottom-2 w-16 h-16 rounded-full bg-accent/10 blur-xl pointer-events-none" />
                    <div>
                      <span className="text-[0.55rem] text-white/50 uppercase font-bold tracking-widest block leading-none">Precio Oferta</span>
                      <span className="text-xl font-title font-black text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.3)] mt-1.5 block">S/ {promo.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[0.55rem] text-white/50 uppercase font-bold tracking-widest block leading-none">Original</span>
                      <span className="text-xs font-bold text-white/40 line-through mt-2 block">S/ {promo.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                    <button
                      onClick={() => onEditPromo(promo)}
                      className="btn-primary py-2 px-4 text-[0.7rem] tracking-wider font-extrabold cursor-pointer flex-1 border-0"
                    >
                      <FaEdit size={12} /> Editar Combo
                    </button>
                    <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[0.55rem] text-white/40 uppercase font-bold tracking-wider leading-none">Stock</span>
                      <span className={`text-xs font-black mt-1 leading-none ${promo.stock <= 5 ? 'text-red-400' : 'text-white'}`}>{promo.stock} u.</span>
                    </div>
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

