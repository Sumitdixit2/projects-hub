import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { isProjectStatus } from '../project/project.controller';


export const  createMilestones = asyncHandler(async(req,res) => {

  const {id} = req.params;
  const {name  , description , due_date } = req.body;

  if(!id) throw new ApiError(400 , "id must be provided");
  if(!name || !description || !due_date) throw new ApiError(400 , "Enter all the required fields");

  const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id) VALUES ($1 , $2 , $3, $4) RETURNING *' , [name , description , due_date , id]);

  return res.json(new ApiResponse(201 , create.rows[0] , "milestone created"));

});

export const changeStatus = asyncHandler(async(req,res) => {

  const {id} = req.params;
  const {newStatus} = req.body;

  if(!id || !newStatus) throw new ApiError(400 , "Enter all the required fields");

  if(!isProjectStatus(newStatus)) throw new ApiError(400 , "enter a valid status");

  await pool.query('UPDATE milestone SET milestone_status = $1 WHERE id = $2');

  return res.json(new ApiResponse(200 , "milestone status changed successfully"));

});

export const getMyMilestone = asyncHandler(async(req,res) => {

  const {id} = req.params;

  if(!id) throw new ApiError(400, "id is required");

  const result = await pool.query('SELECT name , due_date , created_at , milestone_status , description FROM milestone WHERE project_id = $1' , [id]);

  if(!result.rowCount) throw new ApiError(404 , "no milestones found");
  
  return res.json(new ApiResponse(200 , result.rows[0] , "milestones fetched for the project"));
});
