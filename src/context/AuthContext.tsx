import {createContext} from "react";

interface AuthContextType {
    user: { id: number; username: string; isAdmin: boolean } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
