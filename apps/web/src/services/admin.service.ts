import api from "@/lib/api";

export const adminService = {
  async generateClientKey(data: { email: string }) {
    try {
      const response = await api.post('/admin/generateClientKey', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async generateAdminKey(data: { email: string; role: string }) {
    try {
      const response = await api.post('/admin/generateAdminKey', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async getAllClients() {
    try {
      const response = await api.get('/admin/getAllClients');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
