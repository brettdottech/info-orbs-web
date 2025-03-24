const config = {
    // Override during build using env variables
    backendURL: import.meta.env.VITE_BACKEND_URL,
    frontendURL: import.meta.env.VITE_FRONTEND_URL,
    kindeDomain: import.meta.env.VITE_KINDE_DOMAIN,
    kindeClientId: import.meta.env.VITE_KINDE_CLIENT_ID,
};

export default config;