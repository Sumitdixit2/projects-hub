import api from "@/lib/api";
import { agencyRegisterDataType } from "@/types/auth.types";

export const authService = {
  async registerAgency(data: agencyRegisterDataType) {
    try {
      const response = await api.post('/agency/registerAgency', data);
      return response.data;
    } catch (error: any) {
      console.error("ma request fucked up man", error);
    }
  }
}
