import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { isProjectStatus } from '../project/project.controller';
import { actionType, entityType, loggerType } from '../../types/logger.type';
import { logger } from '../../utils/logger';


export const createMilestones = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { name, description, due_date, initialStatus } = req.body;
  const user = (req as any).user;

  if (!id) throw new ApiError(400, "id must be provided");
  if (!name?.trim() || !description?.trim() || !due_date?.trim()) throw new ApiError(400, "Enter all the required fields");

  const project = await pool.query('SELECT name FROM project WHERE id = $1)', [id]);
  const projectName = project.rows[0].name;

  if (!project.rowCount) throw new ApiError(404, "Project not found");

  if (initialStatus) {
    const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id , milestone_status) VALUES ($1 , $2 , $3, $4, $5) RETURNING *', [name, description, due_date, id, initialStatus]);

    const data :loggerType = {
      agency_id: user.agency_id,
      admin_id: user.id,
      action: `Milestone ${name} has been created for project ${projectName}`,
      action_type: actionType.CREATE,
      entity_type: entityType.Milestone,
      entity_id: create.rows[0].id
    }

    await logger(data);

    return res.status(201).json(new ApiResponse(201, create.rows[0], "milestone created"));
  } else {
    const create = await pool.query('INSERT INTO milestone (name , description , due_date , project_id) VALUES ($1 , $2 , $3, $4) RETURNING *', [name, description, due_date, id]);

    const data :loggerType = {
      agency_id: user.agency_id,
      admin_id: user.id,
      action: `Milestone ${name} has been created for project ${projectName}`,
      action_type: actionType.CREATE,
      entity_type: entityType.Milestone,
      entity_id: create.rows[0].id
    }
    
    await logger(data);

    return res.status(201).json(new ApiResponse(201, create.rows[0], "milestone created"));

  }

});

export const changeMilestoneStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { newStatus } = req.body;
  const user = (req as any).user;

  if (!id || !newStatus) throw new ApiError(400, "Enter all the required fields");

  if (!isProjectStatus(newStatus)) throw new ApiError(400, "enter a valid status");

  const response = await pool.query('UPDATE milestone SET milestone_status = $1 WHERE id = $2 RETURNING *',[newStatus,id]);
  if(!response.rowCount) throw new ApiError(404, "Milestone not found");

  const data: loggerType = {
    agency_id: user.agency_id,
    admin_id: user.id,
    action: `milestone ${response.rows[0].name} status updated to ${newStatus}`,
    action_type: actionType.UPDATE,
    entity_type: entityType.Milestone,
    entity_id: response.rows[0].id
  }
  
  await logger(data);

  return res.json(new ApiResponse(200,response.rows[0], "milestone status changed successfully"));

});

export const getMyMilestone = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) throw new ApiError(400, "id is required");

  const result = await pool.query('SELECT id, name , due_date ,  milestone_status  FROM milestone WHERE project_id = $1', [id]);

  return res.json(new ApiResponse(200, result.rows, "milestones fetched for the project"));
});

export const getMilestone = asyncHandler(async(req,res) => {

  const {id} = req.params;

  if(!id) throw new ApiError(400, "id is required");

  const result = await pool.query('SELECT name, due_date,created_at , milestone_status, description FROM milestone WHERE id = $1',[id]);

  return res.json(new ApiResponse(200, result.rows[0], "milestone fetched"));
})

export const deleteMilestone = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const user = (req as any).user;

  if (!id) throw new ApiError(400, "id is required");

  const result = await pool.query('DELETE FROM milestone WHERE id = $1 RETURNING *', [id]);
  if(!result.rowCount) throw new ApiError(404, "Milestone not found");

  const data: loggerType = {
    agency_id: user.agency_id,
    admin_id: user.id,
    action: `Milestone ${result.rows[0].name}`,
    action_type: actionType.DELETE,
    entity_type: entityType.Milestone,
    entity_id: result.rows[0].id
  }

  await logger(data);

  return res.status(204).json(new ApiResponse(204, "milestone deleted successfully"))
});
