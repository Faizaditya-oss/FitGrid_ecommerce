import { useState, useEffect } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/getAll.php');
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    loadUsers();
    window.addEventListener('users_updated', loadUsers);
    return () => window.removeEventListener('users_updated', loadUsers);
  }, []);

  return users;
};
