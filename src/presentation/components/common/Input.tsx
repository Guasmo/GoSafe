import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    isPassword = false,
    containerClassName,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`mb-4 ${containerClassName || ''}`}>
            {label && <Text className="text-textPrimary text-sm font-medium mb-1">{label}</Text>}
            <View className={`flex-row items-center bg-inputBackground rounded-xl border border-inputBorder px-4 min-h-[56px] ${error ? 'border-danger' : ''}`}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={colors.textSecondary}
                        style={{ marginRight: 8 }}
                    />
                )}
                <TextInput
                    className="flex-1 text-textPrimary text-base"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="p-1"
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text className="text-danger text-xs mt-1">{error}</Text>}
        </View>
    );
};

