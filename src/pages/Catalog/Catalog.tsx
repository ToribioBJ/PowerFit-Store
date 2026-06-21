import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaInfoCircle, FaInbox, FaTimes } from 'react-icons/fa';
import type { Product } from '../../interfaces';
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
    return ['Todos', 'Promociones', ...Array.from(cats)];
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
    // Si la categoría seleccionada es 'Promociones', combinamos los combos de promoción y los productos individuales con descuento
    let baseProducts = [...products];
    if (selectedCategory === 'Promociones') {
      baseProducts = [
        ...promotions.map(promo => ({ ...promo, discount: 0 })), // Establecemos discount a 0 para mostrar el precio neto directo
        ...products.filter(p => p.discount > 0)
      ] as Product[];
    }

    const result = baseProducts.filter((product) => {
      // 1. Search term match
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = 
        selectedCategory === 'Todos' || 
        selectedCategory === 'Promociones' || // Ya filtrados en baseProducts
        product.category === selectedCategory;
      
      // 3. Brand match
      const matchesBrand = 
        selectedBrand === 'Todas' || 
        product.brand === selectedBrand ||
        (selectedCategory === 'Promociones' && product.brand === 'PowerFit Combos'); // Mostrar combos siempre en la vista de promociones

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
              const isPromoTab = cat === 'Promociones';
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-title font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer relative border shrink-0
                    ${selectedCategory === cat 
                      ? (isPromoTab ? 'bg-accent text-white border-accent shadow-glow-accent' : 'bg-accent text-white border-accent shadow-glow') 
                      : (isPromoTab 
                          ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 hover:text-accent-hover' 
                          : 'bg-secondary/40 text-text-secondary border-border-brand/40 hover:text-white hover:border-text-secondary/30'
                        )
                    }`}
                >
                  {isPromoTab ? '🔥 Promociones' : cat}
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
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                getFinalPrice={getFinalPrice} 
                addToCart={addToCart} 
              />
            ))}
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
