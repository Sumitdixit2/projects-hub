import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { projectStatus, projectType } from '../../types/project.type';

export const createProject = asyncHandler(async (req, res) => {

  const { name, clientId, description, deadline , assignedTo }: projectType = req.body;
  const user = (req as any).user;

  if (!name || !clientId || !description || !deadline) throw new ApiError(400, "Enter all the required fields");

  const check = await pool.query('SELECT EXISTS (SELECT 1 FROM client WHERE id = $1)', [clientId]);

  if (!check) throw new ApiError(400, "no such client found");

  const agency_id = user.agency_id;
  const id = assignedTo;
  const nameCheck = await pool.query('SELECT EXISTS (SELECT 1 FROM project WHERE name = $1 AND agency_id = $2)', [name, agency_id]);

  if (nameCheck.rows[0].exists) throw new ApiError(400, "another project exists with this email");

  const create = await pool.query('INSERT INTO project (name , description , client_id , admin_id , deadline,agency_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, description, clientId, id, deadline, agency_id]);

  if (!create.rowCount) throw new ApiError(500, "Error while creating project");

  return res.json(new ApiResponse(201, create.rows[0], "new project created successfully"));

});

export const getAllProject = asyncHandler(async (req, res) => {

  const user = (req as any).user;
  const agency_id = user.agency_id;

  const result = await pool.query('SELECT admin_id , id, name , description , client_id , deadline , project_status FROM project WHERE agency_id = $1', [agency_id]);

  return res.json(new ApiResponse(200 , result.rows[0] , "fetched all the agencies projects"));

})

export const isProjectStatus = (value: any): value is projectStatus => {
  return Object.values(projectStatus).includes(value as projectStatus);
};

export const changeStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { newStatus } = req.body;

  if(!id || !newStatus) throw new ApiError(400 , "id and new Status are required to be provided");

  if (!isProjectStatus(newStatus)) throw new ApiError(400, "Enter a valid status");

   await pool.query('UPDATE project SET project_status = $1 WHERE id = $2', [newStatus, id]);

  return res.json(new ApiResponse(200, "project status updated successfully"));

});

 export const getMyProject = asyncHandler(async(req,res) => {

  const {id} = req.params;

  if(!id) throw new ApiError(400 , "id must be provided");

  const find = await pool.query('SELECT * FROM project WHERE id = $1',[id]);

  if(!find.rowCount) throw new ApiError(404 , "project not found");

  return res.json(new ApiResponse(200 , find.rows[0] , "project successfully fetched from db"));

});


