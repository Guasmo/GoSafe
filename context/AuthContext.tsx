import { AuthContext } from '@/hooks/useAuthContext';
import { AuthContextType } from '@/interfaces/auth';
import authService from '@/services/authService';
import notificationService from '@/services/notificationServices';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const status = await authService.checkAuthStatus();

            if (status.isAuthenticated && status.userId && status.accessToken) {
                setIsAuthenticated(true);
                setAccessToken(status.accessToken);
                setUserId(status.userId);
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

            const response = await authService.loginWithEmail(email, password);

            setIsAuthenticated(true);
            setUserId(response.userId);
            setAccessToken(response.accessToken);

            notificationService.success('¡Bienvenido!', 'Inicio de sesión exitoso');
            return { success: true };

        } catch (error: any) {
            console.error('Login error:', error);

            let errorMessage = 'No se pudo iniciar sesión';

            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }

            notificationService.error('Error de autenticación', errorMessage);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const loginWithFacebook = async () => {
        try {
            setLoading(true);

            const response = await authService.loginWithFacebook();

            setIsAuthenticated(true);
            setUserId(response.userId);
            setAccessToken(response.accessToken);

            notificationService.success('¡Bienvenido!', 'Inicio de sesión exitoso con Facebook');
            return { success: true };

        } catch (error: any) {
            console.error('Facebook login error:', error);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            await authService.logout();

            setIsAuthenticated(false);
            setUserId(null);
            setAccessToken(null);

        } catch (err) {
            console.error('Logout error:', err);
            notificationService.error('Error', 'No se pudo cerrar sesión correctamente');
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
        loginWithFacebook,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};