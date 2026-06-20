import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaExclamationTriangle, FaCheckCircle, FaDumbbell, FaAppleAlt, FaFire, FaBolt } from 'react-icons/fa';
import promotionsData from '../../data/promotions.json';
import type { Promotion, Product } from '../../interfaces';
import { useCart } from '../../context/CartContext';

const PromotionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const promotions: Promotion[] = promotionsData as Promotion[];
  const { addToCart } = useCart();

  // Find promotion by id
  const promotion = promotions.find((p) => p.id === Number(id));

  // State for quantity selection
  const [qty, setQty] = useState(1);

  // Reset state and scroll to top when promotion ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
  }, [id]);

  if (!promotion) {
    return (
      <div className="py-10 md:py-20 min-h-screen container">
        <div className="text-center py-24 px-6">
          <FaExclamationTriangle className="text-[3rem] text-red-500 mb-4 mx-auto" />
          <h1 className="text-3xl mb-4 font-title font-extrabold text-text-primary">Promoción no encontrada</h1>
          <p className="text-text-secondary mb-8">El combo o promoción que buscas no existe o ha expirado.</p>
          <Link to="/" className="btn-primary">
            Volver a Inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    if (qty < promotion.stock) {
      setQty(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = () => {
    // Cast Promotion to Product to work seamlessly with the Cart Context
    addToCart(promotion as unknown as Product, qty);
  };

  const isOutOfStock = promotion.stock === 0;

  // Filter other promotions
  const otherPromotions = promotions.filter((p) => p.id !== promotion.id);

  return (
    <div className="py-6 md:py-12 min-h-screen container animate-fadeIn relative">
      {/* Decorative glowing blobs for high-end dimensional feel */}
      <div className="absolute top-10 left-1/4 w-[250px] h-[250px] rounded-full blur-[100px] opacity-10 pointer-events-none z-0 bg-accent/40" />
      <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-10 pointer-events-none z-0 bg-[#A84433]/30" />

      <div className="relative z-10 max-w-[920px] mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary font-semibold text-[0.9rem] mb-6 transition-all duration-200 hover:text-accent hover:-translate-x-1">
          <FaArrowLeft /> Volver a Inicio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-start justify-center">
          {/* Left Side: Large Promotion Image & Combo details */}
          <div className="flex flex-col gap-5 max-w-[340px] lg:max-w-none mx-auto w-full">
            <div className="card-premium aspect-[2/3] relative w-full flex flex-col justify-center p-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(146,58,43,0.2)] hover:border-accent/60 group">
              <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.75rem] uppercase py-1 px-3 rounded-lg shadow-[0_4px_10px_rgba(146,58,43,0.4)] z-10 tracking-wider">
                ¡SUPER PACK!
              </span>
              <div className="bg-[#0a0807] rounded-xl flex items-center justify-center h-full w-full p-2 border border-border-brand/20 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(146,58,43,0.1)_0%,transparent_80%)] pointer-events-none" />
                <img
                  src={promotion.image}
                  alt={promotion.name}
                  className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* List of Products Included */}
            <div className="bg-secondary/40 backdrop-blur-md border border-border-brand/40 rounded-xl p-5 shadow-md">
              <h3 className="text-[1.05rem] uppercase font-title font-extrabold text-text-primary mb-3.5 border-b border-border-brand/35 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-accent rounded-full"></span>
                ¿Qué incluye este Combo?
              </h3>
              <div className="flex flex-col gap-3">
                {promotion.productsIncluded.map((prod) => (
                  <div key={prod.id} className="flex items-center gap-3.5 bg-primary/50 backdrop-blur-sm p-3 rounded-xl border border-border-brand/30 hover:border-accent/40 hover:bg-primary/80 transition-all duration-300 group/item">
                    <div className="w-12 h-12 shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 border border-border-brand/10 transition-transform duration-300 group-hover/item:scale-105">
                      <img src={prod.image} alt={prod.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-title font-bold text-[0.9rem] text-text-primary truncate transition-colors duration-300 group-hover/item:text-accent">{prod.name}</h4>
                      <p className="text-[0.7rem] text-accent font-bold uppercase tracking-wider">{prod.brand}</p>
                    </div>
                    <FaCheckCircle className="text-emerald-500 shrink-0 text-base mr-1 transition-transform duration-300 group-hover/item:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Promotion Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[0.8rem] text-accent uppercase font-black tracking-wider block mb-0.5">PROMO EXCLUSIVA</span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.25rem] font-title font-black leading-none uppercase text-gradient">{promotion.name}</h1>
            </div>

            {/* Pricing (Glassmorphic Container) */}
            <div className="bg-secondary/35 border border-border-brand/35 rounded-xl p-4 md:p-5 shadow-sm backdrop-blur-xs flex flex-col gap-3">
              <div>
                <span className="text-[0.75rem] text-text-muted uppercase font-bold tracking-widest block mb-0.5">Precio Combo</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-text-muted text-[1.2rem] font-semibold line-through">
                    S/ {promotion.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-accent font-title text-[2.1rem] font-black leading-none drop-shadow-[0_2px_10px_rgba(146,58,43,0.3)]">
                    S/ {promotion.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-[0.72rem] text-text-muted uppercase font-bold tracking-wider border-t border-border-brand/20 pt-2.5">
                * Envío express disponible en este combo • Stock limitado
              </p>
            </div>

            {/* Description Card */}
            <div className="bg-secondary/15 p-4 md:p-5 rounded-xl border border-border-brand/20">
              <h3 className="text-[1.05rem] uppercase font-title font-extrabold text-text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-accent rounded-full"></span>
                Descripción del Pack
              </h3>
              <p className="text-[0.9rem] text-text-secondary leading-relaxed">{promotion.description}</p>
            </div>

            {/* Table Nutritional Info */}
            {promotion.nutrition && (
              <div className="bg-secondary/40 backdrop-blur-md border border-border-brand/40 rounded-xl p-5 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-accent to-[#A84433]"></div>
                <h3 className="text-[1.05rem] uppercase font-title font-extrabold text-text-primary mb-3.5 pl-3 tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                  Información Nutricional Promedio (por servicio)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  
                  {/* Proteína */}
                  <div className="bg-primary/60 border border-border-brand/40 rounded-xl p-3 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_12px_rgba(146,58,43,0.15)] flex flex-col items-center gap-1 group/nutri">
                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-300 group-hover/nutri:scale-110">
                      <FaDumbbell className="text-[0.85rem]" />
                    </div>
                    <div className="font-title text-[1.25rem] font-black text-text-primary mt-0.5">{promotion.nutrition.protein}</div>
                    <div className="text-[0.65rem] text-text-muted uppercase font-bold tracking-wider">Proteína</div>
                  </div>

                  {/* Carbohidratos */}
                  <div className="bg-primary/60 border border-border-brand/40 rounded-xl p-3 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_12px_rgba(146,58,43,0.15)] flex flex-col items-center gap-1 group/nutri">
                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-300 group-hover/nutri:scale-110">
                      <FaAppleAlt className="text-[0.85rem]" />
                    </div>
                    <div className="font-title text-[1.25rem] font-black text-text-primary mt-0.5">{promotion.nutrition.carbs}</div>
                    <div className="text-[0.65rem] text-text-muted uppercase font-bold tracking-wider">Carbos</div>
                  </div>

                  {/* Grasas */}
                  <div className="bg-primary/60 border border-border-brand/40 rounded-xl p-3 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_12px_rgba(146,58,43,0.15)] flex flex-col items-center gap-1 group/nutri">
                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-300 group-hover/nutri:scale-110">
                      <FaFire className="text-[0.85rem]" />
                    </div>
                    <div className="font-title text-[1.25rem] font-black text-text-primary mt-0.5">{promotion.nutrition.fats}</div>
                    <div className="text-[0.65rem] text-text-muted uppercase font-bold tracking-wider">Grasas</div>
                  </div>

                  {/* Calorías */}
                  <div className="bg-primary/60 border border-border-brand/40 rounded-xl p-3 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_12px_rgba(146,58,43,0.15)] flex flex-col items-center gap-1 group/nutri">
                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform duration-300 group-hover/nutri:scale-110">
                      <FaBolt className="text-[0.85rem]" />
                    </div>
                    <div className="font-title text-[1.25rem] font-black text-text-primary mt-0.5">{promotion.nutrition.calories}</div>
                    <div className="text-[0.65rem] text-text-muted uppercase font-bold tracking-wider">Calorías</div>
                  </div>

                </div>
              </div>
            )}

            {/* Actions Section */}
            {!isOutOfStock ? (
              <div className="bg-secondary/20 border border-border-brand/30 rounded-xl p-4 md:p-5 shadow-sm flex items-center gap-4 flex-wrap">
                <div className="flex items-center bg-primary/65 border border-border-brand/50 rounded-lg overflow-hidden h-10 shadow-inner">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-full flex items-center justify-center text-[1.1rem] text-text-secondary transition-all duration-200 hover:enabled:bg-accent/15 hover:enabled:text-accent disabled:text-text-muted/40 disabled:cursor-not-allowed font-extrabold cursor-pointer"
                    disabled={qty <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-[40px] bg-transparent text-center text-text-primary font-title font-black text-[1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                    aria-label="Cantidad seleccionada"
                  />
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-full flex items-center justify-center text-[1.1rem] text-text-secondary transition-all duration-200 hover:enabled:bg-accent/15 hover:enabled:text-accent disabled:text-text-muted/40 disabled:cursor-not-allowed font-extrabold cursor-pointer"
                    disabled={qty >= promotion.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="btn-primary h-10 px-6 flex-grow md:max-w-[240px] w-full cursor-pointer flex items-center justify-center gap-2 text-[0.85rem] shadow-glow hover:shadow-glow-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <FaShoppingCart /> Añadir al Carrito
                </button>
              </div>
            ) : (
              <div className="bg-secondary/20 border border-border-brand/30 rounded-xl p-4 md:p-5 shadow-sm">
                <span className="text-red-500 font-title font-black text-[0.9rem] uppercase tracking-wider bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-xl w-full text-center block">
                  Agotado Temporalmente
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Other Promotions */}
        <section className="mt-14 border-t border-border-brand/40 pt-10">
          <h2 className="text-2xl font-title font-black uppercase text-gradient mb-8 text-center">
            Otras Promociones Disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {otherPromotions.map((p) => {
              const currentSavings = p.originalPrice - p.price;
              return (
                <article key={p.id} className="card-premium flex flex-col justify-between group p-4">
                  <div className="relative bg-white rounded-xl overflow-hidden mb-4 aspect-[16/10] flex items-center justify-center p-3 border border-border-brand/10">
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.6rem] uppercase py-1 px-2.5 rounded shadow z-10 tracking-wider">
                      AHORRA S/ {currentSavings.toFixed(2)}
                    </span>
                    <img src={p.image} alt={p.name} className="max-w-[85%] max-h-[85%] object-contain transition-all duration-500 group-hover:scale-105" />
                  </div>
                  <div>
                    <h3 className="text-[1.15rem] mb-1.5 leading-snug font-title font-extrabold text-text-primary group-hover:text-accent transition-colors duration-300">{p.name}</h3>
                    <p className="text-[0.8rem] text-text-secondary line-clamp-2 mb-3">{p.description}</p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-end">
                      <span className="text-text-muted text-[0.9rem] line-through font-semibold">S/ {p.originalPrice.toFixed(2)}</span>
                      <span className="font-title font-black text-accent text-[1.2rem]">S/ {p.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link to={`/promocion/${p.id}`} className="w-full btn-secondary text-center py-2 text-[0.75rem] tracking-wider uppercase font-extrabold">
                    Ver Detalles Combo
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PromotionDetail;
