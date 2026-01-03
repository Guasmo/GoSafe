import Toast from 'react-native-toast-message';

export interface ApiError extends Error {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
}

const notificationService = {
    success: (message: string, description?: string) => {
        Toast.show({
            type: 'success',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: 3000,
        });
    },

    error: (message: string, description?: string, duration?: number) => {
        Toast.show({
            type: 'error',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: duration ? duration * 1000 : 3000,
        });
    },

    info: (message: string, description?: string) => {
        Toast.show({
            type: 'info',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: 3000,
        });
    }
};

export default notificationService;