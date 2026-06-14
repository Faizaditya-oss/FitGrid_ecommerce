const STORAGE_KEY = 'fitgrid_users';

export const userService = {
  getUsers: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserById: (id) => {
    const users = userService.getUsers();
    return users.find(u => u.id === String(id));
  },

  getUserByEmail: (email) => {
    const users = userService.getUsers();
    return users.find(u => u.email === email);
  },

  registerUser: (user) => {
    const users = userService.getUsers();
    const newUser = {
      ...user,
      id: user.id || `u-${Date.now()}`,
      status: 'Active',
      role: user.role || 'customer'
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('users_updated'));
    return newUser;
  },

  updateUser: (user) => {
    const users = userService.getUsers();
    const index = users.findIndex(u => u.id === String(user.id));
    if (index !== -1) {
      users[index] = { ...users[index], ...user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new Event('users_updated'));
      return users[index];
    }
    return null;
  },

  deleteUser: (id) => {
    const users = userService.getUsers();
    const filtered = users.filter(u => u.id !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('users_updated'));
  }
};
