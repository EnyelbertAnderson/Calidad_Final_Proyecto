import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuración de axios con token
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // ✅ Formato correcto
    console.log("Token enviado:", token.substring(0, 20) + "...");  // Debug
  } else {
    console.warn("⚠️ No hay token en localStorage");
  }
  
  return config;
});

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Token inválido o expirado");
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de Dashboard
export const dashboardService = {
  getStats: () => api.get('/vigilancia/dashboard/stats/'),
  getEventosRecientes: (limit = 10) => api.get(`/vigilancia/dashboard/eventos-recientes/?limit=${limit}`),
};

// Servicios de Cámaras
export const camarasService = {
  getAll: (params = {}) => api.get('/vigilancia/camaras/', { params }),
  getGeo: (params = {}) => api.get('/vigilancia/camaras/geo/', { params }),
  getById: (id) => api.get(`/vigilancia/camaras/${id}/`),
};

// Servicios de Eventos
export const eventosService = {
  getAll: (params = {}) => api.get('/vigilancia/eventos/', { params }),
  create: (data) => api.post('/vigilancia/eventos/', data),
};

// Servicios de Zonas
export const zonasService = {
  getAll: () => api.get('/vigilancia/zonas/'),
};

export default api;