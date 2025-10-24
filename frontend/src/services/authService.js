import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      nombre_usuario: username,
      password: password
    });

    if (response.data.user) {
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  }
};
