import api from "@/lib/api";

export const tokenService = {
    async refreshAccessToken() {
        try {
            const response = await api.post('/token/refreshAccessToken');
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}
