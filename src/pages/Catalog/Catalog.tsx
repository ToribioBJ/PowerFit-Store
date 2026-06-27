import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaInfoCircle, FaInbox, FaTimes } from 'react-icons/fa';
import type { Product, Promotion } from '../../interfaces';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const ProductCard: React.FC<{ 
  product: Product; 
  getFinalPrice: (p: Product) => number; 
  addToCart: (p: Product, qty: number) => void;
}> = ({ product, getFinalPrice, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount = product.discount > 0;
  const finalPrice = getFinalPrice(product);

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
        {product.stock <= 5 && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-700 to-red-600 text-white font-title font-bold text-[0.7rem] uppercase py-1.5 px-2.5 rounded shadow-[0_4px_10px_rgba(220,38,38,0.45)] z-10">
            ¡Solo {product.stock} disp!
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
        <span className="text-[0.8rem] text-text-muted uppercase font-bold tracking-wider">
          {product.category} | {product.brand}
        </span>
        <div className="flex flex-col items-end">
          {hasDiscount && (
            <span className="text-[0.85rem] text-text-muted line-through leading-none mb-0.5">
              S/ {product.price.toFixed(2)}
            </span>
          )}
          <span className="font-title font-extrabold text-accent text-[1.2rem] drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">
            S/ {finalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <h3 className="text-[1.25rem] mb-3 leading-snug font-title font-extrabold text-text-primary group-hover:text-accent transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-[0.9rem] text-text-secondary mb-6 flex-grow line-clamp-2">
        {product.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => addToCart(product, 1)}
          className="btn-primary text-[0.8rem] tracking-wider py-2.5 cursor-pointer"
          title="Añadir al carrito"
        >
          <FaShoppingCart /> Añadir
        </button>
        <Link 
          to={product.id >= 100 ? `/promocion/${product.id}` : `/producto/${product.id}`} 
          className="btn-secondary text-[0.8rem] tracking-wider py-2.5 text-center"
        >
          <FaInfoCircle /> Detalles
        </Link>
      </div>
    </article>
  );
};

export const PromoCard: React.FC<{
  promo: Promotion;
  addToCart: (p: Product, qty: number) => void;
}> = ({ promo, addToCart }) => {
  const savings = promo.originalPrice - promo.price;
  
  return (
    <article tabIndex={0} className="admin-glass-panel relative overflow-hidden h-[400px] rounded-2xl border border-border-brand/40 group hover:border-accent/50 hover:shadow-glow-accent focus-within:border-accent/50 focus-within:shadow-glow-accent outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full">
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
          <h3 className="font-title font-extrabold text-base text-white leading-tight text-left">
            {promo.name}
          </h3>
          <p className="text-xs text-white/70 leading-relaxed line-clamp-4 font-sans text-left">
            {promo.description}
          </p>

          {/* High Contrast Products list detail rendered as solid red pills */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl text-white shadow-inner text-left">
            <span className="text-[0.62rem] text-white/50 font-black uppercase tracking-widest block mb-2.5">
              Contenido del Combo:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {promo.productsIncluded && promo.productsIncluded.length > 0 ? (
                promo.productsIncluded.map(prod => (
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
              <span className="text-xl font-title font-black text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.3)] mt-1.5 block">S/ {promo.price.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[0.55rem] text-white/50 uppercase font-bold tracking-widest block leading-none">Original</span>
              <span className="text-xs font-bold text-white/40 line-through mt-2 block">S/ {promo.originalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => addToCart(promo as unknown as Product, 1)}
                className="btn-primary py-2 px-3 text-[0.7rem] tracking-wider font-extrabold cursor-pointer flex-1 border-0 flex items-center justify-center gap-1.5 shadow-glow hover:shadow-glow-accent transition-all duration-300"
                title="Añadir al carrito"
              >
                <FaShoppingCart size={11} /> Añadir
              </button>
              <Link
                to={`/promocion/${promo.id}`}
                className="btn-secondary py-2 px-3 text-[0.7rem] tracking-wider font-extrabold text-center flex-1 flex items-center justify-center gap-1.5"
              >
                <FaInfoCircle size={11} /> Detalles
              </Link>
            </div>
            <div className="bg-white/[0.06] border border-white/10 rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center shrink-0">
              <span className="text-[0.5rem] text-white/40 uppercase font-bold tracking-wider leading-none">Stock</span>
              <span className={`text-xs font-black mt-1 leading-none ${promo.stock <= 5 ? 'text-red-400' : 'text-white'}`}>{promo.stock} u.</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Catalog: React.FC = () => {
  const { products, promotions } = useStore();
  const { addToCart } = useCart();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [sortBy, setSortBy] = useState('price-asc'); // Por defecto orden de menor a mayor precio

  // Categories list derived dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    const filteredCats = Array.from(cats).filter(c => c !== 'Promociones' && c !== 'Combos' && c !== 'Ofertas');
    return ['Todos', 'Combos', 'Ofertas', ...filteredCats];
  }, [products]);

  // Brands list derived dynamically
  const brands = useMemo(() => {
    const brs = new Set(products.map(p => p.brand));
    return ['Todas', ...Array.from(brs)];
  }, [products]);

  // Helper to get final discounted price
  const getFinalPrice = (product: Product) => {
    return product.price * (1 - product.discount / 100);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let baseProducts = [...products];
    if (selectedCategory === 'Combos') {
      baseProducts = promotions.map(promo => ({ ...promo, discount: 0 })) as unknown as Product[];
    } else if (selectedCategory === 'Ofertas') {
      baseProducts = products.filter(p => p.discount > 0);
    }

    const result = baseProducts.filter((product) => {
      // 1. Search term match
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = 
        selectedCategory === 'Todos' || 
        selectedCategory === 'Combos' || 
        selectedCategory === 'Ofertas' || 
        product.category === selectedCategory;
      
      // 3. Brand match
      const matchesBrand = 
        selectedBrand === 'Todas' || 
        product.brand === selectedBrand ||
        (selectedCategory === 'Combos' && product.brand === 'PowerFit Combos');

      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    } else if (sortBy === 'discount-desc') {
      result.sort((a, b) => b.discount - a.discount);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    console.log('Catálogo - Filtros:', { selectedCategory, searchTerm, selectedBrand, sortBy, totalFiltered: result.length });
    return result;
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedBrand('Todas');
    setSortBy('price-asc');
  };

  return (
    <div className="py-10 md:py-20 min-h-screen container">
      {/* Encabezado */}
      <header className="text-center mb-8">
        <span className="font-title font-black text-[0.9rem] text-accent tracking-widest uppercase mb-3 block">Alcanza tus metas</span>
        <h1 className="text-4xl font-extrabold uppercase text-gradient font-title">Catálogo de Suplementos</h1>
      </header>

      {/* Categorías: Sub-Navbar con scroll horizontal (X-List) */}
      <nav className="border-b border-border-brand/40 mb-8 relative w-full overflow-hidden">
        <div className="overflow-x-auto touch-pan-x scrollbar-none w-full scroll-smooth">
          <div className="flex items-center gap-2 pb-3 w-max">
            {categories.map((cat) => {
              const isCombos = cat === 'Combos';
              const isOfertas = cat === 'Ofertas';
              const isSpecial = isCombos || isOfertas;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-title font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer relative border shrink-0
                    ${selectedCategory === cat 
                      ? (isSpecial ? 'bg-accent text-white border-accent shadow-glow-accent' : 'bg-accent text-white border-accent shadow-glow') 
                      : (isSpecial 
                          ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 hover:text-accent-hover' 
                          : 'bg-secondary/40 text-text-secondary border-border-brand/40 hover:text-white hover:border-text-secondary/30'
                        )
                    }`}
                >
                  {isCombos ? '⚡ Combos' : isOfertas ? '🔥 Ofertas' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Barra de Filtros Secundaria: Buscador, Marca y Orden */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 bg-secondary/60 backdrop-blur-md border border-border-brand/50 p-4 rounded-xl shadow-lg">
        {/* Buscador */}
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[1rem] transition-colors duration-300 group-focus-within:text-accent z-10" />
          <input
            type="text"
            placeholder="¿Qué suplemento estás buscando?"
            className="relative w-full bg-primary/45 backdrop-blur-sm border border-border-brand/50 text-text-primary py-3 px-4 pl-11 pr-10 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent/80 focus:bg-primary/75 focus:shadow-[0_0_20px_rgba(146,58,43,0.2)] placeholder:text-text-muted/50 z-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer p-1 rounded-full hover:bg-white/5 z-10"
              title="Limpiar búsqueda"
            >
              <FaTimes className="text-[0.9rem]" />
            </button>
          )}
        </div>

        {/* Controles de Marca y Orden */}
        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto justify-end">
          {/* Selector de Marcas */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-title font-black text-xs uppercase text-text-muted hidden sm:inline">Marca:</span>
            <select
              className="appearance-none bg-primary/45 backdrop-blur-sm border border-border-brand/50 text-text-primary py-3 pl-4 pr-10 rounded-lg text-[0.95rem] cursor-pointer outline-none focus:border-accent/80 focus:bg-primary/75 focus:shadow-[0_0_20px_rgba(146,58,43,0.2)] w-full sm:w-auto transition-all duration-300 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a83c2c%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:1.25rem_1.25rem] bg-no-repeat"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="Todas">Todas las Marcas</option>
              {brands.filter(b => b !== 'Todas').map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-title font-black text-xs uppercase text-text-muted hidden sm:inline">Ordenar:</span>
            <select
              className="appearance-none bg-primary/45 backdrop-blur-sm border border-border-brand/50 text-text-primary py-3 pl-4 pr-10 rounded-lg text-[0.95rem] cursor-pointer outline-none focus:border-accent/80 focus:bg-primary/75 focus:shadow-[0_0_20px_rgba(146,58,43,0.2)] w-full sm:w-auto transition-all duration-300 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a83c2c%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-[size:1.25rem_1.25rem] bg-no-repeat"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="discount-desc">Mayor Descuento</option>
              <option value="name-asc">Nombre: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listado de Productos */}
      <section>
        {filteredProducts.length > 0 ? (
          /* Vista en Cuadrícula (Grid clásica) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isPromo = product.id >= 100;
              if (isPromo) {
                return (
                  <PromoCard 
                    key={product.id} 
                    promo={product as unknown as Promotion} 
                    addToCart={addToCart} 
                  />
                );
              }
              return (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  getFinalPrice={getFinalPrice} 
                  addToCart={addToCart} 
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-secondary border border-border-brand rounded-lg">
            <FaInbox className="text-[3rem] text-text-muted mb-4 mx-auto" />
            <h3 className="text-2xl mb-3 font-title font-extrabold text-text-primary">No se encontraron productos</h3>
            <p className="text-text-secondary mb-4">Intenta ajustando los criterios de búsqueda o los filtros aplicados.</p>
            <button onClick={handleClearFilters} className="btn-primary mt-4">
              Limpiar Filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;
