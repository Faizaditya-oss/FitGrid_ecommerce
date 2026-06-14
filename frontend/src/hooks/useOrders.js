import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      setOrders(orderService.getOrders());
    };
    loadOrders();
    window.addEventListener('orders_updated', loadOrders);
    return () => window.removeEventListener('orders_updated', loadOrders);
  }, []);

  return orders;
};
