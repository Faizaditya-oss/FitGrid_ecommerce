const API_URL = 'http://localhost:8000/api/products/';

export const productService = {
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}getAll.php`);
      const result = await response.json();
      if (result.success) {
        // Map backend structure to frontend structure
        return result.data.map(p => ({
          ...p,
          id: p.product_id, // frontend expects id
          image: p.image_url, // frontend expects image
          sizes: p.size ? p.size.split(',') : [],
          originalPrice: null, // you can add logic if you have original price in DB
          discount: null,
          isNew: false,
          rating: 0,
          reviews: 0
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}getById.php?id=${id}`);
      const result = await response.json();
      if (result.success && result.data) {
        const p = result.data;
        return {
          ...p,
          id: p.product_id,
          image: p.image_url,
          sizes: p.size ? p.size.split(',') : [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  },

  addProduct: async (product) => {
    try {
      const payload = {
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        size: Array.isArray(product.sizes) ? product.sizes.join(',') : '',
        color: product.color || '',
        image_url: product.image || '',
        price: product.price,
        stock: product.stock || 0
      };

      const response = await fetch(`${API_URL}create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(new Event('products_updated'));
        return { ...product, id: result.data.product_id };
      }
      alert(result.message);
      return null;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  updateProduct: async (product) => {
    try {
      const payload = {
        product_id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        size: Array.isArray(product.sizes) ? product.sizes.join(',') : '',
        color: product.color,
        image_url: product.image,
        price: product.price,
        stock: product.stock
      };

      const response = await fetch(`${API_URL}update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(new Event('products_updated'));
        return product;
      }
      alert(result.message);
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: id })
      });
      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(new Event('products_updated'));
        return true;
      }
      alert(result.message);
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};
