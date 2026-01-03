import { myToastConfig } from '@/components/toast';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';

import "../global.css";

function NavigationGuard() {
  useNotifications();
  const { isAuthenticated, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isLogin = !segments[0] || segments[0] === 'login';

    if (!isAuthenticated && !isLogin) {
      router.replace('/login');
    } else if (isAuthenticated && isLogin) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationGuard />
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast config={myToastConfig} />
    </AuthProvider>
  );
}