import api from "@/lib/api";

export const agencyService = {
    async renewCode(data: { email: string }) {
        try {
            const response = await api.post('/agency/renew-code', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    async resetPassword(data: { email: string }) {
        try {
            const response = await api.post('/agency/reset-password', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}
