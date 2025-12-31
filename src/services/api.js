const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Auth API
export const authAPI = {
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },
    me: async () => {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() });
        return res.json();
    }
};

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/categories`, { headers: getAuthHeaders() });
        return res.json();
    },
    create: async (data) => {
        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    update: async (id, data) => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    delete: async (id) => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};

// Articles API
export const articlesAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/articles`, { headers: getAuthHeaders() });
        return res.json();
    },
    getById: async (id) => {
        const res = await fetch(`${API_URL}/articles/${id}`, { headers: getAuthHeaders() });
        return res.json();
    },
    create: async (data) => {
        const res = await fetch(`${API_URL}/articles`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    update: async (id, data) => {
        const res = await fetch(`${API_URL}/articles/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    delete: async (id) => {
        const res = await fetch(`${API_URL}/articles/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};

// Reports API (with file upload)
export const reportsAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/reports`, { headers: getAuthHeaders() });
        return res.json();
    },
    create: async (formData) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/reports`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },
    update: async (id, formData) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/reports/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    },
    delete: async (id) => {
        const res = await fetch(`${API_URL}/reports/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};

// Users API (Admin only)
export const usersAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
        return res.json();
    },
    create: async (data) => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    update: async (id, data) => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    delete: async (id) => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};

// Profile API
export const profileAPI = {
    get: async () => {
        const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeaders() });
        return res.json();
    },
    update: async (data) => {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    changePassword: async (data) => {
        const res = await fetch(`${API_URL}/profile/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async () => {
        const res = await fetch(`${API_URL}/dashboard/stats`, { headers: getAuthHeaders() });
        return res.json();
    }
};

// Upload API
export const uploadAPI = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return res.json();
    }
};

