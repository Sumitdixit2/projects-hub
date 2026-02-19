import api from "@/lib/api";

export const clientService = {
    async clientLogin(data: any) {
        try {
            const response = await api.post('/client/login', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}
