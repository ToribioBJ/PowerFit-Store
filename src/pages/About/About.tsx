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

const About: React.FC = () => {
  return (
    <div className="py-10 md:py-20 min-h-screen container">
      {/* 1. Header */}
      <header className="text-center mb-14">
        <span className="font-title font-black text-[0.9rem] text-accent tracking-widest uppercase mb-3 block">¿Quiénes Somos?</span>
        <h1 className="text-4xl font-extrabold uppercase text-gradient font-title">Sobre Nerito Suplements</h1>
      </header>

      {/* 2. Intro Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center mb-20">
        <div className="card-premium flex items-center justify-center relative aspect-[1.2/1] overflow-hidden max-w-[450px] lg:max-w-none mx-auto w-full after:content-[''] after:absolute after:w-[250px] after:h-[250px] after:bg-accent after:rounded-full after:blur-[80px] after:opacity-20 after:z-1">
          <img
            src="/src/assets/nerito_logo.png"
            alt="Nerito Suplements Suplementación"
            className="max-w-[90%] max-h-[90%] object-contain z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-extrabold uppercase text-gradient font-title">Nuestra Historia</h2>
          <p className="text-[1.05rem] leading-relaxed text-text-secondary">
            Fundada en 2021 por atletas y profesionales de la salud, **Nerito Suplements** nació con el firme propósito de democratizar el acceso a suplementación deportiva de auténtico grado élite. Observamos que el mercado estaba saturado de productos con fórmulas obsoletas y rellenos innecesarios, y decidimos marcar una diferencia.
          </p>
          <p className="text-[1.05rem] leading-relaxed text-text-secondary">
            Hoy en día, seleccionamos minuciosamente proteínas, creatinas y pre-entrenamientos importados de laboratorios regulados con las certificaciones más estrictas del sector. Nuestra misión no es simplemente vender suplementos, sino dotar a cada deportista de las herramientas necesarias para alcanzar su máximo potencial físico y mental.
          </p>
        </div>
      </section>

      {/* 3. Misión & Visión */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="card-premium flex flex-col gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-2xl shadow-glow">
            <FaHistory />
          </div>
          <h3 className="text-2xl font-extrabold uppercase text-text-primary font-title">Nuestra Misión</h3>
          <p className="text-base leading-relaxed text-text-secondary">
            Proporcionar suplementación de la más alta pureza y base científica a atletas exigentes, respaldándolos con asesoría especializada y un servicio express ágil para que rompan sus límites en cada entrenamiento.
          </p>
        </div>

        <div className="card-premium flex flex-col gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-2xl shadow-glow">
            <FaEye />
          </div>
          <h3 className="text-2xl font-extrabold uppercase text-text-primary font-title">Nuestra Visión</h3>
          <p className="text-base leading-relaxed text-text-secondary">
            Ser reconocidos en el 2030 como la marca de e-commerce y asesoría deportiva líder en el país, impulsando a una comunidad unida por la disciplina, la superación física y un estilo de vida saludable.
          </p>
        </div>
      </section>

      {/* 4. Valores */}
      <section className="bg-secondary/40 backdrop-blur-md border-t border-b border-border-brand/40 py-20 px-6 mx-[-24px] mb-20 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-accent/20 before:to-transparent">
        <div className="container">
          <div className="text-center mb-12">
            <span className="font-title font-black text-[0.85rem] text-accent tracking-widest uppercase mb-3 block">Lo que nos guía</span>
            <h2 className="text-3xl font-extrabold uppercase text-gradient font-title">Nuestros Valores Corporativos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Valor 1 */}
            <div className="card-premium text-center flex flex-col items-center gap-4">
              <FaShieldAlt className="text-[2.5rem] text-accent mb-2 drop-shadow-[0_4px_10px_rgba(146,58,43,0.3)]" />
              <h4 className="text-[1.25rem] font-extrabold uppercase text-text-primary font-title">Pureza Garantizada</h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Trabajamos exclusivamente con marcas de renombre que publican análisis de laboratorio de terceros. Sin rellenos, sin sorpresas, solo ingredientes que funcionan.
              </p>
            </div>

            {/* Valor 2 */}
            <div className="card-premium text-center flex flex-col items-center gap-4">
              <FaAward className="text-[2.5rem] text-accent mb-2 drop-shadow-[0_4px_10px_rgba(146,58,43,0.3)]" />
              <h4 className="text-[1.25rem] font-extrabold uppercase text-text-primary font-title">Calidad y Ciencia</h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Cada producto en nuestro catálogo está respaldado por investigaciones científicas sólidas sobre rendimiento, asimilación de nutrientes y salud integral.
              </p>
            </div>

            {/* Valor 3 */}
            <div className="card-premium text-center flex flex-col items-center gap-4">
              <FaHeartbeat className="text-[2.5rem] text-accent mb-2 drop-shadow-[0_4px_10px_rgba(146,58,43,0.3)]" />
              <h4 className="text-[1.25rem] font-extrabold uppercase text-text-primary font-title">Compromiso con el Atleta</h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Tu objetivo es el nuestro. Ofrecemos asesoría gratuita por WhatsApp para garantizar que inviertas en lo que realmente te dará resultados óptimos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section>
        <div className="bg-gradient-to-br from-secondary/80 to-accent/5 backdrop-blur-md border border-border-brand/50 rounded-2xl py-16 px-5 md:px-10 text-center max-w-[800px] mx-auto flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          <h2 className="text-3xl md:text-[2.25rem] font-black uppercase text-gradient font-title">¿Listo para alcanzar tu mejor versión?</h2>
          <p className="text-[1.1rem] text-text-secondary max-w-[550px] leading-relaxed">
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
