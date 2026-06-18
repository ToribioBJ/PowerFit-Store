import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaWhatsapp, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  // WhatsApp checkout details
  const whatsappNumber = '51987654321'; // Configurado para Perú (+51)

  const handleWhatsAppCheckout = () => {
    // Generate text message for WhatsApp
    let message = '¡Hola PowerFit Store! Deseo realizar el siguiente pedido:\n\n';
    message += '*Productos:*\n';
    
    cartItems.forEach((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      message += `- ${item.quantity} x ${item.product.name} (S/ ${itemSubtotal.toFixed(2)})\n`;
    });
    
    message += `\n*Total a Pagar:* S/ ${cartTotal.toFixed(2)}\n`;
    message += '*Envío:* Express Gratis ⚡\n\n';
    message += 'Quedo atento para coordinar la entrega y el método de pago. ¡Gracias!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className={`${styles.cartContainer} container`}>
      <header className={styles.cartHeader}>
        <span className={styles.cartSubtitle}>Tus Suplementos</span>
        <h1 className={styles.cartTitle}>Carrito de Compras</h1>
      </header>

      {isCartEmpty ? (
        <section className={styles.emptyCart}>
          <FaShoppingBag className={styles.emptyCartIcon} />
          <h2 className={styles.emptyCartTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyCartDesc}>
            Aún no has agregado ningún producto. Visita nuestro catálogo para encontrar el suplemento perfecto para tus objetivos.
          </p>
          <Link to="/catalogo" className="btn-primary">
            Explorar Catálogo
          </Link>
        </section>
      ) : (
        <section className={styles.cartLayout}>
          {/* Left Side: Items List */}
          <div className={styles.itemsSection}>
            {cartItems.map((item) => (
              <article key={item.product.id} className={styles.cartItem}>
                <div className={styles.itemImageWrapper}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.itemImg}
                  />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.product.name}</h3>
                  <span className={styles.itemCategory}>{item.product.category}</span>
                </div>

                {/* Quantity Controls */}
                <div className={styles.qtyControl}>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className={styles.qtyBtn}
                    aria-label="Restar uno"
                  >
                    -
                  </button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className={styles.qtyBtn}
                    disabled={item.quantity >= item.product.stock}
                    aria-label="Sumar uno"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className={styles.itemPrice}>
                  S/ {(item.product.price * item.quantity).toFixed(2)}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className={styles.deleteBtn}
                  title="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </article>
            ))}

            {/* List Actions */}
            <div className={styles.listActions}>
              <button onClick={clearCart} className={styles.clearCartBtn}>
                <FaTrash /> Vaciar Carrito
              </button>
              <Link to="/catalogo" className={styles.keepShoppingLink}>
                <FaArrowLeft /> Seguir Comprando
              </Link>
            </div>
          </div>

          {/* Right Side: Order Summary Panel */}
          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Gratis</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalPrice}>S/ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className={styles.whatsappCheckoutBtn}
            >
              <FaWhatsapp style={{ fontSize: '1.3rem' }} /> Proceder a WhatsApp
            </button>
            <p className={styles.checkoutNotice}>
              Serás redirigido a WhatsApp para finalizar tu compra de forma segura con un asesor.
            </p>
          </aside>
        </section>
      )}
    </div>
  );
};

export default Cart;
