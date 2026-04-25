import { pool } from "../../postgress-config";
import { loggerType } from "../types/logger.type";


export const logger = async(admin_id , action , entity_type , entity_id ): loggerType => {
    try {
      const res = await pool.query('INSERT INTO activity_log(admin_id, action , entity_type , entity_id) VALUES ($1,$2,$3,$4)',[admin_id,action,entity_type,entity_id]); 
      return res.rows[0];
    } catch (error:any) {
      console.error("error while adding the activity log");
    }
}

const check = () => {

  const lol = async() => {
const success = await logger("424931c4-6065-4739-8416-0f6c1bc1c7f2","Project Created", "Project","bc807895-713b-4aa9-90eb-396ac33c4aae");
return success;
  }


}

check();

