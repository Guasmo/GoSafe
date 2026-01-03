import { UUID } from "@/types/auth";

export interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean }>;
    logout: () => void;
}

export interface AuthResponse {
    userId: UUID;
    accessToken: string;
    refreshToken: string;
}