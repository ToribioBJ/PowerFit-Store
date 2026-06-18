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
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [sortBy, setSortBy] = useState('price-asc'); // Por defecto orden de menor a mayor precio

  // Categories list derived dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['Todos', ...Array.from(cats)];
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
    const result = products.filter((product) => {
      // 1. Search term match
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      
      // 3. Brand match
      const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;

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

    return result;
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedBrand('Todas');
    setSortBy('price-asc');
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
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="discount-desc">Mayor Descuento</option>
            <option value="name-asc">Nombre: A-Z</option>
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

        {/* Marcas */}
        <div className={styles.brandsList}>
          <span className={styles.filterLabel}>Marca:</span>
          {brands.map((br) => (
            <button
              key={br}
              onClick={() => setSelectedBrand(br)}
              className={`${styles.categoryBtn} ${
                selectedBrand === br ? styles.activeCategoryBtn : ''
              }`}
            >
              {br}
            </button>
          ))}
        </div>
      </section>

      {/* Listado de Productos */}
      <section>
        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => {
              const hasDiscount = product.discount > 0;
              const finalPrice = getFinalPrice(product);
              
              return (
                <article key={product.id} className={`${styles.productCard} card-premium`}>
                  <div className={styles.imageContainer}>
                    {product.featured && <span className={styles.featuredBadge}>Destacado</span>}
                    {hasDiscount && (
                      <span className={styles.discountBadge}>{product.discount}% OFF</span>
                    )}
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
                    <div className={styles.priceContainer}>
                      {hasDiscount && (
                        <span className={styles.originalPrice}>S/ {product.price.toFixed(2)}</span>
                      )}
                      <span className={styles.priceTag}>S/ {finalPrice.toFixed(2)}</span>
                    </div>
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
              );
            })}
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
