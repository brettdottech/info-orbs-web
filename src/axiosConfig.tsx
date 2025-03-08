import axios from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";

// Custom event to notify AuthContext when token is removed
const tokenExpiredEvent = new Event("tokenExpired");

const isExpired = (token: string) => {
    const {exp} = jwtDecode<JwtPayload>(token);
    return !exp || exp < Date.now() / 1000;
};

// Set up request interceptor globally
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (isExpired(token)) {
            console.error("Token expired in req interceptor");
            localStorage.removeItem("token"); // Clear expired token
            window.dispatchEvent(tokenExpiredEvent); // Notify AuthContext
        } else {
            // console.log("Adding token to request");
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axios; // Export axios so it can be used elsewhere
