import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { projectStatus, projectType } from '../../types/project.type';
import { actionType, entityType, loggerType } from '../../types/logger.type';
import { logger } from '../../utils/logger';

export const createProject = asyncHandler(async (req, res) => {

  const { name, clientId, description, deadline, assignedTo, project_status }: projectType = req.body;
  const user = (req as any).user;

  if (!name || !clientId || !description || !deadline || !project_status) throw new ApiError(400, "Enter all the required fields");

  const check = await pool.query('SELECT EXISTS (SELECT 1 FROM client WHERE id = $1)', [clientId]);

  if (!check) throw new ApiError(400, "no such client found");

  const agency_id = user.agency_id;
  const id = assignedTo;
  const nameCheck = await pool.query('SELECT EXISTS (SELECT 1 FROM project WHERE name = $1 AND agency_id = $2)', [name, agency_id]);

  if (nameCheck.rows[0].exists) throw new ApiError(400, "another project exists with this email");

  const create = await pool.query('INSERT INTO project (name , description , client_id , admin_id , deadline,agency_id , project_status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [name, description, clientId, id, deadline, agency_id, project_status]);

  const data: loggerType = {
    agency_id: user.agency_id,
    admin_id: user.id,
    action: `project ${create.rows[0].name} created`,
    action_type: actionType.CREATE,
    entity_type: entityType.Project,
    entity_id: create.rows[0].id
  }

  await logger(data);

  return res.json(new ApiResponse(201, create.rows[0], "new project created successfully"));

});

export const getAllProject = asyncHandler(async (req, res) => {

  const user = (req as any).user;
  const agency_id = user.agency_id;

  const result = await pool.query('SELECT project.id, project.name, project.description, client.name AS client, admin.fullname AS assignedTo, project.project_status, project.deadline FROM project INNER JOIN client ON project.client_id = client.id INNER JOIN admin  ON project.admin_id = admin.id WHERE project.agency_id =$1', [agency_id]);

  return res.json(new ApiResponse(200, result.rows, "fetched all the agencies projects"));

})

export const isProjectStatus = (value: any): value is projectStatus => {
  return Object.values(projectStatus).includes(value as projectStatus);
};

export const changeStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { newStatus } = req.body;
  const user = (req as any).user;

  if (!id || !newStatus) throw new ApiError(400, "id and new Status are required to be provided");

  if (!isProjectStatus(newStatus)) throw new ApiError(400, "Enter a valid status");

  const result = await pool.query('UPDATE project SET project_status = $1 WHERE id = $2 RETURNING *', [newStatus, id]);
  if(!result.rowCount) throw new ApiError(404 , "Project not found");
  
  const data : loggerType = {
    agency_id: user.agency_id,
    admin_id: user.id,
    action: `Project ${result.rows[0].name} status changed to ${result.rows[0].project_status}`,
    action_type: actionType.UPDATE,
    entity_type: entityType.Project,
    entity_id: result.rows[0].id
  }

  await logger(data);

  return res.json(new ApiResponse(200, "project status updated successfully"));

});

export const getMyProject = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) throw new ApiError(400, "id must be provided");

  const find = await pool.query('SELECT project.name , project.description , project.started_at , project.deadline , project.project_status , client.name as client , admin.fullname as assignedto FROM project INNER JOIN client ON project.client_id = client.id INNER JOIN admin ON project.admin_id = admin.id WHERE project.id = $1', [id]);

  if (!find.rowCount) throw new ApiError(404, "project not found");

  return res.json(new ApiResponse(200, find.rows[0], "project successfully fetched from db"));

});

export const deleteProject = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const user = (req as any).user;

  if (!id) throw new ApiError(400, "id must be provided");

  const project = await pool.query('SELECT EXISTS (SELECT 1 FROM project WHERE id = $1)', [id]);

  if (!project.rows[0].exists) throw new ApiError(404, "project not found");

  await pool.query('DELETE FROM milestone WHERE project_id = $1', [id]);
  const result = await pool.query('DELETE FROM project WHERE id = $1 RETURNING *', [id]);

  const data : loggerType = {
    agency_id: user.agency_id,
    admin_id: user.id,
    action: `Project ${result.rows[0].name} has been deleted`,
    action_type: actionType.DELETE,
    entity_type: entityType.Project,
    entity_id: result.rows[0].id
  }

  await logger(data);

  return res.status(204).json(new ApiResponse(204, "project has been deleted successfully"));
});
