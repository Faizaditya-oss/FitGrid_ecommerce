import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const currentUser = authService.getCurrentUser();
    return currentUser || null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserSession = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser || null);
    };

    window.addEventListener('users_updated', loadUserSession);
    return () => window.removeEventListener('users_updated', loadUserSession);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Note: authService.login already sets currentUser in localStorage, 
    // but we can ensure it's set if login is called directly
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const updateUser = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    
    // Optimistically update context and localStorage
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    if (updatedUser.id) {
      try {
        await fetch('http://localhost:8000/api/profile/updateProfile.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser)
        });
      } catch (error) {
        console.error("Failed to update user in database:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
