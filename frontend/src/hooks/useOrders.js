import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/orders/getAll.php');
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch all orders:", error);
      }
    };
    loadOrders();
    // Keep listener just in case there are still local manual updates that need refresh
    window.addEventListener('orders_updated', loadOrders);
    return () => window.removeEventListener('orders_updated', loadOrders);
  }, []);

  return orders;
};
