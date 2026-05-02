import api from "@/lib/api";
import { activityInputType, activityOutputType } from "@/types/activity.type";

export const activityService = {
  async getAgencyActivity (data: activityInputType):Promise<activityOutputType>{
    const {page,limit} = data;
    try {
      const result = await api.get("/activity/getAgencyActivity",{
        params: {page,limit}
      });
      return result.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
