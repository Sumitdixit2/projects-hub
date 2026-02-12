import api from "@/lib/api";
import { agencyRegisterDataType } from "@/types/auth.types";

export const authService = {
  async registerAgency(data: agencyRegisterDataType) {
    const response = await api.post('/agency/registerAgency', data);
    return response.data;
  }
}
