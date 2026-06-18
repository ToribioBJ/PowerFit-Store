import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCart();

  const prevCartCountRef = useRef(cartCount);
  const autoCloseTimerRef = useRef<number | undefined>(undefined);

  // Auto-open mini-cart briefly when item is added
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsMiniCartOpen(true);

      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      autoCloseTimerRef.current = setTimeout(() => {
        setIsMiniCartOpen(false);
      }, 3000) as unknown as number;
    }
    prevCartCountRef.current = cartCount;

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [cartCount]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleWhatsAppCheckout = () => {
    setIsMiniCartOpen(false);
    let message = '¡Hola PowerFit Store! Deseo realizar el siguiente pedido:\n\n';
    message += '*Productos:*\n';
    cartItems.forEach((item) => {
      const finalPrice = item.product.price * (1 - item.product.discount / 100);
      message += `- ${item.quantity} x ${item.product.name} (S/ ${(finalPrice * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total a Pagar:* S/ ${cartTotal.toFixed(2)}\n`;
    message += '*Envío:* Express Gratis ⚡\n\n';
    message += 'Quedo atento para coordinar la entrega y el método de pago. ¡Gracias!';
    
    window.open(`https://wa.me/51987654321?text=${encodeURIComponent(message)}`, '_blank');
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
            to="/nosotros" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Nosotros
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
          {/* Cart Wrapper with Dropdown */}
          <div 
            className={styles.cartWrapper}
            onMouseEnter={() => {
              if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
              setIsMiniCartOpen(true);
            }}
            onMouseLeave={() => setIsMiniCartOpen(false)}
          >
            <Link to="/carrito" className={styles.cartBtn} title="Ver Carrito">
              <FaShoppingCart className={styles.cartIcon} />
              <span className={styles.cartBadge}>{cartCount}</span>
            </Link>

            {/* Mini Cart Panel */}
            {isMiniCartOpen && (
              <div className={styles.miniCartDropdown}>
                <h3 className={styles.miniCartTitle}>Mi Carrito ({cartCount})</h3>
                
                {cartItems.length === 0 ? (
                  <div className={styles.miniCartEmpty}>
                    Tu carrito está vacío.
                  </div>
                ) : (
                  <>
                    <div className={styles.miniCartList}>
                      {cartItems.map((item) => {
                        const finalPrice = item.product.price * (1 - item.product.discount / 100);
                        return (
                          <div key={item.product.id} className={styles.miniCartItem}>
                            <div className={styles.miniCartImgWrapper}>
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className={styles.miniCartImg} 
                              />
                            </div>
                            
                            <div className={styles.miniCartItemDetails}>
                              <span className={styles.miniCartItemName} title={item.product.name}>
                                {item.product.name}
                              </span>
                              <span className={styles.miniCartItemBrand}>
                                {item.product.brand}
                              </span>
                              <div className={styles.miniCartItemMeta}>
                                <span className={styles.miniCartItemQty}>
                                  {item.quantity} x <span className={styles.miniCartItemPrice}>S/ {finalPrice.toFixed(2)}</span>
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className={styles.miniCartDeleteBtn}
                              title="Eliminar del carrito"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.miniCartFooter}>
                      <div className={styles.miniCartTotalRow}>
                        <span>Total:</span>
                        <span className={styles.miniCartTotalVal}>S/ {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className={styles.miniCartActions}>
                        <Link 
                          to="/carrito" 
                          className="btn-secondary styles.viewCartBtn"
                          onClick={() => setIsMiniCartOpen(false)}
                          style={{ fontSize: '0.75rem', padding: '10px' }}
                        >
                          Ver Carrito
                        </Link>
                        <button
                          onClick={handleWhatsAppCheckout}
                          className={styles.checkoutBtn}
                        >
                          <FaWhatsapp /> Pagar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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
            to="/nosotros" 
            className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileActive}` : styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Nosotros
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
