import api from "./api";

const apiService = {
    getAll: async <T>(endpoint: string): Promise<T> => {
        const response = await api.get<T>(endpoint);
        return response.data
    },

    getById: async <T>(endpoint: string, id: string): Promise<T> => {
        const response = await api.get<T>(`${endpoint}/${id}`)
        return response.data
    },

    create: async <T>(endpoint: string, data: T): Promise<T> => {
        const response = await api.post(endpoint, data);
        return response.data
    },

    createReqRes: async <T extends object | FormData, D>(
        endpoint: string,
        data: T,
        headers?: any
    ): Promise<D> => {
        const config: any = {
            headers: { ...headers }
        };

        if (data instanceof FormData) {
            // Forzamos el Content-Type para multipart/form-data en React Native
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.post<D>(endpoint, data, config);
        return response.data;
    },

    update: async <T>(endpoint: string, id: string, data?: T): Promise<T> => {
        const response = await api.patch<T>(`${endpoint}/${id}`, data);
        return response.data;
    },

    delete: async (endpoint: string, id: string): Promise<void> => {
        await api.delete(`${endpoint}/${id}`);
    },
}

export default apiService