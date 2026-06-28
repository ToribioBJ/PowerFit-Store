import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTrash, 
  FaWhatsapp, 
  FaArrowLeft, 
  FaShoppingBag, 
  FaUser, 
  FaPhoneAlt, 
  FaCheckCircle, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { addOrder } = useStore();

  // Estados locales para controlar el flujo de compra
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [lastOrderId, setLastOrderId] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // WhatsApp checkout details
  const whatsappNumber = '51924215942'; // Configurado para Perú (+51)

  const handleProceedToCheckout = () => {
    setCheckoutStep('checkout');
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!customerName.trim()) {
      newErrors.name = 'El nombre completo es obligatorio';
    }
    if (!customerPhone.trim()) {
      newErrors.phone = 'El número de teléfono es obligatorio';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(customerPhone.trim())) {
      newErrors.phone = 'Ingrese un número de teléfono válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Registrar pedido en StoreContext (esto reduce existencias y guarda en historial)
    const orderId = addOrder(cartItems, cartTotal, customerName, customerPhone);
    setLastOrderId(orderId);

    // Generate text message for WhatsApp
    let message = '¡Hola Nerito Suplements! Deseo realizar el siguiente pedido:\n\n';
    message += `*Orden:* #${orderId}\n`;
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
    setLastWhatsAppUrl(whatsappUrl);

    // Intentar abrir WhatsApp en pestaña nueva
    window.open(whatsappUrl, '_blank');
    
    // Cambiar al paso de éxito
    setCheckoutStep('success');
    
    // Vaciar el carrito tras compra exitosa
    clearCart();
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="pt-4 pb-12 md:pt-8 md:pb-20 min-h-screen container animate-fadeIn">
      <header className="text-center mb-10">
        <span className="font-title font-black text-[0.9rem] text-accent tracking-widest uppercase mb-3 block">Tus Suplementos</span>
        <h1 className="text-4xl font-extrabold uppercase text-gradient font-title">Carrito de Compras</h1>
      </header>

      {checkoutStep === 'success' ? (
        <section className="text-center py-16 px-6 card-premium max-w-[650px] mx-auto animate-[fadeIn_0.5s_ease-out]">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center text-[3rem] mb-6 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-pulse">
            <FaCheckCircle />
          </div>
          <h2 className="text-[2rem] mb-3 uppercase font-title font-extrabold text-text-primary">¡Pedido Registrado con Éxito!</h2>
          <p className="text-accent font-mono font-bold text-lg mb-6">Código de Orden: #{lastOrderId}</p>
          
          <div className="bg-primary/60 border border-border-brand/40 rounded-xl p-6 mb-8 text-left">
            <h4 className="font-bold text-text-primary mb-3 text-[0.95rem] uppercase tracking-wider font-title">¿Qué sigue ahora?</h4>
            <ul className="text-text-secondary text-sm flex flex-col gap-2.5">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>Hemos abierto una pestaña para chatear por WhatsApp con un asesor en el número <strong>+51 924 215 942</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>Allí podrás coordinar el método de pago (Yape, Plin, Transferencia) y confirmar los detalles de tu envío express gratis.</span>
              </li>
              <li className="flex items-start gap-2 text-amber-500 bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/10 mt-1">
                <span className="mt-0.5 mr-1.5"><FaExclamationTriangle size={14} className="shrink-0" /></span>
                <span className="text-[0.78rem] leading-snug">Si tu navegador bloqueó la ventana emergente o cerraste el chat por error, utiliza el botón verde de abajo para volver a abrir el chat con tu pedido.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={lastWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp h-[52px] px-8 flex items-center justify-center gap-2.5 font-bold cursor-pointer text-center"
            >
              <FaWhatsapp className="text-[1.3rem]" /> Reabrir Chat de WhatsApp
            </a>
            <Link
              to="/catalogo"
              className="btn-secondary h-[52px] px-8 flex items-center justify-center gap-2 text-center"
            >
              Volver al Catálogo
            </Link>
          </div>
        </section>
      ) : isCartEmpty ? (
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
          {/* Left Side: Items List OR Checkout Form */}
          {checkoutStep === 'cart' ? (
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
          ) : (
            <div className="card-premium p-6 md:p-8 flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out]">
              <h2 className="text-xl font-title font-extrabold uppercase text-text-primary border-b border-border-brand/40 pb-3 mb-2">Datos de Entrega</h2>
              <form onSubmit={handleWhatsAppCheckout} className="flex flex-col gap-5">
                {/* Nombre Completo */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="customerName" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Nombre Completo *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-text-muted/65"><FaUser size={14} /></span>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-primary/80 border border-border-brand/60 text-text-primary py-3 px-4 pl-10 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    />
                  </div>
                  {errors.name && <span className="text-red-500 text-[0.8rem] font-semibold">{errors.name}</span>}
                </div>

                {/* Teléfono / WhatsApp */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="customerPhone" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Teléfono / WhatsApp *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-text-muted/65"><FaPhoneAlt size={14} /></span>
                    <input
                      type="tel"
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Ej. 924215942"
                      className="w-full bg-primary/80 border border-border-brand/60 text-text-primary py-3 px-4 pl-10 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    />
                  </div>
                  {errors.phone && <span className="text-red-500 text-[0.8rem] font-semibold">{errors.phone}</span>}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="btn-secondary py-3 px-6 text-[0.9rem] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto order-2 sm:order-1"
                  >
                    <FaArrowLeft /> Volver al Carrito
                  </button>
                  <button
                    type="submit"
                    className="btn-whatsapp py-3 px-8 text-[0.9rem] font-bold flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto flex-grow order-1 sm:order-2 text-center"
                  >
                    <FaWhatsapp className="text-[1.2rem]" /> Confirmar y Abrir WhatsApp
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Right Side: Order Summary Panel */}
          <aside className="card-premium p-6 md:p-8">
            <h2 className="text-2xl font-title font-extrabold uppercase text-text-primary border-b border-border-brand/40 pb-3 mb-6 font-title">Resumen del Pedido</h2>
            
            {/* Products small overview in checkout mode */}
            {checkoutStep === 'checkout' && (
              <div className="flex flex-col gap-3 mb-5 max-h-[200px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs text-text-secondary border-b border-border-brand/20 pb-2">
                    <span>{item.quantity} x {item.product.name}</span>
                    <span className="font-semibold text-text-primary">
                      S/ {(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

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

            {checkoutStep === 'cart' ? (
              <button
                onClick={handleProceedToCheckout}
                className="btn-whatsapp w-full h-[52px] flex items-center justify-center gap-2.5 mb-4"
              >
                <FaWhatsapp className="text-[1.3rem]" /> Proceder a WhatsApp
              </button>
            ) : (
              <div className="bg-accent/5 border border-border-glow text-[0.8rem] text-accent p-3.5 rounded-lg text-center font-bold mb-4 animate-pulse uppercase tracking-wider">
                Completa tus datos a la izquierda
              </div>
            )}
            
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
