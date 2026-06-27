import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Order } from '../../../interfaces';
import { FaPhoneAlt, FaCalendarAlt, FaTrash, FaInbox } from 'react-icons/fa';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id.toString().includes(orderSearch) ||
        o.customerPhone.includes(orderSearch);
      
      const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, statusFilter]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Control Bar for Orders */}
      <div className="admin-glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono o #ID..."
            className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-[0_0_12px_rgba(146,58,43,0.15)] transition-all duration-300 flex-1"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
          />
          <select
            className="bg-primary/50 border border-border-brand/50 text-text-primary py-2.5 px-4 rounded-xl text-sm outline-none cursor-pointer focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 transition-all duration-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos" className="bg-secondary text-text-primary">Todos los Estados</option>
            <option value="Pendiente" className="bg-secondary text-text-primary">Pendientes</option>
            <option value="Enviado" className="bg-secondary text-text-primary">Enviados</option>
            <option value="Completado" className="bg-secondary text-text-primary">Completados</option>
            <option value="Cancelado" className="bg-secondary text-text-primary">Cancelados</option>
          </select>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-text-secondary font-semibold">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </span>
          {(orderSearch || statusFilter !== 'Todos') && (
            <button
              onClick={() => {
                setOrderSearch('');
                setStatusFilter('Todos');
              }}
              className="text-xs text-accent hover:underline font-bold cursor-pointer border-0 bg-transparent p-0"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-6 admin-glass-panel shadow-xl">
          <FaInbox className="text-[3rem] text-text-muted mb-4 mx-auto animate-pulse" />
          <h3 className="text-2xl mb-2 font-title font-extrabold text-text-primary">No se encontraron pedidos</h3>
          <p className="text-text-secondary max-w-md mx-auto text-sm">Prueba ajustando tus parámetros de búsqueda o de estado.</p>
        </div>
      ) : (
        /* Orders list wrapper */
        <div className="admin-glass-panel overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-text-secondary text-[0.72rem] uppercase tracking-wider font-extrabold bg-secondary/60">
                  <th className="py-4.5 px-6">ID Pedido</th>
                  <th className="py-4.5 px-6">Cliente</th>
                  <th className="py-4.5 px-6">Fecha</th>
                  <th className="py-4.5 px-6">Productos Pedidos</th>
                  <th className="py-4.5 px-6">Total Pedido</th>
                  <th className="py-4.5 px-6">Estado</th>
                  <th className="py-4.5 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20 text-sm text-text-primary">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-primary/30 border-l-2 border-transparent hover:border-accent transition-all duration-200">
                    <td className="py-4.5 px-6 font-mono font-bold text-accent">#{o.id}</td>
                    <td className="py-4.5 px-6">
                      <span className="font-bold text-text-primary block">{o.customerName}</span>
                      <span className="text-[0.68rem] text-text-secondary font-bold flex items-center gap-1.5 mt-0.5">
                        <FaPhoneAlt size={9} className="text-accent" /> {o.customerPhone}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="text-text-secondary flex items-center gap-1.5 text-xs font-semibold">
                        <FaCalendarAlt size={10} className="text-text-muted" />
                        {new Date(o.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 max-w-[280px]">
                      <div className="flex flex-col gap-1">
                        {o.items.map((item, idx) => (
                          <span key={idx} className="text-[0.72rem] text-text-primary/90 font-semibold block truncate" title={item.product?.name}>
                            • {item.quantity} x {item.product?.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4.5 px-6 font-title font-black text-accent text-[1.1rem] drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">
                      S/ {o.total.toFixed(2)}
                    </td>
                    <td className="py-4.5 px-6">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                        className={`appearance-none bg-primary/50 border text-[0.68rem] font-bold py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer tracking-wider uppercase bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a83c2c%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-[size:1rem_1rem] bg-no-repeat transition-colors duration-200
                          ${o.status === 'Completado' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}
                          ${o.status === 'Enviado' && 'bg-blue-500/10 text-blue-500 border-blue-500/30'}
                          ${o.status === 'Pendiente' && 'bg-amber-500/10 text-amber-500 border-amber-500/30'}
                          ${o.status === 'Cancelado' && 'bg-red-500/10 text-red-500 border-red-500/30'}
                        `}
                      >
                        <option value="Pendiente" className="bg-secondary text-amber-500 font-bold">Pendiente</option>
                        <option value="Enviado" className="bg-secondary text-blue-500 font-bold">Enviado</option>
                        <option value="Completado" className="bg-secondary text-emerald-500 font-bold">Completado</option>
                        <option value="Cancelado" className="bg-secondary text-red-500 font-bold">Cancelado</option>
                      </select>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar el pedido #${o.id}?`)) {
                            deleteOrder(o.id);
                          }
                        }}
                        className="text-text-secondary hover:text-red-500 p-2 rounded-lg bg-primary/40 border border-border-brand/50 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                        title="Eliminar Pedido"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
