import { pool } from "../../../postgress-config";
import ApiError from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";

export const getMyActivity = asyncHandler(async(req,res) => {
  const page   = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if(!page || !limit ) throw new ApiError(400 , "page and limit query are required");

  const offset = (page - 1) * limit;
  const id = (req as any).user.id;

  const result = await pool.query('SELECT * FROM activity_log WHERE admin_id = $1 LIMIT $1 OFFSET $2', [id,limit,offset]);

  return res.status(200).json(new ApiResponse(200, result.rows[0], "activity_log fetched"));

})
