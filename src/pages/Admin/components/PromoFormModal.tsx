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


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
            {/* Imagen con File Uploader */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <div className="flex justify-between items-center">
                <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Imagen Promocional</label>
              </div>
              <div className="flex items-center gap-3 bg-primary/30 p-2.5 border border-border-brand/40 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-white border border-border-brand/35 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                  {promoImage ? (
                    <img src={promoImage} alt="Promo preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[0.6rem] text-text-muted">Sin img</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-[0.7rem] font-title font-black uppercase px-3 py-2.5 rounded-lg cursor-pointer transition-all shadow-sm border-0 text-center">
                    Seleccionar Archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setPromoImage)}
                    />
                  </label>
                </div>
              </div>
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
                      <div tabIndex={0} className="admin-glass-panel relative overflow-hidden h-[400px] rounded-2xl border border-border-brand/40 group hover:border-accent/50 hover:shadow-glow-accent focus-within:border-accent/50 focus-within:shadow-glow-accent outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full">
              {/* Shimmer light effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-30" />

              {/* Savings Badge */}
              <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.62rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(146,58,43,0.35)] z-10 tracking-widest pointer-events-none">
                Ahorra S/ {(previewPromo.originalPrice - previewPromo.price).toFixed(2)}
              </span>

              {/* Image Container with Ambient Glowing Halo */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1411] to-[#0c0908] flex items-center justify-center p-6 transition-all duration-500 overflow-hidden">
                <div className="absolute w-[240px] h-[240px] rounded-full bg-accent/15 blur-[60px] pointer-events-none" />
                <img 
                  src={previewPromo.image} 
                  alt={previewPromo.name} 
                  className="max-w-[95%] max-h-[95%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] rounded-lg transition-transform duration-500 group-hover:scale-103" 
                />
              </div>

              {/* Details Overlay (slides up and fades in on hover/focus) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1210]/98 via-[#130d0b]/99 to-[#0a0706] p-5 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 group-active:translate-y-0 border-t border-accent/25 z-20 overflow-y-auto scrollbar-none">
                <div className="flex flex-col gap-3">
                  <h3 className="font-title font-extrabold text-base text-white leading-tight text-left">
                    {previewPromo.name}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-4 font-sans text-left">
                    {previewPromo.description}
                  </p>

                  {/* High Contrast Products list detail rendered as solid red pills */}
                  <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl text-white shadow-inner text-left">
                    <span className="text-[0.62rem] text-white/50 font-black uppercase tracking-widest block mb-2.5">
                      Contenido del Combo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewPromo.productsIncluded && previewPromo.productsIncluded.length > 0 ? (
                        previewPromo.productsIncluded.map(prod => (
                          <span key={prod.id} className="text-[0.62rem] bg-accent text-white px-2.5 py-1.5 rounded-lg font-black flex items-center gap-1.5 uppercase tracking-wider shadow-[0_2px_8px_rgba(146,58,43,0.35)] border border-white/10 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                            {prod.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[0.62rem] text-white/40 italic">Ningún producto asignado</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Pricing block with glowing background orb */}
                  <div className="flex items-center justify-between mb-4 border-t border-white/10 pt-3.5 relative">
                    <div className="absolute right-0 bottom-2 w-16 h-16 rounded-full bg-accent/10 blur-xl pointer-events-none" />
                    <div className="text-left">
                      <span className="text-[0.55rem] text-white/50 uppercase font-bold tracking-widest block leading-none">Precio Combo</span>
                      <span className="text-xl font-title font-black text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.3)] mt-1.5 block">S/ {previewPromo.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[0.55rem] text-white/50 uppercase font-bold tracking-widest block leading-none">Original</span>
                      <span className="text-xs font-bold text-white/40 line-through mt-2 block">S/ {previewPromo.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                    <div className="btn-primary py-2 px-4 text-[0.7rem] tracking-wider font-extrabold text-center opacity-75 select-none border-0">
                      Añadir al Carrito
                    </div>
                    <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[0.55rem] text-white/40 uppercase font-bold tracking-wider leading-none">Stock</span>
                      <span className={`text-xs font-black mt-1 leading-none ${previewPromo.stock <= 5 ? 'text-red-400' : 'text-white'}`}>{previewPromo.stock} u.</span>
                    </div>
                  </div>
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
