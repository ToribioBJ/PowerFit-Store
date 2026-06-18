import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          POWER<span>FIT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/catalogo" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Catálogo
          </NavLink>
          <NavLink 
            to="/contacto" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Contacto
          </NavLink>
        </nav>

        {/* Action Buttons */}
        <div className={styles.navActions}>
          <Link to="/carrito" className={styles.cartBtn} title="Ver Carrito">
            <FaShoppingCart className={styles.cartIcon} />
            <span className={styles.cartBadge}>0</span>
          </Link>

          {/* Hamburger Menu Icon */}
          <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Menú">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`${styles.mobileNavContainer} ${isMobileMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileActive}` : styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/catalogo" 
            className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileActive}` : styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Catálogo
          </NavLink>
          <NavLink 
            to="/contacto" 
            className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileActive}` : styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Contacto
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
