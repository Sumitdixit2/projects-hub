import { pool } from "../../../postgress-config";
import ApiError from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";

export const getMyActivity = asyncHandler(async(req,res) => {
  const page   = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  if(!page || !limit ) throw new ApiError(400 , "page and limit query are required");

  const offset = (page - 1) * limit;
  const id = (req as any).user.id;

  const result = await pool.query('SELECT * FROM activity_log WHERE admin_id = $1 LIMIT $2 OFFSET $3', [id,limit,offset]);

  return res.status(200).json(new ApiResponse(200, result.rows, "activity_log fetched"));

});

export const getAdminActivity = asyncHandler(async(req,res) => {

  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const id = req.params.id;

  if(!page || !limit || !id) throw new ApiError(400, "page,adminId and limit are required");
  
  const offset = (page - 1) * limit;

  const result = await pool.query('SELECT * FROM activity_log WHERE admin_id = $1 LIMIT $2 OFFSET $3',[id,limit,offset]);

  return res.status(200).json(new ApiResponse(200, result.rows, "activity_log log fetched"));
  
})
