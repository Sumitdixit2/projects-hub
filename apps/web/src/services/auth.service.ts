import api from "@/lib/api";
import { adminLoginDataType, agencyRegisterDataType, clientRegisterDataType, memberRegisterDataType, ownerRegisterDataType } from "@/types/auth.types";
import { toast } from "sonner";

export const authService = {
  async registerAgency(data: agencyRegisterDataType) {
    try {
      const response = await api.post('/agency/registerAgency', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async verifyAgency(data: { email: string; Code: string }) {
    try {
      const response = await api.post('/agency/verify-code', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async getAgency() {
    try {
      const response = await api.get('/agency/get-agency');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async adminLogin(credentials: adminLoginDataType) {
    const { email, password, agencyId, admin_role } = credentials;

    const response = await api.post('admin/login', {
      email,
      password,
      agencyId,
      admin_role
    });

    return response.data;
  },

  async registerClient(data: clientRegisterDataType) {
    try {
      const response = await api.post('/client/signup', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async registerAdmin(data: ownerRegisterDataType | memberRegisterDataType) {
    try {
      const response = await api.post('/admin/signup', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async clientLogin(data: { email: string; password: string; agency_id: string }) {
    try {
      const response = await api.post('/client/login', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

