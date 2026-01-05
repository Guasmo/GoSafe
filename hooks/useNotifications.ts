import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { registerDeviceApi } from '@/constants/endpoints';
import { useAuthContext } from '@/hooks/useAuthContext';
import apiService from '@/services/apiService';
import notificationService from '@/services/notificationServices';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});


export const useNotifications = () => {

    const { userId } = useAuthContext();

    const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
    const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

    useEffect(() => {

        registerForPushNotificationsAsync().then(async newToken => {
            if (newToken && userId) {

                const savedToken = await SecureStore.getItemAsync('fcmToken');

                if (savedToken !== newToken) {
                    registerDevice(newToken, userId);
                }
            } else {

            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            const title = notification.request.content.title;
            const body = notification.request.content.body;

            notificationService.info(title || 'Notificación', body || 'Tienes un nuevo mensaje');
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [userId]);

    const registerDevice = async (token: string, uId: string) => {
        try {
            const response = await apiService.create(registerDeviceApi, { userId: uId, token: token })

            await SecureStore.setItemAsync('fcmToken', token);

            return response;
        } catch (error) {
            console.error('Error enviando token al backend:', error);
        }
    }

    return {
        registerDevice
    }
}


async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {

            return;
        }

        try {
            const tokenData = await Notifications.getDevicePushTokenAsync();
            token = tokenData.data;
        } catch (error) {
            console.error('Error obteniendo token FCM:', error);
        }

    } else {
        console.error('Usa un dispositivo físico para Push Notifications');
    }
    return token;
}
