import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Product } from '../../../interfaces';
import { FaEdit, FaTrash, FaList, FaThLarge, FaPlus, FaInbox } from 'react-icons/fa';

interface AdminInventoryProps {
  onEditProduct: (p: Product) => void;
  onAddProduct: () => void;
}

const AdminInventory: React.FC<AdminInventoryProps> = ({ onEditProduct, onAddProduct }) => {
  const { products, categories, deleteProduct } = useStore();

  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('Todos');
  const [inventoryViewMode, setInventoryViewMode] = useState<'table' | 'cards'>('table');

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(prodSearch.toLowerCase());
      const matchCat = prodCategory === 'Todos' || p.category === prodCategory;
      return matchSearch && matchCat;
    });
  }, [products, prodSearch, prodCategory]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Action Bar (Search & Filter) */}
      <div className="admin-glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-xl">
          <input
            type="text"
            placeholder="Buscar por suplemento o marca..."
            className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-[0_0_12px_rgba(146,58,43,0.15)] transition-all duration-300 flex-1"
            value={prodSearch}
            onChange={(e) => setProdSearch(e.target.value)}
          />
          <select
            className="bg-primary/50 border border-border-brand/50 text-text-primary py-2.5 px-4 rounded-xl text-sm outline-none cursor-pointer focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 transition-all duration-300"
            value={prodCategory}
            onChange={(e) => setProdCategory(e.target.value)}
          >
            <option value="Todos" className="bg-secondary text-text-primary">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.name} className="bg-secondary text-text-primary">{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          {/* Selector de Modo de Vista */}
          <div className="flex items-center bg-primary/45 border border-border-brand/40 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setInventoryViewMode('table')}
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${inventoryViewMode === 'table'
                ? 'bg-accent text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Vista de Tabla"
            >
              <FaList size={16} />
            </button>
            <button
              onClick={() => setInventoryViewMode('cards')}
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${inventoryViewMode === 'cards'
                ? 'bg-accent text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Vista de Tarjetas"
            >
              <FaThLarge size={16} />
            </button>
          </div>

          <button
            onClick={onAddProduct}
            className="btn-primary py-2.5 px-5 text-[0.8rem] tracking-wider flex-1 lg:flex-none shadow-glow hover:scale-102 transition-all duration-300 cursor-pointer"
          >
            <FaPlus /> Agregar Producto
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-6 admin-glass-panel shadow-xl">
          <FaInbox className="text-[3rem] text-text-muted mb-4 mx-auto" />
          <h3 className="text-2xl mb-2 font-title font-extrabold text-text-primary">No se encontraron productos</h3>
          <p className="text-text-secondary max-w-md mx-auto text-sm">Intenta ajustando el buscador o seleccionando otra categoría.</p>
        </div>
      ) : inventoryViewMode === 'table' ? (
        /* Vista en Tabla */
        <div className="admin-glass-panel overflow-hidden shadow-2xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-text-secondary text-[0.72rem] uppercase tracking-wider font-extrabold bg-secondary/60">
                  <th className="py-4.5 px-6">ID</th>
                  <th className="py-4.5 px-6">Imagen</th>
                  <th className="py-4.5 px-6">Nombre</th>
                  <th className="py-4.5 px-6">Categoría / Marca</th>
                  <th className="py-4.5 px-6">Precio</th>
                  <th className="py-4.5 px-6">Descuento</th>
                  <th className="py-4.5 px-6">Stock</th>
                  <th className="py-4.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20 text-sm text-text-primary">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/20 transition-colors duration-150">
                    <td className="py-4 px-6 font-mono font-bold text-text-muted text-xs">#{p.id}</td>
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 bg-white rounded-lg p-0.5 border border-border-brand/20 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]">
                        <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-text-primary max-w-[220px] truncate" title={p.name}>{p.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-accent block">{p.category}</span>
                      <span className="text-[0.68rem] text-text-secondary uppercase font-bold tracking-widest">{p.brand}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-text-primary">S/ {p.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      {p.discount > 0 ? (
                        <span className="bg-accent/15 border border-accent/25 text-accent font-title font-black px-2 py-0.5 rounded text-[0.7rem] shadow-[0_0_8px_rgba(146,58,43,0.15)]">
                          -{p.discount.toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-text-muted/65 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold py-1 px-3 rounded-full text-[0.72rem] border
                        ${p.stock <= 5
                          ? 'bg-red-500/10 text-red-500 border-red-500/25 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                        }`}
                      >
                        {p.stock} u.
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="text-text-secondary hover:text-text-primary p-2 rounded-lg bg-primary/40 border border-border-brand/50 hover:border-accent hover:bg-secondary transition-all duration-200 cursor-pointer"
                          title="Editar Producto"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de eliminar el producto: "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="text-text-secondary hover:text-red-500 p-2 rounded-lg bg-primary/40 border border-border-brand/50 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                          title="Eliminar Producto"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vista en Cards (Tarjetas) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredProducts.map((p) => {
            const finalPrice = p.price * (1 - p.discount / 100);
            const hasDiscount = p.discount > 0;
            return (
              <div
                key={p.id}
                className="admin-glass-panel p-5 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.62rem] uppercase py-1.5 px-3 rounded shadow-[0_4px_10px_rgba(146,58,43,0.35)] z-10 tracking-widest">
                      {p.discount}% OFF
                    </span>
                  )}

                  {/* Stock Badge */}
                  <span className={`absolute top-4 right-4 text-[0.65rem] font-bold py-1 px-3 rounded-full border ${p.stock <= 5
                    ? 'bg-red-500/10 text-red-500 border-red-500/25 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                  }`}>
                    {p.stock} u.
                  </span>

                  {/* Image Preview Area */}
                  <div className="relative bg-white rounded-xl overflow-hidden aspect-square mb-4 flex items-center justify-center p-4 border border-border-brand/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)] mt-8">
                    <img src={p.image} alt={p.name} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  <span className="text-[0.72rem] text-text-muted uppercase font-bold tracking-wider mb-1 block">
                    {p.category} | {p.brand}
                  </span>

                  <h3 className="font-title font-extrabold text-base mb-2 text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div>
                  {/* Pricing block */}
                  <div className="flex items-center justify-between mb-4 border-t border-border-brand/35 pt-3.5">
                    <div>
                      <span className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest block">Precio Final</span>
                      <span className="text-lg font-title font-black text-accent drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">S/ {finalPrice.toFixed(2)}</span>
                    </div>
                    {hasDiscount && (
                      <div className="text-right">
                        <span className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest block">Lista</span>
                        <span className="text-xs font-bold text-text-secondary line-through">S/ {p.price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="btn-secondary py-2.5 px-3 text-[0.7rem] tracking-wider font-extrabold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar el producto: "${p.name}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="py-2.5 px-3 text-[0.7rem] tracking-wider font-extrabold cursor-pointer rounded-xl flex items-center justify-center gap-1.5 bg-red-600/10 text-red-500 border border-red-500/25 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
