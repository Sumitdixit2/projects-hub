import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';


export const  createMilestones = asyncHandler(async(req,res) => {

  const {id} = req.params;
  const {name  , description , due_date } = req.body;

  if(!id) throw new ApiError(400 , "id must be provided");
  if(!name || !description || !due_date) throw new ApiError(400 , "Enter all the required fields");

  const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id) VALUES ($1 , $2 , $3, $4) RETURNING *' , [name , description , due_date , id]);

  return res.json(new ApiResponse(201 , create.rows[0] , "milestone created"));

})
