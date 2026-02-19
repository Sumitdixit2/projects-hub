import api from "@/lib/api";
import { projectStatus, projectType } from "@/types/project.types";

export const projectService = {
  async getAllProjects() {
    try {
      const response = await api.get('/project/getAllProjects');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async createProject(data: projectType) {
    try {
      const response = await api.post('/project/createproject', data);
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


