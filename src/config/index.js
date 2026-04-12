// Toggle this when switching frontend targets locally.
//export const ENV = 'DEV';

 export const ENV = 'PROD';

const URLS = {
    DEV: {
        APP_URL: 'http://localhost:5173',
        API_BASE_URL: 'http://localhost:5000/api',
    },
    PROD: {
        APP_URL: 'https://gym-software-client.vercel.app',
        API_BASE_URL: 'https://sweat-zone.onrender.com/api',
    },
};

const requireEnv = (key) => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const selectedUrls = URLS[ENV];

if (!selectedUrls) {
    throw new Error(`Unsupported ENV value: ${ENV}`);
}

export const appConfig = {
    env: ENV,
    appUrl: selectedUrls.APP_URL,
    apiBaseUrl: selectedUrls.API_BASE_URL,
    supabaseUrl: requireEnv('VITE_SUPABASE_URL'),
    supabaseAnonKey: requireEnv('VITE_SUPABASE_ANON_KEY'),
};

export default appConfig;
