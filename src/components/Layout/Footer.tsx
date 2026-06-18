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
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContainer} container`}>
        {/* Brand Info */}
        <div className={styles.footerBrand}>
          <Link to="/" className={styles.logo}>
            POWER<span>FIT</span>
          </Link>
          <p className={styles.brandDesc}>
            Suplementación deportiva premium para atletas y entusiastas del fitness. Alcanza tu máximo potencial con productos de calidad mundial.
          </p>
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerLinks}>
          <h3 className={styles.sectionTitle}>Navegación</h3>
          <ul className={styles.linksList}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/carrito">Ver Carrito</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerContact}>
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <ul className={styles.contactList}>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Av. Fitness 456, Lima, Perú</span>
            </li>
            <li>
              <FaPhoneAlt className={styles.contactIcon} />
              <span>+51 987 654 321</span>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <span>soporte@powerfit.com</span>
            </li>
          </ul>
          
          {/* WhatsApp Quick CTA */}
          <a 
            href="https://wa.me/51987654321?text=Hola%20PowerFit%20Store%2C%20quisiera%20hacer%20una%20consulta." 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`${styles.waCTA} btn-whatsapp`}
          >
            <FaWhatsapp /> Soporte WhatsApp
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className={styles.copyrightBar}>
        <div className="container">
          <p>&copy; {currentYear} POWERFIT Store. Todos los derechos reservados. Diseñado para atletas.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
