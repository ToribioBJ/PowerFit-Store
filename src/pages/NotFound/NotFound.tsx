import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[75vh] px-6 text-center py-16">
      <div className="flex flex-col items-center gap-4 max-w-[500px] animate-fadeIn">
        <h1 className="text-8xl font-black text-accent drop-shadow-[0_0_30px_rgba(146,58,43,0.3)] m-0 leading-none font-title">
          404
        </h1>
        <h2 className="text-2xl font-extrabold uppercase text-text-primary m-0 tracking-wider font-title">
          PÁGINA NO ENCONTRADA
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4 text-[1rem]">
          Lo sentimos, el suplemento o la sección que estás buscando no existe, ha sido movida o está temporalmente fuera de stock.
        </p>
        <Link to="/" className="btn-primary">
          Regresar al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
