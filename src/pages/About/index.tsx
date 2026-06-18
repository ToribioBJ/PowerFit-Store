import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHistory, 
  FaEye, 
  FaShieldAlt, 
  FaAward, 
  FaHeartbeat, 
  FaArrowRight 
} from 'react-icons/fa';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={`${styles.aboutContainer} container`}>
      {/* 1. Header */}
      <header className={styles.aboutHeader}>
        <span className={styles.aboutSubtitle}>¿Quiénes Somos?</span>
        <h1 className={styles.aboutTitle}>Sobre PowerFit Store</h1>
      </header>

      {/* 2. Intro Section */}
      <section className={styles.introSection}>
        <div className={styles.introImageWrapper}>
          <img 
            src="/src/assets/hero.png" 
            alt="PowerFit Store Suplementación" 
            className={styles.introImg} 
          />
        </div>
        
        <div className={styles.introContent}>
          <h2>Nuestra Historia</h2>
          <p>
            Fundada en 2021 por atletas y profesionales de la salud, **PowerFit Store** nació con el firme propósito de democratizar el acceso a suplementación deportiva de auténtico grado élite. Observamos que el mercado estaba saturado de productos con fórmulas obsoletas y rellenos innecesarios, y decidimos marcar una diferencia.
          </p>
          <p>
            Hoy en día, seleccionamos minuciosamente proteínas, creatinas y pre-entrenamientos importados de laboratorios regulados con las certificaciones más estrictas del sector. Nuestra misión no es simplemente vender suplementos, sino dotar a cada deportista de las herramientas necesarias para alcanzar su máximo potencial físico y mental.
          </p>
        </div>
      </section>

      {/* 3. Misión & Visión */}
      <section className={styles.missionVisionGrid}>
        <div className={styles.mvCard}>
          <div className={styles.mvIconWrapper}>
            <FaHistory />
          </div>
          <h3>Nuestra Misión</h3>
          <p>
            Proporcionar suplementación de la más alta pureza y base científica a atletas exigentes, respaldándolos con asesoría especializada y un servicio express ágil para que rompan sus límites en cada entrenamiento.
          </p>
        </div>

        <div className={styles.mvCard}>
          <div className={styles.mvIconWrapper}>
            <FaEye />
          </div>
          <h3>Nuestra Visión</h3>
          <p>
            Ser reconocidos en el 2030 como la marca de e-commerce y asesoría deportiva líder en el país, impulsando a una comunidad unida por la disciplina, la superación física y un estilo de vida saludable.
          </p>
        </div>
      </section>

      {/* 4. Valores */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <span className={styles.aboutSubtitle}>Lo que nos guía</span>
            <h2 className={styles.valuesTitle}>Nuestros Valores Corporativos</h2>
          </div>

          <div className={styles.valuesGrid}>
            {/* Valor 1 */}
            <div className={styles.valueCard}>
              <FaShieldAlt className={styles.valueIcon} />
              <h4>Pureza Garantizada</h4>
              <p>
                Trabajamos exclusivamente con marcas de renombre que publican análisis de laboratorio de terceros. Sin rellenos, sin sorpresas, solo ingredientes que funcionan.
              </p>
            </div>

            {/* Valor 2 */}
            <div className={styles.valueCard}>
              <FaAward className={styles.valueIcon} />
              <h4>Calidad y Ciencia</h4>
              <p>
                Cada producto en nuestro catálogo está respaldado por investigaciones científicas sólidas sobre rendimiento, asimilación de nutrientes y salud integral.
              </p>
            </div>

            {/* Valor 3 */}
            <div className={styles.valueCard}>
              <FaHeartbeat className={styles.valueIcon} />
              <h4>Compromiso con el Atleta</h4>
              <p>
                Tu objetivo es el nuestro. Ofrecemos asesoría gratuita por WhatsApp para garantizar que inviertas en lo que realmente te dará resultados óptimos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>¿Listo para alcanzar tu mejor versión?</h2>
          <p className={styles.ctaDesc}>
            Explora nuestro catálogo seleccionado de proteínas puras, creatinas micronizadas y fórmulas de pre-entrenamiento explosivas.
          </p>
          <Link to="/catalogo" className="btn-primary">
            Ir al Catálogo <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
