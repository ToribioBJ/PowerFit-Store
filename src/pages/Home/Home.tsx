import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShippingFast,
  FaAward,
  FaWhatsapp
} from 'react-icons/fa';
import type { Product } from '../../interfaces';
import { useStore } from '../../context/StoreContext';

const FeaturedProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const finalPrice = product.price * (1 - product.discount / 100);
  const hasDiscount = product.discount > 0;

  return (
    <article
      className="flex flex-col h-full card-premium group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl overflow-hidden mb-5 aspect-square flex items-center justify-center p-6 border border-border-brand/10 transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]">
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-text-secondary to-[#d5c7b5] text-primary font-title font-black text-[0.7rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(0,0,0,0.35)] z-10 tracking-wider">
            Destacado
          </span>
        )}
        {hasDiscount && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.7rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_12px_rgba(146,58,43,0.45)] z-10 tracking-wider">
            {product.discount}% OFF
          </span>
        )}

        {/* Hover Label Badge */}
        <div className={`absolute inset-x-0 bottom-0 bg-[rgba(146,58,43,0.95)] text-white font-title font-black text-center text-[0.8rem] py-2.5 uppercase tracking-wider z-10 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} backdrop-blur-xs`}>
          Tabla Nutricional
        </div>

        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={isHovered ? `${product.name} - Tabla Nutricional` : product.name}
          className="max-w-[85%] max-h-[85%] object-contain transition-all duration-500 group-hover:scale-108"
          loading="lazy"
        />
      </div>

      <div className="flex justify-between items-start mb-2">
        <span className="text-[0.8rem] text-text-muted uppercase font-bold tracking-wider">{product.category} | {product.brand}</span>
        <div className="flex flex-col items-end">
          {hasDiscount && (
            <span className="text-[0.85rem] text-text-muted line-through leading-none mb-0.5">S/ {product.price.toFixed(2)}</span>
          )}
          <span className="font-title font-extrabold text-accent text-[1.2rem] drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">S/ {finalPrice.toFixed(2)}</span>
        </div>
      </div>

      <h3 className="text-[1.25rem] mb-3 leading-snug font-title font-extrabold group-hover:text-accent transition-colors duration-300">{product.name}</h3>
      <p className="text-[0.9rem] text-text-secondary mb-6 flex-grow line-clamp-3">{product.description}</p>

      <Link to={`/producto/${product.id}`} className="w-full btn-secondary text-center">
        Ver Detalles
      </Link>
    </article>
  );
};



const Home: React.FC = () => {
  const navigate = useNavigate();

  // Stories/Highlights State for Promotions
  const [activeStory, setActiveStory] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [sliderConfig, setSliderConfig] = useState({
    spacing: 15.9375,
    cardWidthClass: 'w-[17.1875rem]',
    containerHeightClass: 'h-[33.125rem]'
  });

  // Touch states for swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const { products, promotions } = useStore();

  const stories = promotions.map((promo, idx) => ({
    id: idx + 1,
    image: promo.image,
    link: `/promocion/${promo.id}`,
    promoId: promo.id
  }));

  const nextStory = () => {
    setActiveStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 380) {
        setSliderConfig({
          spacing: 6.8,
          cardWidthClass: 'w-[10.5rem]',
          containerHeightClass: 'h-[20rem]'
        });
      } else if (w < 480) {
        setSliderConfig({
          spacing: 8.2,
          cardWidthClass: 'w-[11.5rem]',
          containerHeightClass: 'h-[22rem]'
        });
      } else if (w < 768) {
        setSliderConfig({
          spacing: 10.625,
          cardWidthClass: 'w-[13.125rem]',
          containerHeightClass: 'h-[25rem]'
        });
      } else if (w < 1024) {
        setSliderConfig({
          spacing: 13.5,
          cardWidthClass: 'w-[15.5rem]',
          containerHeightClass: 'h-[30rem]'
        });
      } else {
        setSliderConfig({
          spacing: 15.9375,
          cardWidthClass: 'w-[17.1875rem]',
          containerHeightClass: 'h-[33.125rem]'
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextStory();
    } else if (isRightSwipe) {
      prevStory();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (isStoryPaused) return;
    const interval = setInterval(() => {
      nextStory();
    }, 5000);
    return () => clearInterval(interval);
  }, [isStoryPaused, activeStory]);

  const getCircularOffset = (index: number, active: number, total: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };
  // Featured products filtered from context
  const featuredProducts = products.filter(product => product.featured);





  return (
    <div className="w-full">
      {/* 2.5 Sección de Promociones (Estilo Instagram Stories/Highlights) */}
      <section
        className="min-h-[85vh] pt-[4.25rem] pb-[4.25rem] relative overflow-hidden bg-cover bg-center border-b border-border-brand/10 flex items-center justify-center"
        style={{ backgroundImage: "url('/src/assets/hero_bg2.png')" }}
      >
        {/* Dark cinematic overlay - lighter opacity to let the background image shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080605]/75 via-[#080605]/40 to-[#080605]/75 z-0" />

        {/* Central glowing orb */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[31.25rem] h-[31.25rem] rounded-full blur-[7.5rem] opacity-20 pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, #923a2b 0%, transparent 70%)' }}
        />

        <div className="relative z-10 container w-full flex flex-col justify-center items-center">
          <div className="text-center mb-10">

            <h2 className="text-[2.25rem] uppercase relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[3.75rem] after:h-[3px] after:bg-accent text-transparent bg-clip-text bg-gradient-to-r from-white to-accent font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Nuestras Promociones
            </h2>
          </div>

          {/* Stories Slider Layout */}
          <div className={`relative w-full max-w-[56.25rem] mx-auto flex items-center justify-center ${sliderConfig.containerHeightClass}`}>

            {/* Track of stories */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {stories.map((story, index) => {
                const offset = getCircularOffset(index, activeStory, stories.length);
                const isActive = offset === 0;
                const isPrev = offset === -1;
                const isNext = offset === 1;

                // Find corresponding promotion data to get price and originalPrice
                const promo = promotions.find(p => p.id === story.promoId);
                const price = promo ? promo.price : 0;
                const originalPrice = promo ? promo.originalPrice : 0;

                // Calculate transition styles
                const translateX = offset * sliderConfig.spacing;
                const scale = isActive ? 1.08 : 0.78;
                const zIndex = isActive ? 30 : 10;
                const opacity = isActive ? 1 : Math.abs(offset) <= 1 ? 0.35 : 0;
                const blur = isActive ? '0px' : '2px';

                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      if (isPrev) prevStory();
                      if (isNext) nextStory();
                      if (isActive) navigate(story.link);
                    }}
                    onMouseEnter={() => isActive && setIsStoryPaused(true)}
                    onMouseLeave={() => isActive && setIsStoryPaused(false)}
                    style={{
                      transform: `translate(-50%, -50%) translateX(${translateX}rem) scale(${scale})`,
                      zIndex,
                      opacity,
                      filter: `blur(${blur})`,
                    }}
                    className={`absolute top-1/2 left-1/2 aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out cursor-pointer select-none flex flex-col ${sliderConfig.cardWidthClass}
                    ${isActive
                        ? 'border border-border-brand/40 shadow-glow-accent'
                        : 'border border-border-brand/10 hover:opacity-50'
                      }`}
                  >
                    {/* Image filling the entire card area with fixed aspect ratio */}
                    <img
                      src={story.image}
                      alt={`Promoción ${story.id}`}
                      className="w-full h-full object-cover block"
                    />

                    {/* Bottom Gradient overlay with pricing and button */}
                    {price > 0 && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080605] via-[#080605]/80 to-transparent pt-20 pb-6 px-4 z-30 flex flex-col items-center justify-end text-center pointer-events-none">
                        <div className="flex items-center gap-2.5 justify-center mb-1">
                          {originalPrice > 0 && (
                            <span className="text-[0.8rem] text-text-muted line-through font-semibold leading-none">
                              S/ {originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-accent text-[1.35rem] font-title font-black leading-none drop-shadow-[0_2px_8px_rgba(146,58,43,0.35)]">
                            S/ {price.toFixed(2)}
                          </span>
                        </div>
                        
                        {isActive ? (
                          <div className="mt-3 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-full font-title font-black text-[0.7rem] uppercase tracking-wider shadow-[0_4px_15px_rgba(146,58,43,0.45)] animate-bounce pointer-events-auto cursor-pointer hover:scale-105 transition-all duration-200">
                            Ver Detalles
                          </div>
                        ) : (
                          <span className="text-[0.65rem] text-text-muted uppercase font-black tracking-widest opacity-80 mt-1">
                            Ver Combo
                          </span>
                        )}
                      </div>
                    )}

                    {/* Dim overlay for inactive stories */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/[0.15] z-20 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Productos Destacados */}
      <section className="py-16 md:py-24 container">
        <div className="text-center mb-14">
          <span className="font-title font-black text-[0.85rem] text-accent tracking-widest uppercase mb-3 block">Lo más buscado</span>
          <h2 className="text-[2.25rem] uppercase relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent text-gradient font-black">Productos Destacados</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>



      {/* 3. Sección de Beneficios */}
      <section className="py-16 md:py-24 bg-secondary border-t border-b border-border-brand">
        <div className="container">
          <div className="text-center mb-14">
            <span className="font-title font-black text-[0.85rem] text-accent tracking-widest uppercase mb-3 block">Ventajas de NERITO</span>
            <h2 className="text-[2.25rem] uppercase relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent text-gradient font-black">¿Por qué elegirnos?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="text-center flex flex-col items-center gap-4 card-premium group">
              <div className="w-[72px] h-[72px] rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[2rem] mb-2 transition-all duration-300 shadow-glow group-hover:bg-accent group-hover:text-primary group-hover:scale-108 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(146,58,43,0.4)]">
                <FaShippingFast />
              </div>
              <h3 className="text-[1.25rem] uppercase font-title font-extrabold">Envío Express</h3>
              <p className="text-[0.95rem] text-text-secondary">
                Realizamos entregas rápidas y seguras a todo el país. Recibe tus suplementos en 24/48 horas directo en tu puerta.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="text-center flex flex-col items-center gap-4 card-premium group">
              <div className="w-[72px] h-[72px] rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[2rem] mb-2 transition-all duration-300 shadow-glow group-hover:bg-accent group-hover:text-primary group-hover:scale-108 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(146,58,43,0.4)]">
                <FaAward />
              </div>
              <h3 className="text-[1.25rem] uppercase font-title font-extrabold">Calidad Garantizada</h3>
              <p className="text-[0.95rem] text-text-secondary">
                Suplementos de la más alta pureza procedentes de marcas líderes. Analizados e inspeccionados rigurosamente.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="text-center flex flex-col items-center gap-4 card-premium group">
              <div className="w-[72px] h-[72px] rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[2rem] mb-2 transition-all duration-300 shadow-glow group-hover:bg-accent group-hover:text-primary group-hover:scale-108 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(146,58,43,0.4)]">
                <FaWhatsapp />
              </div>
              <h3 className="text-[1.25rem] uppercase font-title font-extrabold">Asesoría WhatsApp</h3>
              <p className="text-[0.95rem] text-text-secondary">
                ¿No sabes qué elegir? Nuestro equipo de expertos te asesora de forma gratuita para ayudarte a alcanzar tus metas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección CTA (Call To Action) */}
      <section className="relative bg-primary py-24 px-6 border-t border-border-brand text-center overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-1/2 before:w-[200%] before:h-[200%] before:bg-[radial-gradient(circle,rgba(146,58,43,0.03)_0%,transparent_60%)] before:z-1 before:pointer-events-none">
        <div className="relative z-2 max-w-[600px] mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-gradient font-title">¿Listo para superar tus límites?</h2>
          <p className="text-[1.1rem] text-text-secondary leading-relaxed">
            Equípate con la suplementación adecuada y nota la diferencia en tu fuerza, energía y tiempo de recuperación.
          </p>
          <Link to="/catalogo" className="btn-primary">
            Explorar Catálogo Completo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
