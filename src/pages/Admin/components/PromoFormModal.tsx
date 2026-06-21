import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Promotion } from '../../../interfaces';
import { FaTimes, FaSave, FaEye } from 'react-icons/fa';

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
}

const PromoFormModal: React.FC<PromoFormModalProps> = ({ isOpen, onClose, promotion }) => {
  const { updatePromotion } = useStore();

  const [promoName, setPromoName] = useState('');
  const [promoPrice, setPromoPrice] = useState(0);
  const [promoOriginalPrice, setPromoOriginalPrice] = useState(0);
  const [promoDescription, setPromoDescription] = useState('');
  const [promoImage, setPromoImage] = useState('/src/assets/PROMOCIONES/PROMOCION1.png');
  const [promoStock, setPromoStock] = useState(10);

  useEffect(() => {
    if (promotion) {
      setPromoName(promotion.name);
      setPromoPrice(promotion.price);
      setPromoOriginalPrice(promotion.originalPrice);
      setPromoDescription(promotion.description);
      setPromoImage(promotion.image);
      setPromoStock(promotion.stock);
    }
  }, [promotion, isOpen]);

  const previewPromo = useMemo<Promotion>(() => {
    return {
      id: promotion ? promotion.id : 999,
      name: promoName || 'Nombre del Combo',
      category: promotion ? promotion.category : 'Promociones',
      price: Number(promoPrice) || 0,
      originalPrice: Number(promoOriginalPrice) || 0,
      brand: promotion ? promotion.brand : 'PowerFit Combos',
      discount: promotion ? promotion.discount : 0,
      image: promoImage || '/src/assets/PROMOCIONES/PROMOCION1.png',
      hoverImage: promotion ? promotion.hoverImage : (promoImage || '/src/assets/PROMOCIONES/PROMOCION1.png'),
      description: promoDescription || 'Descripción del combo promocional.',
      featured: promotion ? promotion.featured : true,
      stock: Number(promoStock) || 0,
      productsIncluded: promotion ? promotion.productsIncluded : [],
      nutrition: promotion ? promotion.nutrition : {
        protein: '0g',
        carbs: '0g',
        fats: '0g',
        calories: '0 kcal'
      }
    };
  }, [
    promotion,
    promoName,
    promoPrice,
    promoOriginalPrice,
    promoDescription,
    promoImage,
    promoStock
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promotion) {
      updatePromotion({
        ...promotion,
        name: promoName,
        price: Number(promoPrice),
        originalPrice: Number(promoOriginalPrice),
        description: promoDescription,
        image: promoImage,
        stock: Number(promoStock)
      });
    }
    onClose();
  };

  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Main Modal Layout (Splits into 2 Column workspace) */}
      <div className="bg-secondary border border-border-brand/40 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh]">

        {/* Modal Left Column: Forms */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border-brand/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-title font-extrabold uppercase text-gradient flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
              Editar Promoción Combo
            </h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-primary/20 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Nombre del Combo</label>
              <input
                type="text"
                required
                placeholder="e.g. Combo Potencia"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={promoName}
                onChange={(e) => setPromoName(e.target.value)}
              />
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Precio Combo (S/)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="389.00"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={promoPrice || ''}
                onChange={(e) => setPromoPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Precio Regular (S/)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="468.00"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={promoOriginalPrice || ''}
                onChange={(e) => setPromoOriginalPrice(Number(e.target.value))}
              />
            </div>

            {/* Stock & Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Stock Promoción</label>
              <input
                type="number"
                required
                min="0"
                placeholder="12"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/85 transition-all duration-300"
                value={promoStock || ''}
                onChange={(e) => setPromoStock(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">URL Imagen</label>
              <input
                type="text"
                required
                placeholder="/src/assets/PROMOCIONES/..."
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={promoImage}
                onChange={(e) => setPromoImage(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Descripción del Combo</label>
              <textarea
                rows={3}
                placeholder="Detalles sobre el pack promocional..."
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none resize-none focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={promoDescription}
                onChange={(e) => setPromoDescription(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div className="md:col-span-2 border-t border-border-brand/30 pt-5 mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary py-2 px-5 text-xs font-extrabold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary py-2 px-5 text-xs font-extrabold shadow-glow cursor-pointer"
              >
                <FaSave /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        {/* Modal Right Column: Live Combo Card Preview */}
        <div className="hidden lg:flex lg:w-[380px] bg-primary/30 p-6 md:p-8 flex-col justify-center items-center gap-4 relative overflow-y-auto border-l border-border-brand/40 shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(146,58,43,0.06)_0%,transparent_75%)] pointer-events-none" />
          <div className="absolute top-4 left-4 text-[0.62rem] uppercase font-black tracking-widest text-accent bg-accent/15 border border-accent/25 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(146,58,43,0.2)] animate-pulse">
            <FaEye /> Vista Previa en Vivo
          </div>

          {/* Combo Card styled identically to storefront */}
          <div className="relative w-full max-w-[280px] mt-6 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-accent to-[#b34835] rounded-2xl blur-md opacity-15 pointer-events-none" />
            <div className="admin-glass-panel p-5 flex flex-col justify-between relative bg-gradient-to-b from-[#18110f]/80 to-[#0e0b0a] border border-border-brand/40 rounded-2xl w-full h-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div>
                {/* Savings Badge */}
                <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.62rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(146,58,43,0.35)] z-10 tracking-widest">
                  Ahorra S/ {(previewPromo.originalPrice - previewPromo.price).toFixed(2)}
                </span>
                {/* Image */}
                <div className="relative bg-white rounded-xl overflow-hidden aspect-[16/10] mb-4 flex items-center justify-center p-3 border border-border-brand/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]">
                  <img src={previewPromo.image} alt={previewPromo.name} className="max-w-[80%] max-h-[80%] object-contain" />
                </div>
                <h3 className="font-title font-extrabold text-sm mb-1 text-text-primary leading-tight">
                  {previewPromo.name}
                </h3>
                <p className="text-[0.7rem] text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                  {previewPromo.description}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4 border-t border-border-brand/30 pt-3">
                  <div>
                    <span className="text-[0.55rem] text-text-muted uppercase font-bold tracking-widest block">Precio Combo</span>
                    <span className="text-base font-title font-black text-accent">S/ {previewPromo.price.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.55rem] text-text-muted uppercase font-bold tracking-widest block">Original</span>
                    <span className="text-[0.7rem] font-bold text-text-secondary line-through">S/ {previewPromo.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-primary/50 border border-border-brand/40 rounded-xl p-2.5">
                  <span className="text-[0.62rem] text-text-secondary font-bold">Stock Combo:</span>
                  <span className={`text-xs font-black ${previewPromo.stock <= 5 ? 'text-red-500' : 'text-text-primary'}`}>{previewPromo.stock} u.</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest text-center mt-3 max-w-[240px] leading-relaxed">
            Esta tarjeta se renderiza con el estilo de combo de la tienda
          </p>
        </div>

      </div>
    </div>
  );
};

export default PromoFormModal;
