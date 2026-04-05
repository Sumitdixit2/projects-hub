import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { isProjectStatus } from '../project/project.controller';


export const createMilestones = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { name, description, due_date, initialStatus } = req.body;

  if (!id) throw new ApiError(400, "id must be provided");
  if (!name?.trim() || !description?.trim() || !due_date?.trim()) throw new ApiError(400, "Enter all the required fields");

  const project = await pool.query('SELECT EXISTS (SELECT 1 FROM project WHERE id = $1)', [id]);

  if (!project.rows[0].exists) throw new ApiError(404, "Project not found");

  if (initialStatus) {
    const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id , milestone_status) VALUES ($1 , $2 , $3, $4, $5) RETURNING *', [name, description, due_date, id, initialStatus]);

    return res.status(201).json(new ApiResponse(201, create.rows[0], "milestone created"));
  } else {
    const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id) VALUES ($1 , $2 , $3, $4) RETURNING *', [name, description, due_date, id]);

    return res.status(201).json(new ApiResponse(201, create.rows[0], "milestone created"));
  }

});

export const changeStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { newStatus } = req.body;

  if (!id || !newStatus) throw new ApiError(400, "Enter all the required fields");

  if (!isProjectStatus(newStatus)) throw new ApiError(400, "enter a valid status");

  await pool.query('UPDATE milestone SET milestone_status = $1 WHERE id = $2');

  return res.json(new ApiResponse(200, "milestone status changed successfully"));

});

export const getMyMilestone = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) throw new ApiError(400, "id is required");

  const result = await pool.query('SELECT id, name , due_date , created_at , milestone_status , description FROM milestone WHERE project_id = $1', [id]);

  return res.json(new ApiResponse(200, result.rows, "milestones fetched for the project"));
});

export const deleteMilestone = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) throw new ApiError(400, "id is required");

  await pool.query('DELETE FROM milestone WHERE id = $1', [id]);

  return res.status(204).json(new ApiResponse(204, "milestone deleted successfully"))
})
