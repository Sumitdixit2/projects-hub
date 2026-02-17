import api from "@/lib/api";

export const adminService = {
  async generateClientKey(data: string) {
    try {
      const response = await api.post('/admin/generateClientKey', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
