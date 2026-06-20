import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import productsData from '../../data/products.json';
import type { Product } from '../../interfaces';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../Catalog';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products: Product[] = productsData as Product[];
  const { addToCart } = useCart();

  // Find product by id
  const product = products.find((p) => p.id === Number(id));

  // State for quantity selection
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<'front' | 'back'>('front');

  // Reset state and scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    setActiveImage('front');
  }, [id]);

  if (!product) {
    return (
      <div className="py-10 md:py-20 min-h-screen container">
        <div className="text-center py-24 px-6">
          <FaExclamationTriangle className="text-[3rem] text-red-500 mb-4 mx-auto" />
          <h1 className="text-3xl mb-4 font-title font-extrabold text-text-primary">Producto no encontrado</h1>
          <p className="text-text-secondary mb-8">El suplemento que buscas no existe o ha sido retirado.</p>
          <Link to="/catalogo" className="btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const isOutOfStock = product.stock === 0;

  // Filter similar products (same category, different id) and limit to 3
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const getFinalPrice = (p: Product) => {
    return p.price * (1 - p.discount / 100);
  };

  return (
    <div className="py-10 md:py-20 min-h-screen container">
      {/* Back Link */}
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-text-secondary font-semibold text-[0.95rem] mb-8 transition-all duration-200 hover:text-accent hover:-translate-x-1">
        <FaArrowLeft /> Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
        {/* Left Side: Product Image & Toggle */}
        <div className="flex flex-col gap-4 max-w-[500px] md:max-w-none mx-auto w-full">
          <div className="card-premium aspect-square relative w-full flex flex-col justify-center p-6 animate-fadeIn transition-all duration-300 hover:scale-[1.01]">
            {product.featured && (
              <span className="absolute top-5 left-5 bg-gradient-to-r from-text-secondary to-[#d5c7b5] text-primary font-title font-black text-[0.8rem] uppercase py-1.5 px-3.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.35)] z-10 tracking-wider">
                Destacado
              </span>
            )}
            <div className="bg-white rounded-xl flex items-center justify-center h-full w-full p-6 border border-border-brand/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]">
              <img
                src={activeImage === 'front' ? product.image : product.hoverImage}
                alt={activeImage === 'front' ? product.name : `${product.name} - Tabla Nutricional`}
                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
              />
            </div>
          </div>
          
          {/* Selector de Lado (Imagen / Tabla Nutricional) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveImage('front')}
              className={`font-title font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg border transition-all duration-300 cursor-pointer
                ${activeImage === 'front'
                  ? 'bg-accent border-accent text-white shadow-glow'
                  : 'bg-secondary/60 border-border-brand/60 text-text-secondary hover:text-white hover:border-text-secondary/40'
                }`}
            >
              Imagen Principal
            </button>
            <button
              onClick={() => setActiveImage('back')}
              className={`font-title font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg border transition-all duration-300 cursor-pointer
                ${activeImage === 'back'
                  ? 'bg-accent border-accent text-white shadow-glow'
                  : 'bg-secondary/60 border-border-brand/60 text-text-secondary hover:text-white hover:border-text-secondary/40'
                }`}
            >
              Tabla Nutricional
            </button>
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[0.9rem] text-accent uppercase font-bold tracking-wider">{product.category}</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-title font-black leading-none uppercase text-gradient">{product.name}</h1>
          </div>

          <div className="font-title text-[2.25rem] font-black text-text-primary border-b border-border-brand/40 pb-5">
            {product.discount > 0 ? (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-text-muted text-[1.35rem] font-semibold line-through">
                  S/ {product.price.toFixed(2)}
                </span>
                <span className="text-accent drop-shadow-[0_2px_10px_rgba(146,58,43,0.2)]">
                  S/ {(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="bg-gradient-to-r from-accent to-[#A84433] text-white text-[0.8rem] py-1.5 px-3.5 rounded shadow-[0_4px_10px_rgba(146,58,43,0.3)] font-title font-black">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-gradient-gold">S/ {product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="leading-relaxed">
            <h3 className="text-[1.15rem] uppercase font-title font-extrabold text-text-primary mb-2">Descripción</h3>
            <p className="text-base text-text-secondary">{product.description}</p>
          </div>

          {/* Table Nutritional Info */}
          {product.nutrition && (
            <div className="bg-secondary/60 backdrop-blur-md border border-border-brand/50 rounded-xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent"></div>
              <h3 className="text-[1.15rem] uppercase font-title font-extrabold text-text-primary mb-4 pl-3 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
                Ficha Técnica de Combate (por servicio)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="bg-primary/80 border border-border-brand/60 rounded-lg p-4 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(146,58,43,0.2)]">
                  <div className="font-title text-[1.5rem] font-extrabold text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.2)]">{product.nutrition.protein}</div>
                  <div className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-wider mt-1.5">Proteína</div>
                </div>
                <div className="bg-primary/80 border border-border-brand/60 rounded-lg p-4 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(146,58,43,0.2)]">
                  <div className="font-title text-[1.5rem] font-extrabold text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.2)]">{product.nutrition.carbs}</div>
                  <div className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-wider mt-1.5">Carbohidratos</div>
                </div>
                <div className="bg-primary/80 border border-border-brand/60 rounded-lg p-4 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(146,58,43,0.2)]">
                  <div className="font-title text-[1.5rem] font-extrabold text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.2)]">{product.nutrition.fats}</div>
                  <div className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-wider mt-1.5">Grasas</div>
                </div>
                <div className="bg-primary/80 border border-border-brand/60 rounded-lg p-4 text-center transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(146,58,43,0.2)]">
                  <div className="font-title text-[1.5rem] font-extrabold text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.2)]">{product.nutrition.calories}</div>
                  <div className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-wider mt-1.5">Calorías</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions & Stock */}
          <div className="flex items-center gap-5 flex-wrap py-2.5">
            {!isOutOfStock ? (
              <>
                <div className="flex items-center bg-secondary/80 border border-border-brand/60 rounded-lg overflow-hidden h-12 shadow-inner">
                  <button
                    onClick={handleDecrement}
                    className="w-12 h-full flex items-center justify-center text-[1.1rem] text-text-secondary transition-colors duration-200 hover:enabled:bg-accent/10 hover:enabled:text-accent disabled:text-text-muted disabled:cursor-not-allowed"
                    disabled={qty <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-[50px] bg-transparent text-center text-text-primary font-bold text-[1.1rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                    aria-label="Cantidad seleccionada"
                  />
                  <button
                    onClick={handleIncrement}
                    className="w-12 h-full flex items-center justify-center text-[1.1rem] text-text-secondary transition-colors duration-200 hover:enabled:bg-accent/10 hover:enabled:text-accent disabled:text-text-muted disabled:cursor-not-allowed"
                    disabled={qty >= product.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="btn-primary h-12 px-8 flex-grow md:max-w-[300px] w-full cursor-pointer"
                >
                  <FaShoppingCart /> Añadir al Carrito
                </button>
              </>
            ) : (
              <span className="text-red-500 font-bold uppercase tracking-wider">Agotado Temporalmente</span>
            )}

            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <div className="text-[0.9rem] text-text-secondary">
                {isOutOfStock ? (
                  <span>Sin existencias en almacén.</span>
                ) : (
                  <span>
                    Disponibles: <span className="font-extrabold" style={{ color: product.stock <= 5 ? '#ef4444' : 'var(--color-accent)' }}>{product.stock} unidades</span>
                  </span>
                )}
              </div>
              {!isOutOfStock && (
                <div className="w-full bg-secondary/80 rounded-full h-1.5 overflow-hidden border border-border-brand/40 max-w-[250px]">
                  <div 
                    className={`h-full transition-all duration-500 ${product.stock <= 5 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent shadow-[0_0_8px_var(--color-accent)]'}`}
                    style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Productos Similares */}
      <section className="mt-20 border-t border-border-brand/40 pt-16">
        <h2 className="text-3xl font-title font-black uppercase text-gradient mb-8 text-center md:text-left">
          Productos Similares
        </h2>
        {similarProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                getFinalPrice={getFinalPrice}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-6">
            No hay otros productos similares en esta categoría.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
