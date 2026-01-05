import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UserLocation {
    latitude: number;
    longitude: number;
}

export const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para mostrarte en el mapa.');
            return false;
        }

        setPermissionGranted(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });

        // Watch position updates
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 10,
            },
            (newLocation) => {
                setUserLocation({
                    latitude: newLocation.coords.latitude,
                    longitude: newLocation.coords.longitude
                });
            }
        );

        return true;
    };

    const getCurrentLocation = async (): Promise<UserLocation | null> => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                await requestLocationPermission();
                return null;
            }

            const location = await Location.getCurrentPositionAsync({});
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };
        } catch (error) {
            console.error("Error getting location", error);
            Alert.alert("Error", "No se pudo obtener tu ubicación actual.");
            return null;
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    return { userLocation, permissionGranted, getCurrentLocation };
};
