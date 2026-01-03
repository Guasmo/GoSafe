import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    className,
}) => {
    return (
        <TouchableOpacity
            className={`py-4 px-6 rounded-xl items-center justify-center min-h-[56px] ${variant === 'primary' ? 'bg-buttonPrimary' : 'bg-buttonSecondary'
                } ${disabled ? 'bg-buttonDisabled opacity-60' : ''} ${className || ''}`}
            style={style}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
            ) : (
                <Text className="text-textPrimary text-base font-semibold">{title}</Text>
            )}
        </TouchableOpacity>
    );
};

