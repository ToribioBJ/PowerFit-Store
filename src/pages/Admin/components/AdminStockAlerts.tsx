import React, { useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const AdminStockAlerts: React.FC = () => {
  const { products, promotions, replenishStock } = useStore();

  // Stock Alerts list (both products and promos)
  const lowStockItems = useMemo(() => {
    const prods = products.filter(p => p.stock <= 5).map(p => ({ ...p, isPromo: false }));
    const promos = promotions.filter(p => p.stock <= 5).map(p => ({ ...p, isPromo: true }));
    return [...prods, ...promos];
  }, [products, promotions]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {lowStockItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowStockItems.map((item) => (
            <div
              key={`${item.isPromo ? 'promo' : 'prod'}-${item.id}`}
              className="admin-glass-panel p-5 flex flex-col justify-between relative border border-red-500/25 bg-gradient-to-b from-secondary/50 to-primary/20 hover:border-red-500 shadow-[0_4px_30px_rgba(239,68,68,0.05)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.15)] group transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Alert Pill */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-red-500/15 border border-red-500/25 text-red-500 py-1 px-3 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse">
                    <FaExclamationTriangle className="text-[0.7rem]" /> Stock Crítico
                  </span>
                  <span className="text-[0.62rem] font-bold uppercase tracking-wider text-text-muted bg-secondary/50 py-1 px-2.5 rounded-lg border border-border-brand/40">
                    {item.isPromo ? 'Combo Promo' : 'Producto'}
                  </span>
                </div>

                {/* Header details */}
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-14 h-14 bg-white rounded-xl p-1 shrink-0 border border-border-brand/30 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="max-w-[90%] max-h-[90%] object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title font-black text-sm text-text-primary truncate leading-tight group-hover:text-red-500 transition-colors duration-200">{item.name}</h4>
                    <span className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-wider mt-1 block">{item.brand}</span>
                  </div>
                </div>

                {/* Current Inventory Bar */}
                <div className="mb-6 bg-primary/50 border border-border-brand/40 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-text-secondary font-bold">Existencia Actual:</span>
                  <span className="text-red-500 font-title font-black text-lg animate-pulse">{item.stock} unidades</span>
                </div>
              </div>

              {/* Replenish Quick Actions */}
              <div>
                <span className="text-[0.62rem] font-black uppercase tracking-widest text-text-muted mb-2.5 block text-center">Reposición Rápida</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      replenishStock(item.id, 5, item.isPromo);
                    }}
                    className="py-2.5 rounded-lg bg-primary/40 border border-border-brand/60 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-text-primary font-title font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => {
                      replenishStock(item.id, 10, item.isPromo);
                    }}
                    className="py-2.5 rounded-lg bg-primary/40 border border-border-brand/60 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-text-primary font-title font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => {
                      replenishStock(item.id, 25, item.isPromo);
                    }}
                    className="py-2.5 rounded-lg bg-primary/40 border border-border-brand/60 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-text-primary font-title font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                  >
                    +25
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 admin-glass-panel shadow-xl">
          <span className="text-[3rem] text-emerald-500 mb-4 block">✓</span>
          <h3 className="text-2xl mb-2 font-title font-extrabold text-text-primary">Inventario en estado óptimo</h3>
          <p className="text-text-secondary max-w-md mx-auto text-sm">No hay ningún suplemento con existencias críticas en el almacén (todas las existencias son mayores a 5 unidades).</p>
        </div>
      )}
    </div>
  );
};

export default AdminStockAlerts;
