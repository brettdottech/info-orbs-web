import axios from 'axios';
import config from "../config.ts";
import {useMemo} from "react";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";

export const useApi = () => {
    const {getToken, logout} = useKindeAuth();

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: config.backendURL,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        instance.interceptors.request.use(async (config) => {
            const token = await getToken();
            console.log("api", token?.substring(0, 20));
            if (token) {
                const dec = jwtDecode(token);
                console.log("apiDec", dec);
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })

        // Intercept response errors
        instance.interceptors.response.use(
            (response) => {
                // If the response is successful, just return it
                return response;
            },
            (error) => {
                // Handle errors
                if (error.response) {
                    if (error.response.status === 403) {
                        // Token is invalid or expired

                        // Clear the token in the context
                        logout(config.frontendURL);

                        // Notify the user via toast
                        toast.error("Session expired. Please log in again.");

                        return Promise.reject("Token expired, logging out...");
                    }
                }
                // For other errors, return the error object
                return Promise.reject(error);
            }
        );

        return instance;
    }, [getToken, logout]);

    return api;
};
