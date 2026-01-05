import { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { DangerousZone } from '../interfaces/DangerousZone';

interface UseMapWebViewProps {
    zones: DangerousZone[];
    userLocation: { latitude: number; longitude: number } | null;
    onZoneClick: (zoneId: string) => void;
}

export const useMapWebView = ({ zones, userLocation, onZoneClick }: UseMapWebViewProps) => {
    const webViewRef = useRef<WebView>(null);

    // Inject zones when they change
    useEffect(() => {
        if (zones.length > 0 && webViewRef.current) {

            const updateZonesScript = `
                if (window.updateZones) {
                    window.updateZones(${JSON.stringify(zones)});
                } else {

                }
                true;
            `;
            webViewRef.current.injectJavaScript(updateZonesScript);
        }
    }, [zones]);

    // Update user location marker
    useEffect(() => {
        if (userLocation && webViewRef.current) {
            const updateMarkerScript = `
                if (window.updateUserLocation) {
                    window.updateUserLocation(${userLocation.latitude}, ${userLocation.longitude});
                }
                true;
            `;
            webViewRef.current.injectJavaScript(updateMarkerScript);
        }
    }, [userLocation]);

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'ZONE_CLICK') {
                onZoneClick(data.zoneId);
            } else if (data.type === 'LOG') {

            }
        } catch (e) {

        }
    };

    const centerMapOnLocation = async (latitude: number, longitude: number) => {
        const centerScript = `
            map.setView([${latitude}, ${longitude}], 15);
            true;
        `;
        webViewRef.current?.injectJavaScript(centerScript);
    };

    return {
        webViewRef,
        handleWebViewMessage,
        centerMapOnLocation
    };
};
