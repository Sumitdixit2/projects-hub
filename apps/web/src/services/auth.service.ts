import api from "@/lib/api";
import { agencyRegisterDataType, clientRegisterDataType, memberRegisterDataType, ownerRegisterDataType } from "@/types/auth.types";
import { toast } from "sonner";

export const authService = {
  async registerAgency(data: agencyRegisterDataType) {
    try {
      const response = await api.post('/agency/registerAgency', data);
      return response.data;
    } catch (error: any) {
      console.error("ma agency registeration request donked up man", error);
    }
  },

  async verifyAgency(data: { email: string; Code: string }) {
    try {
      const response = await api.post('/agency/verify-code', data);
      return response.data;
    } catch (error: any) {
      console.error("code verification failed", error);
    }
  },

  async getAgency() {
    try {
      const response = await api.get('/agency/get-agency');
      return response.data;
    } catch (error: any) {
      console.error("failed to fetch agencies", error);
    }
  },

  async registerClient(data: clientRegisterDataType) {
    try {
      const response = await api.post('/client/signup', data);
      return response.data;
    } catch (error: any) {
      console.error("failed to register client", error);
    }
  },

  async registerAdmin(data: ownerRegisterDataType | memberRegisterDataType) {
    try {
      const response = await api.post('/admin/signup', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

