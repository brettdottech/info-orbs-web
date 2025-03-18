import {createContext, useContext, useState} from 'react';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {Role} from "../types/Role.ts";

type AuthContextType = {
    token: string | null;
    setToken: (t: string | null) => void;
    hasRole: (role: string) => boolean;
    hasPermission: (perm: string) => boolean;
}

type JwtExtra = {
    permissions: string[];
    org_code: string;
    org_codes: string[];
    roles: Role[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>(null);

    const decodeToken = () => {
        return token ? jwtDecode<JwtPayload & JwtExtra>(token) : null;
    }

    const hasRole = (role: string) => {
        const decoded = decodeToken();
        console.log("roles", decoded?.roles);
        return decoded?.roles.some(r => r.key === role) || false;
    }

    const hasPermission = (perm: string) => {
        const decoded = decodeToken();
        return decoded?.permissions.includes(perm) || false;
    }

    return (
        <AuthContext.Provider value={{token, setToken, hasRole, hasPermission}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useToken = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useToken must be used inside TokenProvider');
    return context;
};