import React from 'react';
import { BaseToast } from 'react-native-toast-message';

export const myToastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#4ade80',
                backgroundColor: '#1f2937',
                width: '90%',
                height: 80,
                borderRadius: 12,
                borderLeftWidth: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }}
            text2Style={{
                color: '#cbd5e1',
                fontSize: 14
            }}
        />
    ),
    error: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#ef4444',
                backgroundColor: '#1f2937',
                width: '90%',
                height: 80,
                borderRadius: 12,
                borderLeftWidth: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }}
            text2Style={{
                color: '#cbd5e1',
                fontSize: 14
            }}
        />
    ),
    info: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#3b82f6',
                backgroundColor: '#1f2937',
                width: '90%',
                height: 80,
                borderRadius: 12,
                borderLeftWidth: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }}
            text2Style={{
                color: '#cbd5e1',
                fontSize: 14
            }}
        />
    ),
};
