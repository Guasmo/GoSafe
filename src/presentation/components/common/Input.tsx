import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    isPassword = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={colors.textSecondary}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: spacing.md,
        minHeight: 56,
    },
    inputError: {
        borderColor: colors.danger,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.fontSize.md,
    },
    eyeIcon: {
        padding: spacing.xs,
    },
    errorText: {
        color: colors.danger,
        fontSize: typography.fontSize.xs,
        marginTop: spacing.xs,
    },
});
