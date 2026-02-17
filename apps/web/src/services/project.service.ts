import api from "@/lib/api";

export const projectService = {
  async getAllProjects() {
    try {
      const response = await api.get('/project/getAllProjects');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}


