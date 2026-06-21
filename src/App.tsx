import React from 'react';
import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import './App.css';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </StoreProvider>
  );
};

export default App;

