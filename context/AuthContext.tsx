import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { authLogin } from '@/constants/endpoints';
import { AuthContext } from '@/hooks/useAuthContext';
import { AuthContextType, AuthResponse } from '@/interfaces/auth';
import apiService from '@/services/apiService';
import notificationService from '@/services/notificationServices';
import type { LoginParams } from '@/types/auth';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            const uid = await SecureStore.getItemAsync('userId');

            if (token && uid) {
                setIsAuthenticated(true);
                setAccessToken(token);
                setUserId(uid);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);

            const data: LoginParams = {
                email: email,
                password: password
            };

            const responseData = await apiService.createReqRes<LoginParams, AuthResponse>(
                authLogin,
                data
            );

            const {
                accessToken: token, refreshToken,
                userId: uid,
            } = responseData;

            await SecureStore.setItemAsync('accessToken', token);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await SecureStore.setItemAsync('userId', uid);

            setIsAuthenticated(true);
            setUserId(uid);
            setAccessToken(token);

            return { success: true };

        } catch (error: any) {
            console.error('Login error:', error);

            let errorMessage = 'No se pudo iniciar sesión';

            if (error.response) {
                console.error('Server error response:', error.response.data);
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                console.error('No response from server');
            } else {
                console.error('Error setting up request:', error.message);
            }

            notificationService.error('Error de autenticación', errorMessage);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('userId');
            setIsAuthenticated(false);
            setUserId(null);
            setAccessToken(null);

            notificationService.info('Sesión cerrada', 'Hasta pronto');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        isAuthenticated,
        userId,
        accessToken,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};