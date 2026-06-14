import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      setProducts(productService.getProducts());
    };
    loadProducts();
    window.addEventListener('products_updated', loadProducts);
    return () => window.removeEventListener('products_updated', loadProducts);
  }, []);

  return products;
};
