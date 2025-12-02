import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
                disabled && styles.buttonDisabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    buttonPrimary: {
        backgroundColor: colors.buttonPrimary,
    },
    buttonSecondary: {
        backgroundColor: colors.buttonSecondary,
    },
    buttonDisabled: {
        backgroundColor: colors.buttonDisabled,
        opacity: 0.6,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
});
