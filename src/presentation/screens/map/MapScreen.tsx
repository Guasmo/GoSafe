import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useMapWebView } from '../../../../hooks/useMapWebView';
import { useUserLocation } from '../../../../hooks/useUserLocation';
import { useZones } from '../../../../hooks/useZones';
import { DangerousZone } from '../../../../interfaces/DangerousZone';
import { ZoneDetailModal } from '../../components/ZoneDetailModal';
import { colors } from '../../theme/colors';

interface MapLegendProps {
    visible: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <View className="absolute top-20 right-4 bg-[#2A2A2A] rounded-xl p-4 shadow-lg z-10">
            <Text className="text-white text-base font-semibold mb-2">Leyenda</Text>
            <View className="flex-row items-center mb-1">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.zoneSafe }} />
                <Text className="text-gray-300 text-sm ml-2">Turístico</Text>
            </View>
            <View className="flex-row items-center mb-1">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.zoneWarning }} />
                <Text className="text-gray-300 text-sm ml-2">Precaución</Text>
            </View>
            <View className="flex-row items-center">
                <View className="w-4 h-4 rounded" style={{ backgroundColor: colors.zoneDanger }} />
                <Text className="text-gray-300 text-sm ml-2">Peligrosa</Text>
            </View>
        </View>
    );
};

export default function MapScreen() {
    const [showLegend, setShowLegend] = useState(false);
    const [selectedZone, setSelectedZone] = useState<DangerousZone | null>(null);

    // Custom hooks
    const { zones, loading } = useZones();
    const { userLocation, getCurrentLocation } = useUserLocation();
    const { webViewRef, handleWebViewMessage, centerMapOnLocation } = useMapWebView({
        zones,
        userLocation,
        onZoneClick: (zoneId) => {
            const zone = zones.find(z => z.id === zoneId);
            if (zone) setSelectedZone(zone);
        }
    });

    const handleCenterMap = async () => {
        const location = await getCurrentLocation();
        if (location) {
            centerMapOnLocation(location.latitude, location.longitude);
        }
    };

    const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            
            /* Custom User Location Marker */
            .user-location-marker {
                background-color: #4285F4;
                border: 2px solid white;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
            }

            /* Custom Tourist Marker */
            .tourist-marker {
                background-color: transparent;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            // Use CartoDB Voyager for a cleaner map style (less clutter)
            var map = L.map('map', {
                zoomControl: false,
                attributionControl: false
            }).setView([-2.8974, -79.0050], 16); // Zoomed in on Cuenca

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(map);

            var markersLayer = L.layerGroup().addTo(map);
            var userMarker = null;

            // Custom SVG Icon for Tourist Spots (Green Pin)
            var touristIconHtml = \`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C11.1634 0 4 7.16344 4 16C4 26.5 20 40 20 40C20 40 36 26.5 36 16C36 7.16344 28.8366 0 20 0Z" fill="${colors.zoneSafe}"/>
                    <circle cx="20" cy="16" r="6" fill="white"/>
                </svg>
            \`;

            var touristIcon = L.divIcon({
                className: 'tourist-marker',
                html: touristIconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });

            window.updateZones = function(zonesData) {
                markersLayer.clearLayers();
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOG', message: 'Updating zones in WebView: ' + zonesData.length }));

                zonesData.forEach(function(zone) {
                    var isTouristSpot = zone.dangerLevel.name === 'SAFE';

                    if (isTouristSpot && zone.coordinates.length > 0) {
                        var centerLat = 0, centerLng = 0;
                        zone.coordinates.forEach(function(c) { 
                            centerLat += parseFloat(c.latitude); 
                            centerLng += parseFloat(c.longitude); 
                        });
                        centerLat /= zone.coordinates.length;
                        centerLng /= zone.coordinates.length;
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                            type: 'LOG', 
                            message: 'Creating marker at: ' + centerLat + ', ' + centerLng 
                        }));
                        
                        // Use SVG Icon
                        var marker = L.marker([centerLat, centerLng], { icon: touristIcon }).addTo(markersLayer);
                        
                        marker.on('click', function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'ZONE_CLICK',
                                zoneId: zone.id
                            }));
                        });
                    } else if (zone.coordinates && zone.coordinates.length > 0) {
                        var latlngs = zone.coordinates.map(function(coord) {
                            return [parseFloat(coord.latitude), parseFloat(coord.longitude)];
                        });

                        var polygon = L.polygon(latlngs, {
                            color: zone.dangerLevel.color,
                            fillColor: zone.dangerLevel.color,
                            fillOpacity: 0.4,
                            weight: 2
                        }).addTo(markersLayer);
                        
                        polygon.on('click', function() {
                             window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'ZONE_CLICK',
                                zoneId: zone.id
                            }));
                        });
                    }
                });
            };

            var userIcon = L.divIcon({
                className: 'user-location-marker',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            window.updateUserLocation = function(lat, lng) {
                if (userMarker) {
                    userMarker.setLatLng([lat, lng]);
                } else {
                    userMarker = L.marker([lat, lng], {icon: userIcon}).addTo(map);
                }
            };
        </script>
    </body>
    </html>
    `;

    return (
        <SafeAreaView className="flex-1 bg-[#1A1A1A]">
            <View className="flex-1">
                {/* Search Bar and Legend Button */}
                <View
                    className="absolute left-4 right-4 z-10 flex-row gap-2"
                    style={{ top: Platform.OS === 'ios' ? 16 : 24 }}
                >
                    <View className="flex-1 flex-row items-center bg-[#2A2A2A] rounded-xl px-4 py-3 gap-2 shadow-lg">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <Text className="text-gray-400 text-base">Buscar un lugar...</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-[#2A2A2A] rounded-xl p-3 justify-center items-center w-12 h-12 shadow-lg"
                        onPress={() => setShowLegend(!showLegend)}
                    >
                        <Ionicons name="layers" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Map Container */}
                <View className="flex-1 bg-[#E5E3DF] overflow-hidden">
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: leafletHtml }}
                        className="w-full h-full"
                        onMessage={handleWebViewMessage}
                    />
                    {loading && (
                        <View className="absolute inset-0 justify-center items-center bg-white/50">
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )}
                </View>

                {/* Legend */}
                <MapLegend visible={showLegend} />

                {/* Center Map Button */}
                <View className="absolute bottom-5 right-4 gap-2 z-10">
                    <TouchableOpacity
                        className="bg-[#2A2A2A] rounded-xl p-3 justify-center items-center w-13 h-13 shadow-lg"
                        onPress={handleCenterMap}
                    >
                        <Ionicons name="locate" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Zone Details Modal */}
                <ZoneDetailModal
                    visible={!!selectedZone}
                    zone={selectedZone}
                    onClose={() => setSelectedZone(null)}
                />
            </View>
        </SafeAreaView>
    );
}