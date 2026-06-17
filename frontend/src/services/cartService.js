const API_URL = 'http://localhost:8000/api/cart/';

export const cartService = {
  async getCart(userId) {
    if (!userId) return { success: true, data: [] };
    try {
      const response = await fetch(`${API_URL}get.php?user_id=${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { success: false, data: [] };
    }
  },

  async addToCart(userId, product_id, quantity, size = 'Standard', color = 'Standard') {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id, quantity, size, color })
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },

  async updateQuantity(userId, product_id, quantity, size = 'Standard', color = 'Standard') {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id, quantity, size, color })
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  },

  async removeFromCart(userId, product_id, size = 'Standard', color = 'Standard') {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}remove.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id, size, color })
      });
      return await response.json();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  },

  async clearCart(userId) {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}clear.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      return await response.json();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }
};
