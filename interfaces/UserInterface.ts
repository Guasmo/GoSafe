export interface UserInterface {
    id: string;
    email: string;
    password?: string;
    name: string;
    userName: string | null;
    imageUrl: string | null;
    device_token?: string;
    routesCount: number;
    totalKm: number;
    createdAt: string;
    updatedAt: string;
}