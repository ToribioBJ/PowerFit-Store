import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Product } from '../../../interfaces';
import { FaEdit, FaWallet, FaClipboardList, FaChartLine, FaBoxes } from 'react-icons/fa';

interface AdminDashboardProps {
  onEditProduct: (p: Product) => void;
  onViewOrders: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onEditProduct, onViewOrders }) => {
  const { products, promotions, orders } = useStore();
  const [selectedTrendDayIdx, setSelectedTrendDayIdx] = useState<number | null>(null);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'Completado');
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = orders.length;
    const ticketPromedio = orderCount > 0 ? totalSales / (completedOrders.length || 1) : 0;
    const lowStockCount = products.filter(p => p.stock <= 5).length + promotions.filter(p => p.stock <= 5).length;

    return {
      totalSales,
      orderCount,
      ticketPromedio,
      lowStockCount
    };
  }, [orders, products, promotions]);

  // Weekly Sales Trend for SVG Graph
  const weeklySalesTrend = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const trend = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(Date.now() - (6 - idx) * 24 * 60 * 60 * 1000);
      const dayLabel = days[d.getDay()];

      const dayStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
      const dayEnd = new Date(d.setHours(23, 59, 59, 999)).getTime();

      const dayOrders = orders
        .filter(o => o.status === 'Completado')
        .filter(o => {
          const oTime = new Date(o.date).getTime();
          return oTime >= dayStart && oTime <= dayEnd;
        });

      const dayTotal = dayOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        day: dayLabel,
        sales: dayTotal,
        orders: dayOrders
      };
    });

    const maxSales = Math.max(...trend.map(t => t.sales), 500);
    return { trend, maxSales };
  }, [orders]);

  // Featured products list (featured: true)
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.featured);
  }, [products]);

  const selectedDayTrend = selectedTrendDayIdx !== null ? weeklySalesTrend.trend[selectedTrendDayIdx] : null;

  const soldProductsGrouped = useMemo(() => {
    if (!selectedDayTrend || !selectedDayTrend.orders) return [];

    const map: { [id: number]: { product: Product; quantity: number; total: number } } = {};

    selectedDayTrend.orders.forEach((order) => {
      order.items.forEach((item) => {
        const p = item.product;
        if (!p) return;
        const qty = item.quantity;
        const finalPrice = p.price * (1 - (p.discount || 0) / 100);

        if (map[p.id]) {
          map[p.id].quantity += qty;
          map[p.id].total += finalPrice * qty;
        } else {
          map[p.id] = {
            product: p,
            quantity: qty,
            total: finalPrice * qty
          };
        }
      });
    });

    return Object.values(map);
  }, [selectedDayTrend]);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="admin-kpi-card p-6 flex flex-col justify-between relative group overflow-hidden cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/15 transition-all duration-300"></div>
          <FaWallet className="absolute right-4 bottom-4 text-[4.5rem] text-text-primary/[0.03] group-hover:text-accent/[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="text-[0.7rem] font-title font-black uppercase text-text-muted tracking-wider">Ingresos Totales (S/)</div>
            <span className="text-[0.6rem] bg-emerald-500/10 text-emerald-400 font-extrabold uppercase py-0.5 px-2 rounded-full tracking-wider border border-emerald-500/25">
              +15.4%
            </span>
          </div>
          <div className="text-3xl font-title font-black text-accent mt-3 drop-shadow-[0_2px_8px_rgba(146,58,43,0.3)]">
            S/ {stats.totalSales.toFixed(2)}
          </div>
          <div className="text-[0.65rem] text-emerald-400 font-bold mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Sincronizado
          </div>
        </div>

        {/* Card 2 */}
        <div className="admin-kpi-card p-6 flex flex-col justify-between relative group overflow-hidden cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/15 transition-all duration-300"></div>
          <FaClipboardList className="absolute right-4 bottom-4 text-[4.5rem] text-text-primary/[0.03] group-hover:text-text-primary/[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="text-[0.7rem] font-title font-black uppercase text-text-muted tracking-wider">Pedidos Totales</div>
            <span className="text-[0.6rem] bg-amber-500/10 text-amber-400 font-extrabold uppercase py-0.5 px-2 rounded-full tracking-wider border border-amber-500/25">
              Activos
            </span>
          </div>
          <div className="text-3xl font-title font-black text-text-primary mt-3">
            {stats.orderCount}
          </div>
          <div className="text-[0.65rem] text-text-secondary font-semibold mt-2">
            {orders.filter(o => o.status === 'Pendiente').length} pedidos pendientes de envío
          </div>
        </div>

        {/* Card 3 */}
        <div className="admin-kpi-card p-6 flex flex-col justify-between relative group overflow-hidden cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/15 transition-all duration-300"></div>
          <FaChartLine className="absolute right-4 bottom-4 text-[4.5rem] text-text-primary/[0.03] group-hover:text-accent/[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="text-[0.7rem] font-title font-black uppercase text-text-muted tracking-wider">Ticket Promedio</div>
            <span className="text-[0.6rem] bg-accent/10 text-accent font-extrabold uppercase py-0.5 px-2 rounded-full tracking-wider border border-accent/25">
              Estable
            </span>
          </div>
          <div className="text-3xl font-title font-black text-accent mt-3 drop-shadow-[0_2px_8px_rgba(146,58,43,0.15)]">
            S/ {stats.ticketPromedio.toFixed(2)}
          </div>
          <div className="text-[0.65rem] text-text-secondary font-bold mt-2">Promedio por orden facturada</div>
        </div>

        {/* Card 4 */}
        <div className="admin-kpi-card p-6 flex flex-col justify-between relative group overflow-hidden cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/15 transition-all duration-300"></div>
          <FaBoxes className="absolute right-4 bottom-4 text-[4.5rem] text-text-primary/[0.03] group-hover:text-red-500/[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="text-[0.7rem] font-title font-black uppercase text-text-muted tracking-wider">Alertas de Stock</div>
            <span className={`text-[0.6rem] font-extrabold uppercase py-0.5 px-2 rounded-full tracking-wider border
              ${stats.lowStockCount > 0 ? 'bg-red-500/15 text-red-400 border-red-500/25 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'}`}>
              {stats.lowStockCount > 0 ? 'Reposición' : 'Óptimo'}
            </span>
          </div>
          <div className={`text-3xl font-title font-black mt-3 ${stats.lowStockCount > 0 ? 'text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]' : 'text-text-secondary'}`}>
            {stats.lowStockCount}
          </div>
          <div className="text-[0.65rem] text-text-secondary font-bold mt-2">
            {stats.lowStockCount > 0 ? '⚠️ Artículos requieren reposición' : '✓ Sin quiebres de inventario'}
          </div>
        </div>
      </div>

      {/* Sales Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        {/* Sales Chart Card */}
        <div className="admin-glass-panel p-6 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-title font-extrabold uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-accent rounded-full shadow-glow"></span>
                Tendencia de Ventas (Últimos 7 Días)
              </h3>
              <p className="text-[0.68rem] text-text-secondary mt-1">
                💡 Haz clic en una barra para filtrar y detallar los productos vendidos de ese día.
              </p>
            </div>
            {selectedTrendDayIdx !== null && (
              <button
                onClick={() => setSelectedTrendDayIdx(null)}
                className="text-[0.62rem] uppercase font-black tracking-widest text-text-muted hover:text-accent bg-primary/20 border border-border-brand/40 px-2 py-1 rounded transition-all duration-200 cursor-pointer"
              >
                Limpiar Filtro
              </button>
            )}
          </div>

          {/* SVG Chart */}
          <div className="relative h-[240px] w-full mt-4 flex items-end">
            <svg
              className="w-full h-full"
              overflow="visible"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedTrendDayIdx(null);
              }}
            >
              {/* Definitions for Gradients */}
              <defs>
                <linearGradient id="chart-bar-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="45" x2="100%" y2="45" stroke="var(--border-brand)" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
              <line x1="0" y1="90" x2="100%" y2="90" stroke="var(--border-brand)" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
              <line x1="0" y1="135" x2="100%" y2="135" stroke="var(--border-brand)" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />

              {/* Chart Bars, Values, Labels & Hotspots */}
              {weeklySalesTrend.trend.map((t, idx) => {
                const colWidthPercentage = 100 / weeklySalesTrend.trend.length;
                const heightRatio = t.sales / (weeklySalesTrend.maxSales || 1);
                const barHeight = heightRatio * 180; // max SVG height is 180px
                const yPos = 180 - barHeight;
                const barWidth = 4.5; // percent width of the visual bar
                const barX = idx * colWidthPercentage + (colWidthPercentage - barWidth) / 2;

                return (
                  <g key={idx} className="group cursor-pointer">
                    {/* Background Hover & Selection Area Hotspot (Ancho completo) */}
                    <rect
                      x={`${idx * colWidthPercentage}%`}
                      y="0"
                      width={`${colWidthPercentage}%`}
                      height="215"
                      rx="12"
                      fill="var(--accent)"
                      opacity={selectedTrendDayIdx === idx ? 0.08 : 0}
                      className={`transition-all duration-300 ${
                        selectedTrendDayIdx === idx
                          ? 'group-hover:opacity-[0.12]'
                          : 'group-hover:opacity-[0.04]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrendDayIdx(prev => prev === idx ? null : idx);
                      }}
                    />

                    {/* Value Display */}
                    <foreignObject
                      x={`${idx * colWidthPercentage}%`}
                      y={yPos - 25}
                      width={`${colWidthPercentage}%`}
                      height="20"
                      className="pointer-events-none"
                    >
                      <div className={`text-[0.7rem] text-center font-black transition-all duration-200 group-hover:text-accent group-hover:scale-105 ${
                        selectedTrendDayIdx === idx ? 'text-accent scale-105' : 'text-text-muted/70'
                      }`}>
                        S/ {t.sales.toFixed(0)}
                      </div>
                    </foreignObject>

                    {/* SVG Rectangle with glow */}
                    <rect
                      x={`${barX}%`}
                      y={yPos}
                      width={`${barWidth}%`}
                      height={Math.max(barHeight, 3)}
                      rx="4"
                      fill={selectedTrendDayIdx === idx ? "var(--accent)" : "url(#chart-bar-glow)"}
                      stroke={selectedTrendDayIdx === idx ? "var(--accent)" : "var(--border-glow)"}
                      strokeWidth={selectedTrendDayIdx === idx ? "2" : "1"}
                      filter={selectedTrendDayIdx === idx ? "drop-shadow(0 0 6px var(--accent))" : ""}
                      className="transition-all duration-300 pointer-events-none origin-bottom group-hover:scale-y-[1.03] group-hover:fill-accent group-hover:filter-[drop-shadow(0_0_8px_var(--accent))]"
                    />

                    {/* X-Axis Label */}
                    <foreignObject
                      x={`${idx * colWidthPercentage}%`}
                      y="190"
                      width={`${colWidthPercentage}%`}
                      height="20"
                      className="pointer-events-none"
                    >
                      <div className={`text-[0.75rem] font-bold text-center uppercase transition-colors duration-200 group-hover:text-accent group-hover:font-black ${
                        selectedTrendDayIdx === idx ? 'text-accent font-black scale-105' : 'text-text-secondary'
                      }`}>
                        {t.day}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Base horizontal line */}
              <line x1="0" y1="181" x2="100%" y2="181" stroke="var(--border-brand)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Dynamic Side Card: Recent Activity OR Products Sold */}
        <div className="admin-glass-panel p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 min-h-[340px]">
          {selectedTrendDayIdx === null ? (
            /* Mode A: Actividad Reciente */
            <div className="animate-fadeIn">
              <h3 className="text-base font-title font-extrabold uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-accent rounded-full shadow-glow"></span>
                Actividad Reciente
              </h3>

              <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex justify-between items-center bg-primary/20 border border-border-brand/40 p-3.5 rounded-xl hover:border-accent/40 transition-all duration-200">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-xs font-bold text-text-primary truncate">{order.customerName}</p>
                      <p className="text-[0.65rem] text-text-muted mt-0.5 font-semibold">
                        {new Date(order.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-accent block">S/ {order.total.toFixed(2)}</span>
                      <span className={`text-[0.55rem] font-black uppercase py-0.5 px-2 rounded-full border inline-block mt-1 tracking-wider
                        ${order.status === 'Completado' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_6px_rgba(16,185,129,0.15)]'}
                        ${order.status === 'Enviado' && 'bg-blue-500/10 text-blue-500 border-blue-500/30'}
                        ${order.status === 'Pendiente' && 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_6px_rgba(245,158,11,0.15)]'}
                        ${order.status === 'Cancelado' && 'bg-red-500/10 text-red-500 border-red-500/30'}
                      `}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-10 text-text-muted text-xs font-bold uppercase tracking-wider">Sin pedidos registrados.</div>
                )}
              </div>
            </div>
          ) : (
            /* Mode B: Productos Vendidos de ese día */
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-title font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-accent rounded-full shadow-glow"></span>
                  Productos Vendidos: {selectedDayTrend ? selectedDayTrend.day : ''}
                </h3>
                <button
                  onClick={() => setSelectedTrendDayIdx(null)}
                  className="text-[0.62rem] uppercase font-black tracking-widest text-accent hover:text-accent-hover bg-accent/10 border border-accent/20 px-2 py-1 rounded transition-all duration-200 cursor-pointer animate-pulse"
                >
                  Ver Todo
                </button>
              </div>

              <div className="flex flex-col gap-4 max-h-[190px] overflow-y-auto scrollbar-none pr-1">
                {soldProductsGrouped.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center bg-primary/20 border border-border-brand/40 p-3.5 rounded-xl hover:border-accent/40 transition-all duration-200">
                    <div className="flex gap-3 items-center min-w-0 flex-1 pr-3">
                      <div className="w-10 h-10 bg-white rounded-lg p-0.5 border border-border-brand/20 flex items-center justify-center overflow-hidden shrink-0 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                        <img src={item.product.image} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{item.product.name}</p>
                        <span className="text-[0.65rem] text-accent font-bold uppercase tracking-wider block mt-0.5">Cant: {item.quantity} u.</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-accent block">S/ {item.total.toFixed(2)}</span>
                      <span className="text-[0.6rem] text-text-secondary font-bold">Total del Día</span>
                    </div>
                  </div>
                ))}

                {soldProductsGrouped.length === 0 && (
                  <div className="text-center py-12 text-text-muted text-xs font-bold uppercase tracking-wider">
                    No se registraron ventas este día.
                  </div>
                )}
              </div>

              {selectedDayTrend && selectedDayTrend.sales > 0 && (
                <div className="border-t border-border-brand/35 pt-3.5 mt-3.5 flex justify-between items-center text-xs font-bold animate-fadeIn">
                  <span className="text-text-secondary">Venta Total del Día:</span>
                  <span className="text-sm font-title font-black text-accent">S/ {selectedDayTrend.sales.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border-brand/20">
            {selectedTrendDayIdx === null ? (
              <button
                onClick={onViewOrders}
                className="w-full text-center text-[0.7rem] font-title font-black uppercase tracking-widest text-accent hover:text-accent-hover border border-dashed border-border-brand py-3 rounded-xl hover:bg-primary/20 hover:border-accent/40 transition-all duration-300 cursor-pointer"
              >
                Ver Todos los Pedidos
              </button>
            ) : (
              <button
                onClick={() => setSelectedTrendDayIdx(null)}
                className="w-full text-center text-[0.7rem] font-title font-black uppercase tracking-widest text-text-secondary hover:text-accent border border-dashed border-border-brand py-3 rounded-xl hover:bg-primary/20 hover:border-accent/40 transition-all duration-300 cursor-pointer"
              >
                Limpiar Selección / Ver Recientes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Featured Products Cards Grid (Full Width) */}
      <div className="flex flex-col gap-6 mt-8">
        <h3 className="text-base font-title font-extrabold uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-accent rounded-full shadow-glow"></span>
          Productos Destacados ({featuredProducts.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const hasDiscount = p.discount > 0;
            const finalPrice = p.price * (1 - (p.discount || 0) / 100);

            return (
              <div key={p.id} className="admin-glass-panel p-5 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <div>
                  {/* Savings Badge */}
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-accent to-[#A84433] text-white font-title font-black text-[0.55rem] uppercase py-1 px-2 rounded shadow-sm z-10 tracking-wider">
                      -{p.discount.toFixed(0)}%
                    </span>
                  )}
                  {/* Stock status badge */}
                  <span className={`absolute top-3 right-3 text-[0.55rem] font-bold uppercase py-0.5 px-2 rounded-full border z-10
                    ${p.stock <= 5 
                      ? 'bg-red-500/10 text-red-500 border-red-500/35 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    }`}>
                    Stock: {p.stock}
                  </span>

                  {/* Image container */}
                  <div className="relative bg-white rounded-xl overflow-hidden aspect-square mb-4 flex items-center justify-center p-4 border border-border-brand/20 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]">
                    <img src={p.image} alt={p.name} className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Info */}
                  <h4 className="font-title font-extrabold text-xs mb-1 text-text-primary leading-tight line-clamp-2">
                    {p.name}
                  </h4>
                  <p className="text-[0.62rem] text-text-muted uppercase font-bold tracking-wider mb-3">
                    {p.brand}
                  </p>
                </div>

                <div className="border-t border-border-brand/30 pt-3 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[0.5rem] text-text-muted uppercase font-bold tracking-wider block">Precio</span>
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-accent">S/ {finalPrice.toFixed(2)}</span>
                        <span className="text-[0.55rem] text-text-muted line-through">S/ {p.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-text-primary">S/ {p.price.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onEditProduct(p)}
                    className="text-[0.6rem] bg-secondary/80 hover:bg-accent hover:text-white border border-border-brand/60 hover:border-accent p-2 rounded-lg transition-all duration-300 cursor-pointer"
                    title="Editar Producto"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            );
          })}

          {featuredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 admin-glass-panel text-text-muted text-xs font-bold uppercase tracking-wider">
              Sin productos destacados en portada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
