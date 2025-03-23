const config = {
    // Override during build using env variables
    backendURL: import.meta.env.VITE_BACKEND_URL,
    frontendURL: import.meta.env.VITE_FRONTEND_URL
};

export default config;