import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';
import PromotionDetail from '../pages/PromotionDetail';
import Cart from '../pages/Cart';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

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
        
        {/* Ruta 404 (NotFound) fuera del Layout para diseño limpio */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

