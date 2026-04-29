import api from "@/lib/api";
import { activityInputType, activityOutputType } from "@/types/activity.type";

export const activityService = {
  async getActivity (data: activityInputType):activityOutputType {
    const {page,limit} = data;
    try {
      const result = await api.get(`/activity/getActivity?page=${page}&limit=${limit}`);
      return result.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
