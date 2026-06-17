import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { cartService } from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    // Only use local storage as fallback before DB loads
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const loadCart = useCallback(async () => {
    if (user && user.id) {
      const response = await cartService.getCart(user.id);
      if (response && response.success && response.data) {
        setCart(response.data);
        localStorage.setItem('cart', JSON.stringify(response.data));
      }
    } else {
      setCart([]);
      localStorage.removeItem('cart');
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Keep localStorage synced for quick initial render, but DB is source of truth
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    const qty = product.quantity || 1;
    // Optimistic UI update
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    if (user && user.id) {
      // id structure in frontend is `${product_id}-${size}-${color}`
      await cartService.addToCart(user.id, product.productId, qty, product.size, product.color);
      // Optional: reload cart from DB to ensure exact match
      // await loadCart();
    }
  };

  const updateQuantity = async (id, quantity) => {
    const itemToUpdate = cart.find(item => item.id === id);
    if (!itemToUpdate) return;

    // Optimistic UI update
    setCart((prev) => {
      if (quantity <= 0) return prev.filter(item => item.id !== id);
      return prev.map((item) => item.id === id ? { ...item, quantity } : item);
    });

    if (user && user.id) {
      await cartService.updateQuantity(user.id, itemToUpdate.productId, quantity, itemToUpdate.size, itemToUpdate.color);
    }
  };

  const removeFromCart = async (id) => {
    const itemToRemove = cart.find(item => item.id === id);
    if (!itemToRemove) return;

    // Optimistic UI update
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (user && user.id) {
      await cartService.removeFromCart(user.id, itemToRemove.productId, itemToRemove.size, itemToRemove.color);
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user && user.id) {
      await cartService.clearCart(user.id);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
