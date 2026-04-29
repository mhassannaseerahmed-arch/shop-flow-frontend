import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    getUser: () => api.get('/auth/user'),
};

export const productService = {
    getAll: () => api.get('/products'),
    getOne: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products/add', data),
    update: (id, data) => api.post(`/products/update/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const subscriptionService = {
    getAll: () => api.get('/subscriptions'),
    getOne: (id) => api.get(`/subscriptions/${id}`),
    create: (data) => api.post('/subscriptions/add', data),
    update: (id, data) => api.post(`/subscriptions/update/${id}`, data),
    delete: (id) => api.delete(`/subscriptions/${id}`),
    cancel: (id) => api.post(`/subscriptions/cancel/${id}`),
};

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
};

export const customerService = {
    getAll: () => api.get('/customers'),
    getOne: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers/add', data),
    update: (id, data) => api.post(`/customers/update/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
};

export const paymentService = {
    createCheckoutSession: (data) => api.post('/payments/create-checkout-session', data),
};

export const invoiceService = {
    getAll: () => api.get('/invoices'),
    getOne: (id) => api.get(`/invoices/${id}`),
    create: (data) => api.post('/invoices/add', data),
};

export default api;
