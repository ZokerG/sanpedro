import { axiosInstance } from './axiosConfig';

export const authService = {
  login: async (credentials: any) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },
  
  register: async (userData: any) => {
    // Endpoints públicos para crear usuario
    const { data } = await axiosInstance.post('/usuarios', userData);
    return data;
  }
};
