import React from 'react';
import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
};


export default App;

