import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { projectType } from '../../types/project.type';

  export const createProject = asyncHandler(async(req,res) => {
  
    const {name , clientId, description , deadline } : projectType = req.body;
    const user = (req as any).user;

    if(!name || !clientId || !description || deadline) throw new ApiError(400 , "Enter all the required fields");

    const check = await pool.query('SELECT EXISTS (SELECT 1 FROM client WHERE id = $1)' , [clientId]); 

    if(!check) throw new ApiError(400 , "no such client found");

    const agency_id = user.agency_id;
    const id = user.id;

    const nameCheck = await pool.query('SELECT EXISTS (SELECT 1 FROM project WHERE name = $1 AND agency_id = $2)',[name,agency_id]); 

    if(!nameCheck.rows[0].exists) throw new ApiError(400 , "another project exists with this email");

    const create = await pool.query('INSERT INTO project (name , description , client_id , admin_id , deadline) VALUES ($1,$2,$3,$4,$5) RETURNING *' , [name , description , clientId ,id,deadline]);

    if(!create.rowCount) throw new ApiError(500 , "Error while creating project");

    return res.json(new ApiResponse(201 , create.rows[0] , "new project created successfully"));

  });
