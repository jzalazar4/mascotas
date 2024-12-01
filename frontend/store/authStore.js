import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated : false,
    error: null,
    isLoading : false, 
    isCheckingAuth : true,
    message: null,

    signup: async (email, password, name, lastName) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name, lastName });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error al registrarse", isLoading: false});
            throw error;
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({ 
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: false,
                message: "Bienvenido!"
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al registrarse", isLoading: false});
            throw error;
        }
    },
    logout: async () => {
        set({ 
            //user: null,
            isLoading: true,
            error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
                message: "Sesión finalizada"
            });
            
        } catch (error) {
            set({ error: "No se pudo cerrar sesión", isLoading: false});
            throw error;
        }
    },
   
 
}));