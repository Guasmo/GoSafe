import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface SettingSectionProps {
    title: string;
    children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

interface ToggleSettingProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ icon, label, value, onValueChange }) => (
    <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
            <Ionicons name={icon} size={24} color={colors.textPrimary} />
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.inputBorder, true: colors.primary }}
            thumbColor={colors.textPrimary}
        />
    </View>
);

interface CheckboxSettingProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const CheckboxSetting: React.FC<CheckboxSettingProps> = ({ label, value, onValueChange }) => (
    <TouchableOpacity
        style={styles.checkboxItem}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}
    >
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
            {value && <Ionicons name="checkmark" size={16} color={colors.textPrimary} />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

interface ButtonSettingProps {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

const ButtonSetting: React.FC<ButtonSettingProps> = ({ label, value, icon, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.settingLeft}>
            {icon && <Ionicons name={icon} size={24} color={colors.textPrimary} />}
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{value}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
    </TouchableOpacity>
);

export default function ConfigScreen() {
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [asaltos, setAsaltos] = useState(true);
    const [robos, setRobos] = useState(true);
    const [zonasPocoIluminadas, setZonasPocoIluminadas] = useState(false);
    const [evitarZonasAltoRiesgo, setEvitarZonasAltoRiesgo] = useState(false);
    const [recalcularRuta, setRecalcularRuta] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('Más segura');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Configuraci</Text>
                </View>

                {/* Alertas de Seguridad */}
                <SettingSection title="Alertas de Seguridad">
                    <ToggleSetting
                        icon="notifications"
                        label="Activar alertas"
                        value={alertsEnabled}
                        onValueChange={setAlertsEnabled}
                    />

                    <View style={styles.subsection}>
                        <Text style={styles.subsectionTitle}>Tipos de incidentes a notificar</Text>
                        <CheckboxSetting
                            label="Asaltos"
                            value={asaltos}
                            onValueChange={setAsaltos}
                        />
                        <CheckboxSetting
                            label="Robos"
                            value={robos}
                            onValueChange={setRobos}
                        />
                        <CheckboxSetting
                            label="Zonas poco iluminadas"
                            value={zonasPocoIluminadas}
                            onValueChange={setZonasPocoIluminadas}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.subsectionTitle}>Radio de notificación</Text>
                        <View style={styles.sliderTrack}>
                            <View style={styles.sliderFill} />
                            <View style={styles.sliderThumb} />
                        </View>
                        <Text style={styles.sliderValue}>500m</Text>
                    </View>

                    <ButtonSetting
                        label="Sonido de la notificación"
                        value="Alerta"
                        onPress={() => { }}
                    />
                </SettingSection>

                {/* Preferencias de Ruta */}
                <SettingSection title="Preferencias de Ruta">
                    <ToggleSetting
                        icon="shield-checkmark"
                        label="Evitar zonas de alto riesgo"
                        value={evitarZonasAltoRiesgo}
                        onValueChange={setEvitarZonasAltoRiesgo}
                    />
                    <Text style={styles.settingDescription}>
                        Las rutas generadas evitarán áreas peligrosas.
                    </Text>

                    <View style={styles.subsection}>
                        <Text style={styles.subsectionTitle}>Prioridad de ruta</Text>
                        <View style={styles.routeOptions}>
                            {['Más segura', 'Más corta', 'Equilibrada'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.routeOption,
                                        selectedRoute === option && styles.routeOptionSelected,
                                    ]}
                                    onPress={() => setSelectedRoute(option)}
                                >
                                    <Text
                                        style={[
                                            styles.routeOptionText,
                                            selectedRoute === option && styles.routeOptionTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <ToggleSetting
                        icon="refresh"
                        label="Recalcular ruta automáticamente"
                        value={recalcularRuta}
                        onValueChange={setRecalcularRuta}
                    />
                </SettingSection>

                {/* General */}
                <SettingSection title="General">
                    <ButtonSetting
                        icon="globe"
                        label="Idioma"
                        value="Español"
                        onPress={() => { }}
                    />
                    <ButtonSetting
                        icon="help-circle"
                        label="Ayuda y Soporte"
                        value=""
                        onPress={() => { }}
                    />
                </SettingSection>

                {/* Save Button */}
                <View style={styles.saveButtonContainer}>
                    <Button title="Guardar Cambios" onPress={() => { }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: spacing.xs,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.fontSize.md,
        color: colors.textPrimary,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    settingValue: {
        fontSize: typography.fontSize.md,
        color: colors.primary,
    },
    settingDescription: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
    },
    subsection: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    subsectionTitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.inputBorder,
        marginRight: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkboxLabel: {
        fontSize: typography.fontSize.md,
        color: colors.textPrimary,
    },
    sliderContainer: {
        marginVertical: spacing.md,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: colors.inputBorder,
        borderRadius: 2,
        marginVertical: spacing.sm,
        position: 'relative',
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        left: '50%',
        top: -6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        marginLeft: -8,
    },
    sliderValue: {
        fontSize: typography.fontSize.md,
        color: colors.textPrimary,
        textAlign: 'right',
    },
    routeOptions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    routeOption: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        alignItems: 'center',
    },
    routeOptionSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    routeOptionText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    routeOptionTextSelected: {
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    saveButtonContainer: {
        padding: spacing.md,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
});