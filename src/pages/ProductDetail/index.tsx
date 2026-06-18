import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';
import productsData from '../../data/products.json';
import type { Product } from '../../interfaces';
import { useCart } from '../../context/CartContext';
import styles from './ProductDetail.module.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products: Product[] = productsData as Product[];
  const { addToCart } = useCart();

  // Find product by id
  const product = products.find((p) => p.id === Number(id));

  // State for quantity selection
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className={`${styles.detailContainer} container`}>
        <div className={styles.errorWrapper}>
          <FaExclamationTriangle style={{ fontSize: '3rem', color: '#e53935', marginBottom: '16px' }} />
          <h1 className={styles.errorTitle}>Producto no encontrado</h1>
          <p className={styles.errorDesc}>El suplemento que buscas no existe o ha sido retirado.</p>
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

  return (
    <div className={`${styles.detailContainer} container`}>
      {/* Back Link */}
      <Link to="/catalogo" className={styles.backLink}>
        <FaArrowLeft /> Volver al Catálogo
      </Link>

      <div className={styles.productLayout}>
        {/* Left Side: Product Image */}
        <div className={styles.imageCard}>
          {product.featured && <span className={styles.featuredBadge}>Destacado</span>}
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImg}
          />
        </div>

        {/* Right Side: Product Info */}
        <div className={styles.infoPanel}>
          <div>
            <span className={styles.categoryTag}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>
          </div>

          <div className={styles.productPrice}>
            S/ {product.price.toFixed(2)}
          </div>

          <div className={styles.descriptionSection}>
            <h3 className={styles.descTitle}>Descripción</h3>
            <p className={styles.productDesc}>{product.description}</p>
          </div>

          {/* Table Nutritional Info */}
          {product.nutrition && (
            <div className={styles.nutritionCard}>
              <h3 className={styles.nutritionTitle}>Información Nutricional (por servicio)</h3>
              <div className={styles.nutritionGrid}>
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionVal}>{product.nutrition.protein}</div>
                  <div className={styles.nutritionLbl}>Proteína</div>
                </div>
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionVal}>{product.nutrition.carbs}</div>
                  <div className={styles.nutritionLbl}>Carbohidratos</div>
                </div>
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionVal}>{product.nutrition.fats}</div>
                  <div className={styles.nutritionLbl}>Grasas</div>
                </div>
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionVal}>{product.nutrition.calories}</div>
                  <div className={styles.nutritionLbl}>Calorías</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions & Stock */}
          <div className={styles.actionsWrapper}>
            {!isOutOfStock ? (
              <>
                <div className={styles.quantitySelector}>
                  <button
                    onClick={handleDecrement}
                    className={styles.qtyBtn}
                    disabled={qty <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className={styles.qtyInput}
                    aria-label="Cantidad seleccionada"
                  />
                  <button
                    onClick={handleIncrement}
                    className={styles.qtyBtn}
                    disabled={qty >= product.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className={`${styles.addToCartBtn} btn-primary`}
                >
                  <FaShoppingCart /> Añadir al Carrito
                </button>
              </>
            ) : (
              <span className={styles.outOfStock}>AGOTADO TEMPORALMENTE</span>
            )}

            <div className={styles.stockStatus}>
              {isOutOfStock ? (
                <span>Sin existencias en almacén.</span>
              ) : (
                <span>
                  Disponibles: <span style={{ color: product.stock <= 5 ? '#e53935' : 'var(--color-accent)' }}>{product.stock} unidades</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
