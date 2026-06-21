import api from "@/lib/api";
import { activityInputType, activityOutputType } from "@/types/activity.type";

export const activityService = {
  async getAgencyActivity (data: activityInputType):Promise<any>{
    const {page,limit} = data;
    try {
      const result = await api.get("/activity/getAgencyActivity",{
        params: {page,limit}
      });
      return result.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
  async getMyActivity(data?: activityInputType): Promise<any> {
    const page = data?.page || "1";
    const limit = data?.limit || "10";
    try {
      const result = await api.get("/activity/getActivity/me", {
        params: { page, limit }
      });
      return result.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
