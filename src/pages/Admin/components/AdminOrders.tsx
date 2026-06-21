import React from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Order } from '../../../interfaces';
import { FaPhoneAlt, FaCalendarAlt, FaTrash } from 'react-icons/fa';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Orders list wrapper */}
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
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-primary/20 transition-colors duration-150">
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

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-muted">
                    Aún no se han simulado pedidos de clientes en la tienda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
