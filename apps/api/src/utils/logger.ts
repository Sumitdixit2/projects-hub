import { pool } from "../../postgress-config";
import { loggerType } from "../types/logger.type";


export const logger = async(data:loggerType)  => {
    try {
      const {admin_id ,agency_id , action ,action_type, entity_type, entity_id} = data;

      if(!admin_id || !entity_id || !agency_id || !action || !action_type || !entity_type) throw new Error("Missing required fields");

      const res = await pool.query('INSERT INTO activity_log(admin_id ,agency_id, action ,action_type , entity_type , entity_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[admin_id ,agency_id,action,action_type,entity_type,entity_id]); 
      return res.rows[0];
    } catch (error:any) {
      console.error("error while adding the activity log: ",error);
      throw error;
    }
}




