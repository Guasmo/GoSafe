export interface Coordinate {
    id: string;
    latitude: string;
    longitude: string;
    orderIndex: number;
    dangerousZoneId: string;
}

export interface DangerLevel {
    id: string;
    name: string;
    displayName: string;
    color: string;
}

export interface DangerousZone {
    id: string;
    title: string;
    description?: string;
    averageRating: number | null;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
    dangerLevelId: string;
    createdById: string;
    dangerLevel: DangerLevel;
    coordinates: Coordinate[];
    images: { id: string; imageUrl: string; caption: string | null; createdAt: string; dangerousZoneId: string }[];
    ratings: {
        id: string;
        rating: number;
        comment?: string;
        createdAt: string;
        userId: string;
        dangerousZoneId: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    }[];
    comments: {
        id: string;
        comment: string;
        createdAt: string;
        userId: string;
        dangerousZoneId: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    }[];
}
