import { productsData } from '../data/products';

const STORAGE_KEY = 'fitgrid_products';

// Initialize localStorage with initial data if empty
const initProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
  }
};

initProducts();

export const productService = {
  getProducts: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getProductById: (id) => {
    const products = productService.getProducts();
    return products.find(p => p.id === id);
  },

  addProduct: (product) => {
    const products = productService.getProducts();
    const stock = Number(product.stock) || 0;
    const status = stock <= 0 ? 'Out of Stock' : (product.status || 'Active');
    
    const newProduct = {
      ...product,
      stock,
      status,
      id: product.id || `p-${Date.now()}`
    };
    
    products.unshift(newProduct);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('products_updated'));
      return newProduct;
    } catch (error) {
      console.error('Error saving to localStorage', error);
      alert('Failed to save product. The image might be too large or your browser storage is full.');
      return null;
    }
  },

  updateProduct: (product) => {
    const products = productService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      const stock = Number(product.stock) || 0;
      const status = stock <= 0 ? 'Out of Stock' : (product.status || 'Active');
      
      products[index] = { ...products[index], ...product, stock, status };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        window.dispatchEvent(new Event('products_updated'));
        return products[index];
      } catch (error) {
        console.error('Error saving to localStorage', error);
        alert('Failed to update product. The image might be too large or your browser storage is full.');
        return null;
      }
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = productService.getProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event('products_updated'));
  }
};
