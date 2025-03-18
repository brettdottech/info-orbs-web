// src/hooks/useApi.ts
import axios from 'axios';
import {useToken} from '../context/AuthContext.tsx';
import config from "../config.ts";
import {useMemo} from "react";

export const useApi = () => {
    const {token} = useToken();

    const api = useMemo(() => {
        // console.log("api", token?.substring(0, 20));
        const instance = axios.create({
            baseURL: config.backendURL,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        instance.interceptors.request.use(async (config) => {
            console.log("api", token?.substring(0, 20));
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })
        return instance;
    }, [token]);

    return api;
};
