import { DangerousZone } from "../interfaces/DangerousZone";
import api from "./api";

export const dangerousZoneService = {
    getAll: async (): Promise<DangerousZone[]> => {
        try {
            const response = await api.get<DangerousZone[]>("/dangerouszone");
            return response.data;
        } catch (error) {
            console.error("Error fetching dangerous zones:", error);
            throw error;
        }
    }
};
