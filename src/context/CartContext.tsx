/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem } from '../interfaces';


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
};

interface ToastState {
  show: boolean;
  message: string;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cargar estado inicial desde localStorage si existe
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('powerfit_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('powerfit_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  // Auto-ocultar toast después de 3 segundos
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Validar límite de stock
        if (newQuantity > product.stock) {
          showToast(`¡Solo quedan ${product.stock} unidades disponibles de ${product.name}!`);
          return prevItems;
        }
        
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        showToast(`Agregado al carrito: ${quantity} x ${product.name}`);
        return updatedItems;
      } else {
        // Validar límite de stock
        if (quantity > product.stock) {
          showToast(`¡Solo quedan ${product.stock} unidades disponibles de ${product.name}!`);
          return prevItems;
        }
        showToast(`Agregado al carrito: ${product.name}`);
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    const itemToRemove = cartItems.find((item) => item.product.id === productId);
    if (itemToRemove) {
      setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      showToast(`Eliminado del carrito: ${itemToRemove.product.name}`);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            showToast(`¡Solo quedan ${item.product.stock} unidades en stock!`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Carrito vaciado');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        showToast,
      }}
    >
      {children}
      
      {/* Toast Notification Premium Global */}
      {toast.show && (
        <div className="toast-notification-premium">
          <div className="toast-body">
            <span className="toast-icon">✓</span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};
