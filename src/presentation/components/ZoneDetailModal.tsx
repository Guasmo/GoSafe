import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { DangerousZone } from '../../../interfaces/DangerousZone';
import { StarRating } from './StarRating';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface ZoneDetailModalProps {
    visible: boolean;
    zone: DangerousZone | null;
    onClose: () => void;
}

export const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({ visible, zone, onClose }) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });

    const scrollTo = (destination: number) => {
        'worklet';
        translateY.value = withSpring(destination, { damping: 50 });
    };

    useEffect(() => {
        if (visible) {
            scrollTo(0);
        } else {
            scrollTo(SCREEN_HEIGHT);
        }
    }, [visible]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            // Evitar deslizar hacia arriba más allá del límite inicial
            if (translateY.value < 0) translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > SCREEN_HEIGHT / 4) {
                runOnJS(onClose)();
            } else {
                scrollTo(0);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: Math.max(translateY.value, 0) }],
        };
    });

    // Calcular el rating promedio
    const averageRating = useMemo(() => {
        if (!zone || !zone.ratings || zone.ratings.length === 0) return 0;
        const sum = zone.ratings.reduce((acc, r) => acc + r.rating, 0);
        return sum / zone.ratings.length;
    }, [zone]);

    if (!zone) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View className="flex-1 justify-end bg-black/30">
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                    <Animated.View
                        className="bg-[#1A1A1A] rounded-t-3xl h-[70%] shadow-lg absolute bottom-0 w-full"
                        style={rBottomSheetStyle}
                    >
                        {/* Handle Bar - Gesture Only Here */}
                        <GestureDetector gesture={gesture}>
                            <View className="w-full items-center pt-4 pb-2 bg-transparent" hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                                <View className="w-12 h-1.5 bg-gray-600 rounded-full" />
                            </View>
                        </GestureDetector>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute right-4 top-4 z-10 p-2 bg-black/20 rounded-full"
                        >
                            <Ionicons name="close" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        <ScrollView
                            className="flex-1 px-4"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
                            {/* Title */}
                            <Text className="text-2xl font-bold text-white mb-2 mt-2">
                                {zone.title}
                            </Text>

                            {/* Badge and Rating */}
                            <View className="flex-row items-center mb-4 gap-3">
                                <View
                                    className="px-3 py-1 rounded"
                                    style={{ backgroundColor: zone.dangerLevel.color }}
                                >
                                    <Text className="text-black font-bold text-xs">
                                        {zone.dangerLevel.displayName}
                                    </Text>
                                </View>

                                {/* Average Rating */}
                                {zone.ratings && zone.ratings.length > 0 && (
                                    <View className="flex-row items-center gap-2">
                                        <StarRating rating={averageRating} size={18} />
                                        <Text className="text-yellow-400 font-bold text-base">
                                            {averageRating.toFixed(1)}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">
                                            ({zone.ratings.length} {zone.ratings.length === 1 ? 'valoración' : 'valoraciones'})
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Description */}
                            <Text className="text-base text-gray-300 mb-4 leading-5">
                                {zone.description}
                            </Text>

                            {/* Images Slider */}
                            {zone.images && zone.images.length > 0 && (
                                <View className="mb-6">
                                    <Text className="text-lg font-semibold text-white mb-3">
                                        Galería
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {zone.images.map((img, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: img.imageUrl }}
                                                className="w-64 h-48 rounded-xl mr-3 bg-gray-800"
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Comments Section */}
                            {zone.comments && zone.comments.length > 0 ? (
                                <View className="mt-2">
                                    <Text className="text-lg font-semibold text-white mb-3">
                                        Comentarios ({zone.comments.length})
                                    </Text>
                                    {zone.comments.slice(0, 5).map((comment, index) => {
                                        // Find rating for this user
                                        const userRating = zone.ratings?.find(r => r.userId === comment.userId);

                                        return (
                                            <View
                                                key={index}
                                                className="bg-[#2A2A2A] p-4 rounded-xl mb-3"
                                            >
                                                {/* User Info and Rating */}
                                                <View className="flex-row items-center justify-between mb-2">
                                                    <View className="flex-row items-center gap-2">
                                                        {/* Avatar */}
                                                        <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
                                                            <Text className="text-white font-bold text-lg">
                                                                {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </Text>
                                                        </View>
                                                        {/* User Name */}
                                                        <View>
                                                            <Text className="text-white font-semibold text-sm">
                                                                {comment.user?.name || 'Usuario Anónimo'}
                                                            </Text>
                                                            {userRating && (
                                                                <StarRating rating={userRating.rating} size={14} />
                                                            )}
                                                        </View>
                                                    </View>
                                                    {/* Date */}
                                                    <Text className="text-gray-400 text-xs">
                                                        {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </Text>
                                                </View>

                                                {/* Comment */}
                                                <Text className="text-gray-300 text-sm leading-5 mt-2">
                                                    {comment.comment}
                                                </Text>
                                            </View>
                                        );
                                    })}

                                    {zone.comments.length > 5 && (
                                        <Text className="text-gray-400 text-sm text-center mt-2">
                                            +{zone.comments.length - 5} comentarios más
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <View className="bg-[#2A2A2A] p-6 rounded-xl items-center">
                                    <Ionicons name="chatbubble-outline" size={48} color="#4B5563" />
                                    <Text className="text-gray-400 italic mt-3 text-center">
                                        Aún no hay comentarios para este lugar.{'\n'}
                                        ¡Sé el primero en compartir tu experiencia!
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};
