import { signInWithFacebook } from '@/config/firebase.native';
import * as SecureStore from 'expo-secure-store';
import { authLogin, authRegister } from '../constants/endpoints';
import { AuthResponse } from '../interfaces/auth';
import apiService from './apiService';
import notificationService from './notificationServices';

export interface SocialAuthData {
    email: string;
    name: string;
    photoURL?: string;
    uid: string;
    provider: 'facebook' | 'google';
}

class AuthService {
    /**
     * Login con email y contraseña tradicional
     */
    async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
        try {
            const data = {
                email: email.trim(),
                password: password,
            };

            const responseData = await apiService.createReqRes<typeof data, AuthResponse>(
                authLogin,
                data
            );

            await this.storeTokens(responseData);
            return responseData;
        } catch (error: any) {
            console.error('Email login error:', error);
            throw error;
        }
    }

    /**
     * Login con Facebook
     */
    async loginWithFacebook(): Promise<AuthResponse> {
        try {
            // 1. Autenticar con Firebase/Facebook
            const firebaseUser = await signInWithFacebook();

            if (!firebaseUser) {
                throw new Error('No se pudo autenticar con Facebook');
            }

            // 2. Obtener el token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();
            console.log('Firebase PhotoURL:', firebaseUser.photoURL);

            // 3. Enviar al backend para validar y crear/obtener usuario
            const socialAuthData: SocialAuthData = {
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'Usuario de Facebook',
                photoURL: firebaseUser.photoURL || undefined,
                uid: firebaseUser.uid,
                provider: 'facebook',
            };

            const responseData = await this.authenticateWithBackend(
                socialAuthData,
                firebaseToken
            );

            await this.storeTokens(responseData);
            return responseData;
        } catch (error: any) {
            console.error('Facebook login error:', error);

            if (error.code === 'auth/account-exists-with-different-credential') {
                notificationService.error(
                    'Cuenta existente',
                    'Ya existe una cuenta con este email usando otro método de inicio de sesión'
                );
            } else if (error.message?.includes('cancelled')) {
                notificationService.info('Cancelado', 'Inicio de sesión cancelado');
            } else {
                notificationService.error(
                    'Error de autenticación',
                    'No se pudo iniciar sesión con Facebook'
                );
            }

            throw error;
        }
    }

    /**
     * Registrar nuevo usuario (email/password)
     */
    async register(email: string, password: string, name: string, userName: string): Promise<AuthResponse> {
        try {
            const data = {
                email: email.trim(),
                password: password,
                name: name.trim(),
                userName: userName.trim(),
            };

            const responseData = await apiService.createReqRes<typeof data, AuthResponse>(
                authRegister,
                data
            );

            await this.storeTokens(responseData);
            return responseData;
        } catch (error: any) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Autenticar con el backend usando datos sociales
     */
    private async authenticateWithBackend(
        socialData: SocialAuthData,
        firebaseToken: string
    ): Promise<AuthResponse> {
        try {
            // Endpoint especial para autenticación social
            const response = await apiService.createReqRes<
                { socialData: SocialAuthData; firebaseToken: string },
                AuthResponse
            >('/auth/social-login', {
                socialData,
                firebaseToken,
            });

            return response;
        } catch (error: any) {
            console.error('Backend authentication error:', error);
            throw error;
        }
    }

    /**
     * Almacenar tokens en SecureStore
     */
    private async storeTokens(authResponse: AuthResponse): Promise<void> {
        await SecureStore.setItemAsync('accessToken', authResponse.accessToken);
        await SecureStore.setItemAsync('refreshToken', authResponse.refreshToken);
        await SecureStore.setItemAsync('userId', authResponse.userId);
    }

    /**
     * Cerrar sesión
     */
    async logout(): Promise<void> {
        try {
            // Cerrar sesión de Firebase

            // Limpiar tokens locales
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('userId');
            await SecureStore.deleteItemAsync('fcmToken');

            notificationService.info('Sesión cerrada', 'Hasta pronto');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    /**
     * Verificar si hay una sesión activa
     */
    async checkAuthStatus(): Promise<{
        isAuthenticated: boolean;
        userId: string | null;
        accessToken: string | null;
    }> {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            const uid = await SecureStore.getItemAsync('userId');

            return {
                isAuthenticated: !!(token && uid),
                userId: uid,
                accessToken: token,
            };
        } catch (error) {
            console.error('Error checking auth status:', error);
            return {
                isAuthenticated: false,
                userId: null,
                accessToken: null,
            };
        }
    }
}

export default new AuthService();