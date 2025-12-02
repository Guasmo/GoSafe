import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

interface MarkerProps {
    title: string;
    top: number;
    left: number;
    color?: string;
}

const Marker: React.FC<MarkerProps> = ({ title, top, left, color = colors.primary }) => (
    <View style={[styles.marker, { top, left }]}>
        <View style={[styles.markerPin, { backgroundColor: color }]}>
            <Ionicons name="location" size={24} color="white" />
        </View>
        <Text style={styles.markerLabel}>{title}</Text>
    </View>
);

interface ZoneProps {
    top: number;
    left: number;
    width: number;
    height: number;
    color: string;
}

const Zone: React.FC<ZoneProps> = ({ top, left, width, height, color }) => (
    <View
        style={[
            styles.zone,
            {
                top,
                left,
                width,
                height,
                backgroundColor: `${color}40`,
                borderColor: color,
            },
        ]}
    />
);

export default function MapScreen() {
    const [showLegend, setShowLegend] = useState(false);
    const [zoom, setZoom] = useState(1);

    return (
        <View style={styles.container}>
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

            {/* Map Container */}
            <ScrollView
                style={styles.mapScrollView}
                contentContainerStyle={styles.mapContent}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={[styles.mapCanvas, { transform: [{ scale: zoom }] }]}>
                    {/* Background - Simulated map */}
                    <View style={styles.mapBackground}>
                        <View style={styles.gridLine} />
                        <View style={[styles.gridLine, { top: '25%' }]} />
                        <View style={[styles.gridLine, { top: '50%' }]} />
                        <View style={[styles.gridLine, { top: '75%' }]} />
                        <View style={[styles.gridLine, { transform: [{ rotate: '90deg' }], left: '25%' }]} />
                        <View style={[styles.gridLine, { transform: [{ rotate: '90deg' }], left: '50%' }]} />
                        <View style={[styles.gridLine, { transform: [{ rotate: '90deg' }], left: '75%' }]} />

                        {/* City name */}
                        <Text style={styles.cityName}>CUENCA</Text>

                        {/* Streets simulation */}
                        <View style={[styles.street, { top: '30%', left: 0, width: '100%', height: 3 }]} />
                        <View style={[styles.street, { top: '60%', left: 0, width: '100%', height: 3 }]} />
                        <View style={[styles.street, { top: 0, left: '40%', width: 3, height: '100%' }]} />
                        <View style={[styles.street, { top: 0, left: '70%', width: 3, height: '100%' }]} />
                    </View>

                    {/* Danger Zones */}
                    <Zone top={100} left={150} width={120} height={100} color={colors.zoneDanger} />
                    <Zone top={80} left={50} width={100} height={90} color={colors.zoneWarning} />
                    <Zone top={200} left={250} width={110} height={95} color={colors.zoneSafe} />
                    <Zone top={150} left={300} width={90} height={80} color={colors.zoneNoData} />

                    {/* Markers */}
                    <Marker title="Racar Shopping" top={120} left={180} />
                    <Marker title="Parque De La Luz" top={210} left={280} color={colors.success} />

                    {/* User location */}
                    <View style={[styles.userLocation, { top: 180, left: 200 }]}>
                        <View style={styles.userLocationDot} />
                        <View style={styles.userLocationPulse} />
                    </View>
                </View>
            </ScrollView>

            {/* Legend */}
            <MapLegend visible={showLegend} />

            {/* Map Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setZoom(Math.min(zoom + 0.2, 2))}
                >
                    <Ionicons name="add" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setZoom(Math.max(zoom - 0.2, 0.5))}
                >
                    <Ionicons name="remove" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setZoom(1)}
                >
                    <Ionicons name="locate" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        position: 'absolute',
        top: spacing.md,
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
    },
    mapScrollView: {
        flex: 1,
    },
    mapContent: {
        padding: spacing.xl,
        paddingTop: 80,
    },
    mapCanvas: {
        width: 400,
        height: 500,
        position: 'relative',
    },
    mapBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
    },
    gridLine: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: colors.border,
        opacity: 0.3,
    },
    cityName: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -10 }],
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textTertiary,
        opacity: 0.2,
    },
    street: {
        position: 'absolute',
        backgroundColor: '#BDBDBD',
        opacity: 0.4,
    },
    zone: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 8,
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
    },
    markerPin: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    markerLabel: {
        marginTop: 4,
        backgroundColor: colors.backgroundCard,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: typography.fontSize.xs,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    userLocation: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userLocationDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        borderWidth: 3,
        borderColor: 'white',
        zIndex: 2,
    },
    userLocationPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        opacity: 0.2,
    },
    legend: {
        position: 'absolute',
        top: 80,
        right: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        padding: spacing.md,
        zIndex: 10,
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
        bottom: spacing.xl,
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
    },
});
