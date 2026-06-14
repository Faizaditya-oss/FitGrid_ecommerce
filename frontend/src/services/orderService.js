const STORAGE_KEY = 'fitgrid_orders';

export const orderService = {
  getOrders: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getOrderById: (id) => {
    const orders = orderService.getOrders();
    return orders.find(o => o.id === String(id));
  },

  getOrdersByCustomerId: (customerId) => {
    const orders = orderService.getOrders();
    return orders.filter(o => o.customerId === String(customerId));
  },

  createOrder: (order) => {
    const orders = orderService.getOrders();
    const newOrder = {
      ...order,
      id: order.id || `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      orderStatus: 'Pending',
      paymentStatus: 'Pending'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders_updated'));
    return newOrder;
  },

  updateOrder: (orderId, updates) => {
    const orders = orderService.getOrders();
    const index = orders.findIndex(o => o.id === String(orderId));
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('orders_updated'));
      return orders[index];
    }
    return null;
  },

  deleteOrder: (id) => {
    const orders = orderService.getOrders();
    const filtered = orders.filter(o => o.id !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('orders_updated'));
  }
};
