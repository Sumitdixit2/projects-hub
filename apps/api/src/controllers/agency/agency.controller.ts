import { pool } from '../../../postgress-config';
import { Request, Response, NextFunction } from "express"
import ApiError from '../../utils/apiError';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';


const generateAccessAndRefreshToken = async (userId: string) => {
  const response = await pool.query('SELECT id,name,email FROM agency WHERE id = $1', [userId]);
  const user = response.rows[0];

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const AccessToken = generateAccessToken(user);
  const RefreshToken = generateRefreshToken(user);

  await pool.query('UPDATE agency SET  refreshtoken = $1 WHERE id = $2 RETURNING *', [RefreshToken, userId]);


  return { AccessToken, RefreshToken };

}

export const registerAgency = asyncHandler(async (req, res) => {
  const { name, email, password, phone, website, description } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(403, "Enter all the required fields");
  }

  const find = await pool.query('SELECT EXISTS (SELECT 1 FROM agency WHERE email = $1)', [email]);

  if (find.rows[0].exists) {
    throw new ApiError(402, "agency already exists");
  }

  const response = await pool.query('INSERT INTO agency (name , email , password , phone , website , description ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, email, password, phone, website, description])
  const add_agency = response.rows[0]

  console.log("I AM A RETARD!")

  if (!add_agency) {

    throw new ApiError(500, "Error While adding agency");

  }

  return res.json(new ApiResponse(201, add_agency, "agency created successfully"));


});



