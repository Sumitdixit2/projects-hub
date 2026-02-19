import api from "@/lib/api";
import { MilestoneType, MilestoneStatus } from "@/types/milestone.types";

export const milestoneService = {
    async createMilestone(projectId: string, data: MilestoneType) {
        try {
            const response = await api.post(`/milestone/createMilestone/${projectId}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    async changeMilestoneStatus(milestoneId: string, newStatus: MilestoneStatus) {
        try {
            const response = await api.patch(`/milestone/changeMilestoneStatus/${milestoneId}`, { newStatus });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    async getMilestones(projectId: string) {
        try {
            const response = await api.get(`/milestone/getMilestones/${projectId}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}
