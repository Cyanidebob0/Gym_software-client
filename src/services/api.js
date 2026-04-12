import axios from 'axios';
import supabase from './supabase';

// ── Key conversion utilities ──────────────────────────────────────────────────
const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const camelToSnake = (str) => str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

const convertKeys = (obj, converter) => {
    if (Array.isArray(obj)) return obj.map((item) => convertKeys(item, converter));
    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [converter(key), convertKeys(value, converter)])
        );
    }
    return obj;
};

// ── Cached auth token ─────────────────────────────────────────────────────────
let cachedAccessToken = null;

// Promise that resolves once the initial session is loaded
const sessionReady = supabase.auth.getSession().then(({ data: { session } }) => {
    cachedAccessToken = session?.access_token ?? null;
});

// Keep token in sync on login/logout/refresh
supabase.auth.onAuthStateChange((_event, session) => {
    cachedAccessToken = session?.access_token ?? null;
});

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach cached JWT token + convert request body keys to snake_case
// Wait for initial session on first request, then use cached token (sync) for all subsequent ones
api.interceptors.request.use(async (config) => {
    if (cachedAccessToken === null) {
        await sessionReady;
    }
    if (cachedAccessToken) {
        config.headers.Authorization = `Bearer ${cachedAccessToken}`;
    }

    if (config.data && typeof config.data === 'object') {
        config.data = convertKeys(config.data, camelToSnake);
    }
    return config;
}, Promise.reject);

// Convert response data keys to camelCase + handle 401
api.interceptors.response.use(
    (response) => {
        if (response.data && typeof response.data === 'object') {
            response.data = convertKeys(response.data, snakeToCamel);
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;
