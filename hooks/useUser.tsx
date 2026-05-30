import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { API_URL } from "@/config/Config";
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
        console.log(`[useUser] Fetching data for userId: ${userId}`);
        try {
            setLoading(true);
            setError(null);

            if (!userId) {
                console.warn("[useUser] No user ID found in context");
                return;
            }

            const response = await apiService.getById<UserInterface>(userById, userId);
            console.log('[useUser] Raw response from backend:', JSON.stringify(response, null, 2));

            if (response && response.imageUrl) {
                const timestamp = new Date().getTime();
                console.log(`[useUser] Original imageUrl: ${response.imageUrl}`);

                if (response.imageUrl.startsWith('http')) {
                    if (response.imageUrl.includes('facebook.com')) {
                        const separator = response.imageUrl.includes('?') ? '&' : '?';
                        if (!response.imageUrl.includes('type=')) {
                            response.imageUrl = `${response.imageUrl}${separator}type=large&t=${timestamp}`;
                        } else {
                            response.imageUrl = `${response.imageUrl}&t=${timestamp}`;
                        }
                        console.log(`[useUser] Facebook URL detected, transformed to: ${response.imageUrl}`);
                    } else {
                        response.imageUrl = response.imageUrl
                            .replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, API_URL);
                        console.log(`[useUser] External URL detected, localhost replaced: ${response.imageUrl}`);
                    }
                } else if (response.imageUrl.startsWith('/')) {
                    response.imageUrl = `${API_URL}${response.imageUrl}${response.imageUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
                    console.log(`[useUser] Relative URL detected, transformed to: ${response.imageUrl}`);
                }
            } else {
                console.log('[useUser] User has no imageUrl');
            }

            console.log('[useUser] Final processed user data:', JSON.stringify(response, null, 2));
            setUser(response);

        } catch (err: any) {
            const errorMessage = err.message || "Error al obtener el usuario";
            setError(errorMessage);
            console.error('[useUser] getUser Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const uploadProfileImage = async (uri: string) => {
        console.log(`[useUser] Starting upload for URI: ${uri}`);
        try {
            setLoading(true);
            setError(null);

            if (!userId) throw new Error("No user ID found");

            const formData = new FormData();
            const filename = uri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            console.log(`[useUser] Preparing FormData: name=${filename}, type=${type}, uri=${uri}`);

            // @ts-ignore
            formData.append('image', {
                uri: uri,
                name: filename,
                type,
            });

            const uploadUrl = `${API_URL}/upload/profile-image/${userId}`;
            console.log(`[useUser] Uploading to: ${uploadUrl}`);

            const token = await SecureStore.getItemAsync("accessToken");
            console.log(`[useUser] Using token: ${token ? 'Token present' : 'Token MISSING'}`);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            console.log(`[useUser] Fetch response status: ${response.status} ${response.statusText}`);

            const result = await response.json();
            console.log('[useUser] Upload result:', JSON.stringify(result, null, 2));

            if (result.success) {
                console.log('[useUser] Upload successful, refreshing user data...');
                await getUser();
                return { success: true };
            }

            console.error(`[useUser] Upload failed: ${result.message}`);
            return { success: false, error: result.message };

        } catch (err: any) {
            const errorMessage = err.message || "Error al subir la imagen";
            setError(errorMessage);
            console.error('[useUser] uploadProfileImage Error:', err);
            return { success: false, error: errorMessage };
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
        getUser,
        uploadProfileImage
    };
};