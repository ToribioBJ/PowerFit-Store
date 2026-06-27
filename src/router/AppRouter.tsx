import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Catalog from '../pages/Catalog/Catalog';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import PromotionDetail from '../pages/PromotionDetail/PromotionDetail';
import Cart from '../pages/Cart/Cart';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound/NotFound';
import Admin from '../pages/Admin/Admin';
import { useAuth } from '../context/AuthContext';

// Componente para proteger las rutas de administración
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ openLogin: true, from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas envueltas en el Layout General */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<About />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="producto/:id" element={<ProductDetail />} />
          <Route path="promocion/:id" element={<PromotionDetail />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="contacto" element={<Contact />} />
        </Route>

        
        {/* Ruta de administración protegida */}
        <Route 
          path="admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        
        {/* Ruta 404 (NotFound) fuera del Layout para diseño limpio */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


