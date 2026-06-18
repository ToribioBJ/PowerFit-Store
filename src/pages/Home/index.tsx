import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaShippingFast, 
  FaAward, 
  FaWhatsapp, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';
import productsData from '../../data/products.json';
import type { Product } from '../../interfaces';
import styles from './Home.module.css';

interface Slide {
  id: number;
  subtitle: string;
  title: string;
  titleAccent: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgImage: string;
}

const Home: React.FC = () => {
  // Cast productsData to Product[] to guarantee typing safety
  const products: Product[] = productsData as Product[];
  
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured);

  // Carousel Slides Data
  const slides: Slide[] = [
    {
      id: 1,
      subtitle: "Promoción Especial",
      title: "15% de Descuento en ",
      titleAccent: "Whey Gold Protein",
      description: "Recuperación muscular rápida y desarrollo de masa magra. Aporta 24g de proteína de acción rápida por porción. ¡El suero más vendido al mejor precio!",
      buttonText: "Comprar Ahora",
      buttonLink: "/producto/1",
      image: "/src/assets/whey_protein.png",
      bgImage: "/src/assets/hero_bg.png"
    },
    {
      id: 2,
      subtitle: "Potencia tu Entrenamiento",
      title: "Lleva tu Fuerza al ",
      titleAccent: "Máximo Nivel",
      description: "Creatina monohidratada micronizada al 100%. Incrementa tu fuerza explosiva y optimiza la hidratación de tus células musculares hoy mismo.",
      buttonText: "Ver Creatina",
      buttonLink: "/producto/2",
      image: "/src/assets/creatine.png",
      bgImage: "/src/assets/hero_bg.png"
    },
    {
      id: 3,
      subtitle: "Energía Explosiva",
      title: "Desata el Poder del ",
      titleAccent: "Inferno Blast",
      description: "Pre-entrenamiento diseñado para maximizar el enfoque mental, congestión muscular y energía física extrema. Entrena sin límites.",
      buttonText: "Ver Pre-Entreno",
      buttonLink: "/producto/3",
      image: "/src/assets/pre_workout.png",
      bgImage: "/src/assets/hero_bg.png"
    }
  ];

  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Keep ref updated to avoid stale closures in useEffect
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  // Auto-play timer
  useEffect(() => {
    if (isHovered) return;
    
    const play = () => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    };

    const interval = setInterval(play, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className={styles.homeContainer}>
      {/* 1. Hero Banner: Carrusel de Promociones */}
      <section 
        className={styles.hero}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Carrusel de promociones"
      >
        <div className={styles.carousel}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${index === activeSlide ? styles.activeSlide : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(15, 15, 15, 1)), url(${slide.bgImage})` }}
            >
              <div className={`${styles.slideLayout} container`}>
                {/* Diapositiva Izquierda: Textos */}
                <div className={styles.heroContent}>
                  <span className={styles.heroSubtitle}>{slide.subtitle}</span>
                  <h1 className={styles.heroTitle}>
                    {slide.title}<span>{slide.titleAccent}</span>
                  </h1>
                  <p className={styles.heroDesc}>{slide.description}</p>
                  <div className={styles.heroButtons}>
                    <Link to={slide.buttonLink} className="btn-primary">
                      {slide.buttonText} <FaArrowRight />
                    </Link>
                    <Link to="/catalogo" className="btn-secondary">
                      Ver Catálogo
                    </Link>
                  </div>
                </div>

                {/* Diapositiva Derecha: Render de Producto */}
                <div className={styles.heroImageWrapper}>
                  <img 
                    src={slide.image} 
                    alt={slide.titleAccent} 
                    className={styles.heroProductImg}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Flechas de navegación */}
          <button 
            onClick={prevSlide} 
            className={`${styles.arrowBtn} ${styles.prevArrow}`}
            aria-label="Promoción anterior"
          >
            <FaChevronLeft />
          </button>
          <button 
            onClick={nextSlide} 
            className={`${styles.arrowBtn} ${styles.nextArrow}`}
            aria-label="Siguiente promoción"
          >
            <FaChevronRight />
          </button>

          {/* Indicadores de puntos (dots) */}
          <div className={styles.dotsContainer}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`${styles.dot} ${index === activeSlide ? styles.activeDot : ''}`}
                aria-label={`Ir a promoción ${index + 1}`}
              ></button>
            ))}
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
