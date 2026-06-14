const API_URL = 'http://localhost:8000/api/reviews/';

export const reviewService = {
  getReviewsByProduct: async (productId) => {
    try {
      const response = await fetch(`${API_URL}getByProduct.php?product_id=${productId}`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  addReview: async (reviewData) => {
    try {
      const response = await fetch(`${API_URL}create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, message: 'Gagal menghubungi server untuk menyimpan review.' };
    }
  }
};
