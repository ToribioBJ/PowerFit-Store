import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Promotion, Category, Order, CartItem } from '../interfaces';
import initialProducts from '../data/products.json';
import initialPromotions from '../data/promotions.json';
import initialCategories from '../data/categories.json';

interface StoreContextType {
  products: Product[];
  promotions: Promotion[];
  categories: Category[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  replenishStock: (id: number, quantity: number, isPromo?: boolean) => void;
  updatePromotion: (promotion: Promotion) => void;
  addOrder: (items: CartItem[], total: number, customerName: string, customerPhone: string) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe utilizarse dentro de un StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('powerfit_products');
      return saved ? JSON.parse(saved) : (initialProducts as Product[]);
    } catch {
      return initialProducts as Product[];
    }
  });

  // Load promotions
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('powerfit_promotions');
      return saved ? JSON.parse(saved) : (initialPromotions as Promotion[]);
    } catch {
      return initialPromotions as Promotion[];
    }
  });

  // Load categories
  const [categories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('powerfit_categories');
      return saved ? JSON.parse(saved) : (initialCategories as Category[]);
    } catch {
      return initialCategories as Category[];
    }
  });

  // Generate mock orders for first load
  const generateMockOrders = (): Order[] => {
    const beefXP = products.find(p => p.id === 1) || products[0];
    const creatinaDY = products.find(p => p.id === 4) || products[3];
    const combo101 = promotions.find(p => p.id === 101) || (promotions[0] as unknown as Product);
    const carnivor = products.find(p => p.id === 2) || products[1];
    const creatinaKL = products.find(p => p.id === 5) || products[4];
    const venom = products.find(p => p.id === 9) || products[8];

    return [
      {
        id: 'ORD-1001',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        items: [{ product: beefXP, quantity: 1 }],
        total: beefXP.price * (1 - beefXP.discount / 100),
        customerName: 'Carlos Gómez',
        customerPhone: '987654321',
        status: 'Completado'
      },
      {
        id: 'ORD-1002',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        items: [{ product: creatinaDY, quantity: 2 }],
        total: (creatinaDY.price * (1 - creatinaDY.discount / 100)) * 2,
        customerName: 'María Rojas',
        customerPhone: '912345678',
        status: 'Completado'
      },
      {
        id: 'ORD-1003',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        items: [{ product: combo101 as unknown as Product, quantity: 1 }],
        total: combo101.price,
        customerName: 'Juan Pérez',
        customerPhone: '945612378',
        status: 'Enviado'
      },
      {
        id: 'ORD-1004',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        items: [
          { product: carnivor, quantity: 1 },
          { product: creatinaKL, quantity: 1 }
        ],
        total: (carnivor.price * (1 - carnivor.discount / 100)) + (creatinaKL.price * (1 - creatinaKL.discount / 100)),
        customerName: 'Sofía Castro',
        customerPhone: '999888777',
        status: 'Pendiente'
      },
      {
        id: 'ORD-1005',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        items: [{ product: venom, quantity: 1 }],
        total: venom.price * (1 - venom.discount / 100),
        customerName: 'Diego Torres',
        customerPhone: '955444333',
        status: 'Pendiente'
      }
    ];
  };

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('powerfit_orders');
      if (saved) {
        return JSON.parse(saved);
      } else {
        const mock = generateMockOrders();
        localStorage.setItem('powerfit_orders', JSON.stringify(mock));
        return mock;
      }
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('powerfit_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('powerfit_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('powerfit_orders', JSON.stringify(orders));
  }, [orders]);

  // Product actions
  const addProduct = (p: Omit<Product, 'id'>) => {
    setProducts((prev) => {
      const nextId = Math.max(...prev.map((item) => item.id), 0) + 1;
      const newProduct: Product = { ...p, id: nextId };
      return [...prev, newProduct];
    });
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const replenishStock = (id: number, quantity: number, isPromo = false) => {
    if (isPromo) {
      setPromotions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: item.stock + quantity } : item))
      );
    } else {
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: item.stock + quantity } : item))
      );
    }
  };

  // Promotion actions
  const updatePromotion = (promo: Promotion) => {
    setPromotions((prev) => prev.map((item) => (item.id === promo.id ? promo : item)));
  };

  // Order actions
  const addOrder = (items: CartItem[], total: number, customerName: string, customerPhone: string): string => {
    const nextId = `ORD-${Math.max(...orders.map((o) => parseInt(o.id.replace('ORD-', '')) || 1000), 1000) + 1}`;
    const newOrder: Order = {
      id: nextId,
      date: new Date().toISOString(),
      items,
      total,
      customerName,
      customerPhone,
      status: 'Pendiente',
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    
    // We also decrement stock of the items ordered
    items.forEach((item) => {
      const isPromo = item.product.id >= 100;
      if (isPromo) {
        setPromotions((prevPromos) =>
          prevPromos.map((p) =>
            p.id === item.product.id ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p
          )
        );
      } else {
        setProducts((prevProds) =>
          prevProds.map((p) =>
            p.id === item.product.id ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p
          )
        );
      }
    });

    return nextId;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        promotions,
        categories,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        replenishStock,
        updatePromotion,
        addOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
