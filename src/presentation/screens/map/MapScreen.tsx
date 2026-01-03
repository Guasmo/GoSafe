import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface MapLegendProps {
    visible: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <View style={styles.legend}>
            <Text style={styles.legendTitle}>Leyenda</Text>
            <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.zoneSafe }]} />
                <Text style={styles.legendText}>Segura</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.zoneWarning }]} />
                <Text style={styles.legendText}>Precaución</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.zoneDanger }]} />
                <Text style={styles.legendText}>Peligrosa</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.zoneNoData }]} />
                <Text style={styles.legendText}>Sin datos</Text>
            </View>
        </View>
    );
};

export default function MapScreen() {
    const [showLegend, setShowLegend] = useState(false);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 2));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleCenterMap = () => {
        setZoom(1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={colors.textSecondary} />
                        <Text style={styles.searchPlaceholder}>Buscar un lugar...</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.legendButton}
                        onPress={() => setShowLegend(!showLegend)}
                    >
                        <Ionicons name="layers" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Map Mockup */}
                <View style={styles.mapContainer}>
                    <Image
                        source={require('../../../../assets/images/map-mockup.png')}
                        style={[styles.mapImage, { transform: [{ scale: zoom }] }]}
                        resizeMode="cover"
                    />

                    {/* Precision Badge */}
                    <View style={styles.precisionBadge}>
                        <Text style={styles.precisionText}>Precisión: baja</Text>
                    </View>

                    {/* Scale Indicator */}
                    <View style={styles.scaleContainer}>
                        <View style={styles.scaleLine} />
                        <Text style={styles.scaleText}>200 m</Text>
                    </View>

                    {/* User Location Dot */}
                    <View style={styles.userLocation}>
                        <View style={styles.userLocationDot} />
                        <View style={styles.userLocationPulse} />
                    </View>
                </View>

                {/* Legend */}
                <MapLegend visible={showLegend} />

                {/* Map Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleZoomIn}
                    >
                        <Ionicons name="add" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleZoomOut}
                    >
                        <Ionicons name="remove" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleCenterMap}
                    >
                        <Ionicons name="locate" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? spacing.md : spacing.lg,
        left: spacing.md,
        right: spacing.md,
        zIndex: 10,
        flexDirection: 'row',
        gap: spacing.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchPlaceholder: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.md,
    },
    legendButton: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#E5E3DF',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    precisionBadge: {
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    precisionText: {
        color: 'white',
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    scaleContainer: {
        position: 'absolute',
        bottom: 120,
        right: spacing.md,
        alignItems: 'flex-end',
    },
    scaleLine: {
        width: 60,
        height: 3,
        backgroundColor: '#333',
        marginBottom: 4,
    },
    scaleText: {
        color: '#333',
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
    userLocation: {
        position: 'absolute',
        bottom: '45%',
        right: '15%',
    },
    userLocationDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4A90E2',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    userLocationPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        top: -12,
        left: -12,
    },
    legend: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 80 : 90,
        right: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: spacing.md,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    legendTitle: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    legendText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.sm,
    },
    controls: {
        position: 'absolute',
        bottom: spacing.xl + 60, // Espacio para el tab bar
        right: spacing.md,
        gap: spacing.sm,
        zIndex: 10,
    },
    controlButton: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});