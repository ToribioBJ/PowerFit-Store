import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaWhatsapp, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { addOrder } = useStore();

  // WhatsApp checkout details
  const whatsappNumber = '51924215942'; // Configurado para Perú (+51)

  const handleWhatsAppCheckout = () => {
    const customerName = prompt('Por favor, ingresa tu nombre completo para coordinar por WhatsApp:') || 'Cliente Web';
    const customerPhone = prompt('Por favor, ingresa tu número de teléfono de contacto:') || 'Sin teléfono';

    // Registrar pedido en StoreContext (esto reduce existencias y guarda en historial)
    addOrder(cartItems, cartTotal, customerName, customerPhone);

    // Generate text message for WhatsApp
    let message = '¡Hola Nerito Suplements! Deseo realizar el siguiente pedido:\n\n';
    message += `*Cliente:* ${customerName}\n`;
    message += `*Teléfono:* ${customerPhone}\n\n`;
    message += '*Productos:*\n';

    cartItems.forEach((item) => {
      const finalPrice = item.product.price * (1 - item.product.discount / 100);
      const itemSubtotal = finalPrice * item.quantity;
      message += `- ${item.quantity} x ${item.product.name} (S/ ${itemSubtotal.toFixed(2)})\n`;
    });

    message += `\n*Total a Pagar:* S/ ${cartTotal.toFixed(2)}\n`;
    message += '*Envío:* Express Gratis ⚡\n\n';
    message += 'Quedo atento para coordinar la entrega y el método de pago. ¡Gracias!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    // Vaciar el carrito tras compra exitosa
    clearCart();
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="py-10 md:py-20 min-h-screen container animate-fadeIn">
      <header className="text-center mb-10">
        <span className="font-title font-black text-[0.9rem] text-accent tracking-widest uppercase mb-3 block">Tus Suplementos</span>
        <h1 className="text-4xl font-extrabold uppercase text-gradient font-title">Carrito de Compras</h1>
      </header>

      {isCartEmpty ? (
        <section className="text-center py-16 px-6 card-premium max-w-[600px] mx-auto">
          <FaShoppingBag className="text-[4rem] text-text-muted mb-6 mx-auto" />
          <h2 className="text-[1.75rem] mb-3 uppercase font-title font-extrabold text-text-primary">Tu carrito está vacío</h2>
          <p className="text-text-secondary mb-8">
            Aún no has agregado ningún producto. Visita nuestro catálogo para encontrar el suplemento perfecto para tus objetivos.
          </p>
          <Link to="/catalogo" className="btn-primary">
            Explorar Catálogo
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 items-start">
          {/* Left Side: Items List */}
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => (
              <article key={item.product.id} className="card-premium grid grid-cols-[72px_1fr_1fr] md:grid-cols-[80px_2fr_1fr_1fr_40px] items-center gap-4 md:gap-5 p-4 md:p-5 relative">
                <div className="bg-white rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden p-2 border border-border-brand/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-w-[85%] max-h-[85%] object-contain"
                  />
                </div>

                <div className="flex flex-col col-span-2 md:col-span-1 pr-8 md:pr-0">
                  <h3 className="text-base md:text-lg font-bold text-text-primary font-title">{item.product.name}</h3>
                  <span className="text-[0.8rem] text-text-muted uppercase tracking-wider font-semibold">{item.product.category}</span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-border-brand/60 rounded-lg bg-primary/80 h-9 w-[100px] overflow-hidden col-span-1 col-start-2 md:col-span-1 md:col-start-auto mt-2 md:mt-0 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-base text-text-secondary transition-colors duration-200 hover:enabled:bg-accent/15 hover:enabled:text-accent disabled:text-text-muted disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Restar uno"
                  >
                    -
                  </button>
                  <span className="flex-grow text-center text-[0.95rem] font-bold text-text-primary">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-base text-text-secondary transition-colors duration-200 hover:enabled:bg-accent/15 hover:enabled:text-accent disabled:text-text-muted disabled:cursor-not-allowed cursor-pointer"
                    disabled={item.quantity >= item.product.stock}
                    aria-label="Sumar uno"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right font-title font-black text-accent text-[1.15rem] col-span-1 col-start-3 md:col-span-1 md:col-start-auto mt-2 md:mt-0 drop-shadow-[0_2px_8px_rgba(146,58,43,0.2)]">
                  S/ {(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-text-muted text-[1.1rem] flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full transition-all duration-200 hover:text-red-500 hover:bg-red-500/10 absolute top-2.5 right-2.5 md:static cursor-pointer"
                  title="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </article>
            ))}

            {/* List Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2.5">
              <button 
                onClick={clearCart} 
                className="text-text-muted hover:text-red-500 hover:border-red-500 transition-all duration-300 py-2.5 px-6 border border-dashed border-border-brand/60 rounded-lg text-[0.85rem] font-bold inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto hover:bg-red-500/5"
              >
                <FaTrash /> Vaciar Carrito
              </button>
              <Link 
                to="/catalogo" 
                className="btn-secondary py-2.5 px-6 text-[0.85rem] text-center w-full sm:w-auto"
              >
                <FaArrowLeft /> Seguir Comprando
              </Link>
            </div>
          </div>

          {/* Right Side: Order Summary Panel */}
          <aside className="card-premium p-6 md:p-8">
            <h2 className="text-2xl font-title font-extrabold uppercase text-text-primary border-b border-border-brand/40 pb-3 mb-6">Resumen del Pedido</h2>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between text-[0.95rem] text-text-secondary">
                <span>Subtotal</span>
                <span>S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[0.95rem] text-text-secondary">
                <span>Envío</span>
                <span className="text-accent font-bold">Gratis</span>
              </div>
              <div className="h-[1px] bg-border-brand/40 my-2"></div>
              <div className="flex justify-between font-title text-[1.35rem] font-black text-text-primary">
                <span>Total</span>
                <span className="text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">S/ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="btn-whatsapp w-full h-[52px] flex items-center justify-center gap-2.5 mb-4"
            >
              <FaWhatsapp className="text-[1.3rem]" /> Proceder a WhatsApp
            </button>
            <p className="text-[0.8rem] text-text-muted text-center leading-normal">
              Serás redirigido a WhatsApp para finalizar tu compra de forma segura con un asesor.
            </p>
          </aside>
        </section>
      )}
    </div>
  );
};

export default Cart;
