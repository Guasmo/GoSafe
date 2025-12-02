import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>🧭</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Bienvenido de Vuelta</Text>
                    <Text style={styles.subtitle}>
                        Inicia sesión para explorar Cuenca de forma segura.
                    </Text>

                    {/* Form */}
                    <View style={styles.form}>
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

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
                        </TouchableOpacity>

                        <Button
                            title="Iniciar Sesión"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginButton}
                        />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>¿Aún no eres miembro? </Text>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Regístrate aquí</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl * 2,
        paddingBottom: spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    form: {
        marginTop: spacing.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: typography.fontSize.sm,
    },
    loginButton: {
        marginBottom: spacing.lg,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    registerLink: {
        color: colors.primary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
});
