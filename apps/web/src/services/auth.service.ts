import api from "@/lib/api";
import { agencyRegisterDataType } from "@/types/auth.types";

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
  }
}

