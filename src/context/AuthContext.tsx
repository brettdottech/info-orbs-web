import {createContext, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import {toast} from "react-toastify";

interface AuthContextType {
    user: { id: number; username: string } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<{ id: number; username: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            setUser({id: userData.id, username: userData.username});
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${config.backendURL}/auth/login`, {email, password});
            const token = response.data.token;
            localStorage.setItem("token", token);
            const userData = JSON.parse(atob(token.split(".")[1]));
            setUser({id: userData.id, username: userData.username});
            toast.success("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
