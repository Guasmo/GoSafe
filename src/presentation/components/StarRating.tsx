import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    size = 16,
}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <View className="flex-row items-center">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Ionicons key={`full-${i}`} name="star" size={size} color="#FFD700" />
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <Ionicons name="star-half" size={size} color="#FFD700" />
            )}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFD700" />
            ))}
        </View>
    );
};
