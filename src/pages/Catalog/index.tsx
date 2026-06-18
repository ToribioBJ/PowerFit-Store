import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaInfoCircle, FaInbox } from 'react-icons/fa';
import productsData from '../../data/products.json';
import type { Product } from '../../interfaces';
import { useCart } from '../../context/CartContext';
import styles from './Catalog.module.css';

const Catalog: React.FC = () => {
  const products: Product[] = productsData as Product[];
  const { addToCart } = useCart();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('default');

  // Categories list derived dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['Todos', ...Array.from(cats)];
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      // 1. Search term match
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      
      // 3. Price match
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setMaxPrice(300);
    setSortBy('default');
  };

  return (
    <div className={`${styles.catalogContainer} container`}>
      {/* Encabezado */}
      <header className={styles.catalogHeader}>
        <span className={styles.catalogSubtitle}>Alcanza tus metas</span>
        <h1 className={styles.catalogTitle}>Catálogo de Suplementos</h1>
      </header>

      {/* Controles de Filtros */}
      <section className={styles.filtersWrapper}>
        <div className={styles.filtersTop}>
          {/* Buscador */}
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar suplementos (ej. proteína, creatina...)"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Ordenamiento */}
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Ordenar por: Relevancia</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>

        {/* Categorías */}
        <div className={styles.categoriesList}>
          <span className={styles.filterLabel}>Categoría:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryBtn} ${
                selectedCategory === cat ? styles.activeCategoryBtn : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rango de Precios */}
        <div className={styles.priceRangeWrapper}>
          <div className={styles.priceLabelRow}>
            <span>Precio máximo:</span>
            <span>S/ {maxPrice.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="5"
            className={styles.priceSlider}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </section>

      {/* Listado de Productos */}
      <section>
        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <article key={product.id} className={`${styles.productCard} card-premium`}>
                <div className={styles.imageContainer}>
                  {product.featured && <span className={styles.featuredBadge}>Destacado</span>}
                  {product.stock <= 5 && (
                    <span className={styles.stockBadge}>¡Solo {product.stock} disp!</span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImg}
                    loading="lazy"
                  />
                </div>

                <div className={styles.productMeta}>
                  <span className={styles.categoryTag}>{product.category}</span>
                  <span className={styles.priceTag}>S/ {product.price.toFixed(2)}</span>
                </div>

                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.description}</p>

                <div className={styles.cardActions}>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className={styles.addToCartBtn}
                    title="Añadir al carrito"
                  >
                    <FaShoppingCart /> Añadir
                  </button>
                  <Link to={`/producto/${product.id}`} className={styles.detailBtn}>
                    <FaInfoCircle /> Detalles
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noProducts}>
            <FaInbox className={styles.noProductsIcon} />
            <h3 className={styles.noProductsTitle}>No se encontraron productos</h3>
            <p>Intenta ajustando los criterios de búsqueda o los filtros aplicados.</p>
            <button onClick={handleClearFilters} className="btn-primary styles.clearFiltersBtn">
              Limpiar Filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;
