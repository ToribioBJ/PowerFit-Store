import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/60 backdrop-blur-md border-t border-border-brand/40 pt-16 mt-auto relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-accent/40 before:to-transparent">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-12 pb-12 container">
        {/* Brand Info */}
        <div className="flex flex-col">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <img
              src="/src/assets/nerito_logo.png"
              alt="NERITO Logo"
              className="h-[54px] w-[54px] object-contain drop-shadow-[0_0_6px_rgba(146,58,43,0.4)] transition-transform duration-200 group-hover:scale-108 group-hover:rotate-3"
            />
            <span className="font-brand font-bold text-[1.75rem] tracking-wide text-text-primary flex items-center">
              NERITO<span className="text-accent">SUPLEMENTS</span>
            </span>
          </Link>
          <p className="text-text-secondary text-[0.95rem] mb-6 max-w-[380px] lg:max-w-none">
            Suplementación deportiva premium para atletas y entusiastas del fitness. Alcanza tu máximo potencial con productos de calidad mundial.
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/80 border border-border-brand/60 text-text-secondary transition-all duration-300 text-lg hover:bg-accent hover:border-accent hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-glow-accent" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/80 border border-border-brand/60 text-text-secondary transition-all duration-300 text-lg hover:bg-accent hover:border-accent hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-glow-accent" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/80 border border-border-brand/60 text-text-secondary transition-all duration-300 text-lg hover:bg-accent hover:border-accent hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-glow-accent" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="font-title font-extrabold text-[1.1rem] uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent text-gradient-gold">Navegación</h3>
          <ul className="list-none flex flex-col gap-3">
            <li><Link to="/" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-accent hover:pl-2">Inicio</Link></li>
            <li><Link to="/nosotros" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-accent hover:pl-2">Nosotros</Link></li>
            <li><Link to="/catalogo" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-accent hover:pl-2">Catálogo</Link></li>
            <li><Link to="/contacto" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-accent hover:pl-2">Contacto</Link></li>
            <li><Link to="/carrito" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-accent hover:pl-2">Ver Carrito</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col">
          <h3 className="font-title font-extrabold text-[1.1rem] uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-accent text-gradient-gold">Contacto</h3>
          <ul className="list-none flex flex-col gap-4 mb-6">
            <li className="flex items-start gap-3 text-text-secondary text-[0.95rem]">
              <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
              <span>Av. Fitness 456, Lima, Perú</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary text-[0.95rem]">
              <FaPhoneAlt className="text-accent mt-1 shrink-0" />
              <span>+51 924 215 942</span>
            </li>
            <li className="flex items-start gap-3 text-text-secondary text-[0.95rem]">
              <FaEnvelope className="text-accent mt-1 shrink-0" />
              <span>neritosuplements@gmail.com</span>
            </li>
          </ul>

          {/* WhatsApp Quick CTA */}
          <a
            href="https://wa.me/51924215942?text=Hola%20Nerito%20Suplements%2C%20quisiera%20hacer%20una%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex! text-[0.85rem]! px-5! py-2.5! w-auto"
          >
            <FaWhatsapp /> Soporte WhatsApp
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-primary/80 border-t border-border-brand/40 py-6 text-[0.85rem] text-text-muted">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>&copy; {currentYear} NERITO Suplements. Todos los derechos reservados. Diseñado para atletas.</p>
          <Link to="/admin" className="text-text-muted hover:text-accent font-extrabold uppercase tracking-wider text-[0.72rem] transition-colors duration-200">
            Panel Admin 🔒
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
