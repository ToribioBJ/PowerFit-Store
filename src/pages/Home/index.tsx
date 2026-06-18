import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShippingFast, FaAward, FaWhatsapp } from 'react-icons/fa';
import productsData from '../../data/products.json';
import type { Product } from '../../interfaces';
import styles from './Home.module.css';

const Home: React.FC = () => {
  // Cast productsData to Product[] to guarantee typing safety
  const products: Product[] = productsData as Product[];
  
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className={styles.homeContainer}>
      {/* 1. Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>Premium Fitness Store</span>
          <h1 className={styles.heroTitle}>
            Suplementación de élite <span>para tu máximo rendimiento</span>
          </h1>
          <p className={styles.heroDesc}>
            Descubre nuestra línea seleccionada de proteínas, creatinas y pre-entrenos con la máxima pureza del mercado. Diseñado para atletas exigentes.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/catalogo" className="btn-primary">
              Ver Catálogo <FaArrowRight />
            </Link>
            <Link to="/contacto" className="btn-secondary">
              Contacto
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Productos Destacados */}
      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Lo más buscado</span>
          <h2 className={styles.sectionTitle}>Productos Destacados</h2>
        </div>

        <div className={styles.featuredGrid}>
          {featuredProducts.map((product) => (
            <article key={product.id} className={`${styles.productCard} card-premium`}>
              <div className={styles.productImageWrapper}>
                {product.featured && <span className={styles.productTag}>Destacado</span>}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={styles.productImg}
                  loading="lazy" 
                />
              </div>

              <div className={styles.productMeta}>
                <span className={styles.productCategory}>{product.category}</span>
                <span className={styles.productPrice}>S/ {product.price.toFixed(2)}</span>
              </div>

              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              
              <Link to={`/producto/${product.id}`} className={`${styles.cardAction} btn-secondary`}>
                Ver Detalles
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Sección de Beneficios */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Ventajas de POWERFIT</span>
            <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          </div>

          <div className={styles.benefitsGrid}>
            {/* Beneficio 1 */}
            <div className={`${styles.benefitCard} card-premium`}>
              <div className={styles.benefitIconWrapper}>
                <FaShippingFast />
              </div>
              <h3 className={styles.benefitTitle}>Envío Express</h3>
              <p className={styles.benefitDesc}>
                Realizamos entregas rápidas y seguras a todo el país. Recibe tus suplementos en 24/48 horas directo en tu puerta.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className={`${styles.benefitCard} card-premium`}>
              <div className={styles.benefitIconWrapper}>
                <FaAward />
              </div>
              <h3 className={styles.benefitTitle}>Calidad Garantizada</h3>
              <p className={styles.benefitDesc}>
                Suplementos de la más alta pureza procedentes de marcas líderes. Analizados e inspeccionados rigurosamente.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className={`${styles.benefitCard} card-premium`}>
              <div className={styles.benefitIconWrapper}>
                <FaWhatsapp />
              </div>
              <h3 className={styles.benefitTitle}>Asesoría WhatsApp</h3>
              <p className={styles.benefitDesc}>
                ¿No sabes qué elegir? Nuestro equipo de expertos te asesora de forma gratuita para ayudarte a alcanzar tus metas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección CTA (Call To Action) */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Listo para superar tus límites?</h2>
          <p className={styles.ctaDesc}>
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
