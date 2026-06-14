const API_URL = 'http://localhost:8000/api/auth/';

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_URL}register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (data.success && data.user) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.user_id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.role,
      }));
    }
    
    return data;
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};
