import { pool } from "../../postgress-config";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler"

export const isMyProject = asyncHandler(async(req,res , next) => {

  const user = (req as any).user;
  const {id} = req.params;

  const isAssigned = await pool.query('SELECT admin_id FROM project WHERE id = $1',[id]);
  const admin_id = isAssigned.rows[0].admin_id;

  if(admin_id !== user.id && user.admin_role !== "owner") throw new ApiError(403 , "don't have the authority to access this project"); 

  (req as any).user = user;
  next();
})
