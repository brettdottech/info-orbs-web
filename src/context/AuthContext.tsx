import {createContext, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    user: { id: number; username: string; isAdmin: boolean } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<{ id: number; username: string; isAdmin: boolean } | null>(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const isExpired = (token: string) => {
        const {exp} = jwtDecode(token);
        return !exp || exp < Date.now() / 1000;
    }

    useEffect(() => {
        // console.log(`Checking token ${token}`);
        if (token) {
            if (isExpired(token)) {
                // expired
                // console.error("Token expired");
                logout();
            } else {
                // token is valid
                const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                console.log(userData);
                setUser({id: userData.id, username: userData.username, isAdmin: userData.isAdmin});
                // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
            }
        } else {
            // no token
            setUser(null);
            // delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    // 🚀 Listen for "tokenExpired" event
    useEffect(() => {
        const handleTokenExpired = () => {
            console.warn("Token expired event received");
            logout();
        };

        window.addEventListener("tokenExpired", handleTokenExpired);
        return () => window.removeEventListener("tokenExpired", handleTokenExpired);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${config.backendURL}/auth/login`, {email, password});
            // console.log(response.data);
            const token = response.data.token;
            setToken(token);
            toast.success("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed");
        }
    };

    const logout = () => {
        console.log("Logout");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
