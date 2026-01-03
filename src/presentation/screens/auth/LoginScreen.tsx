import { useAuthContext } from '@/hooks/useAuthContext';
import notificationService from '@/services/notificationServices';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../components/common/Input';

export default function LoginScreen() {
    const { login, loading: authLoading } = useAuthContext();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        if (!email.trim() || !password.trim()) {
            return;
        }

        try {
            const result = await login(email.trim(), password);

            if (result.success) {
                router.replace('/(tabs)');
            }
        } catch (error) {
            notificationService.error('Error', 'No se pudo iniciar sesión');
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-grow"
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-6 pt-24 pb-8">
                    {/* Logo */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 rounded-[20px] bg-primaryDark items-center justify-center">
                            <Text className="text-[40px]">🧭</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-[32px] font-bold text-textPrimary text-center mb-2">Bienvenido</Text>
                    <Text className="text-base text-textSecondary text-center mb-8">
                        Inicia sesión para explorar Cuenca de forma segura.
                    </Text>

                    {/* Form */}
                    <View className="mt-6">
                        <Input
                            label="Correo electrónico o usuario"
                            placeholder="Introduce tu correo o usuario"
                            value={email}
                            onChangeText={setEmail}
                            icon="person"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Input
                            label="Contraseña"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChangeText={setPassword}
                            icon="lock-closed"
                            isPassword
                        />

                        <TouchableOpacity className="self-end mb-6">
                            <Text className="text-primary text-sm">Olvidé mi contraseña</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`bg-black rounded-xl p-[18px] items-center mb-6 shadow-md ${authLoading ? 'opacity-60' : ''}`}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={authLoading}
                        >
                            {authLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white text-[17px] font-semibold tracking-wide">
                                    Iniciar Sesión
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View className="flex-row justify-center items-center">
                            <Text className="text-textSecondary text-sm">¿Aún no eres miembro? </Text>
                            <TouchableOpacity>
                                <Text className="text-primary text-sm font-semibold">Regístrate aquí</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

