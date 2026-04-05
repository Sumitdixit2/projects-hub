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

  async generateAdminKey(data: { email: string; role: "staff" | "developer" }) {
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
  },

  async getClientById(clientId: string) {
    try {
      const response = await api.get(`/admin/getClient/${clientId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async getAllAdmins() {
    try {
      const response = await api.get('/admin/getAllAdmins');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async logout(adminId: string) {
    try {
      const response = await api.get(`/admin/logout/${adminId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
