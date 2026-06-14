import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = () => {
      setUsers(userService.getUsers());
    };
    loadUsers();
    window.addEventListener('users_updated', loadUsers);
    return () => window.removeEventListener('users_updated', loadUsers);
  }, []);

  return users;
};
