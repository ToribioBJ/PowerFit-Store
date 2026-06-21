import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import AdminInventory from './components/AdminInventory';
import AdminStockAlerts from './components/AdminStockAlerts';
import AdminPromotions from './components/AdminPromotions';
import AdminOrders from './components/AdminOrders';
import ProductFormModal from './components/ProductFormModal';
import PromoFormModal from './components/PromoFormModal';
import type { Product, Promotion } from '../../interfaces';

const Admin: React.FC = () => {
  const { products, promotions, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'alerts' | 'promotions' | 'orders'>('dashboard');

  // Modal open states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Sidebar count calculations
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock <= 5).length + promotions.filter(p => p.stock <= 5).length;
  }, [products, promotions]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'Pendiente').length;
  }, [orders]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setShowProductModal(true);
  };

  const handleOpenEditPromo = (promo: Promotion) => {
    setEditingPromo(promo);
    setShowPromoModal(true);
  };

  return (
    <div className="py-6 md:py-12 min-h-screen container mx-auto px-4 animate-fadeIn relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* SIDEBAR */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* MAIN WORKSPACE */}
        <main className="flex-1 min-w-0">
          {/* Workspace Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border-brand/40 pb-6">
            <div>
              <h1 className="text-3xl font-title font-black uppercase tracking-wider text-gradient">
                {activeTab === 'dashboard' && 'Dashboard General'}
                {activeTab === 'products' && 'Administración de Inventario'}
                {activeTab === 'alerts' && 'Alertas de Stock Bajo'}
                {activeTab === 'promotions' && 'Gestión de Combos y Promociones'}
                {activeTab === 'orders' && 'Seguimiento de Pedidos'}
              </h1>
              <p className="text-xs text-text-secondary tracking-wide mt-1">
                {activeTab === 'dashboard' && 'Rendimiento y estadísticas de ventas en tiempo real.'}
                {activeTab === 'products' && 'Agrega, edita y gestiona el catálogo de suplementos deportivos.'}
                {activeTab === 'alerts' && 'Identifica rápidamente los suplementos agotados o con pocas existencias.'}
                {activeTab === 'promotions' && 'Modifica los precios, stocks e imágenes del carrusel promocional.'}
                {activeTab === 'orders' && 'Gestiona los pedidos simulados generados por los clientes en checkout.'}
              </p>
            </div>
          </header>

          {/* TAB CONTENTS */}
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onEditProduct={handleOpenEditProduct}
              onViewOrders={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'products' && (
            <AdminInventory
              onEditProduct={handleOpenEditProduct}
              onAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'alerts' && (
            <AdminStockAlerts />
          )}

          {activeTab === 'promotions' && (
            <AdminPromotions
              onEditPromo={handleOpenEditPromo}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders />
          )}
        </main>
      </div>

      {/* MODALS */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      <PromoFormModal
        isOpen={showPromoModal}
        onClose={() => {
          setShowPromoModal(false);
          setEditingPromo(null);
        }}
        promotion={editingPromo}
      />
    </div>
  );
};

export default Admin;
