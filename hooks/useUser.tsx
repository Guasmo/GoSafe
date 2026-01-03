import { useEffect, useState } from "react";

import { API_URL } from "@/constants/Config";
import { userById } from "@/constants/endpoints";
import { UserInterface } from "@/interfaces/UserInterface";
import apiService from "@/services/apiService";
import { useAuthContext } from "./useAuthContext";

export const useUser = () => {
    const { userId } = useAuthContext();

    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUser = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!userId) {
                console.warn("No user ID found");
                return;
            }

            const response = await apiService.getById<UserInterface>(userById, userId);

            if (response && response.imageUrl) {
                if (response.imageUrl.startsWith('http')) {
                    // Reemplaza dinámicamente cualquier localhost/127.0.0.1 con la IP configurada
                    response.imageUrl = response.imageUrl
                        .replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, API_URL);
                } else if (response.imageUrl.startsWith('/')) {
                    // Si es una ruta relativa, le agregamos la URL base
                    response.imageUrl = `${API_URL}${response.imageUrl}`;
                }
            }

            setUser(response);

        } catch (err: any) {
            const errorMessage = err.message || "Error al obtener el usuario";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getUser();
        }
    }, [userId]);

    return {
        user,
        loading,
        error,
        getUser
    };
};