import api from "@/lib/api";
import { projectStatus, projectType } from "@/types/project.types";

export const projectService = {
  async getAllProjects() {
    try {
      const response = await api.get('/project/getAllAgencyProjects');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async getOwnerProjects() {
    try {
      const response = await api.get('/project/getAllOwnerProjects');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async createProject(data: Partial<projectType> | any) {
    try {
      const response = await api.post('/project/createproject', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async updateProject(id: string, data: Partial<projectType> | any) {
    try {
      const response = await api.patch(`/project/updateProject/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async changeStatus(id: string, newStatus: projectStatus) {
    try {
      const response = await api.patch(`/project/changeStatus/${id}`, { newStatus });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async getMyProject(id: string) {
    try {
      const response = await api.get(`/project/getMyProject/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}


