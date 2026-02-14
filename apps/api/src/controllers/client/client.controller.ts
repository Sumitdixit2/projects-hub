import ApiError from "../../utils/apiError";
import asyncHandler from "../../utils/asyncHandler"
import { pool } from "../../../postgress-config";
import { clientTypes } from "../../types/client.type";
import { ApiResponse } from "../../utils/apiResponse";
import bcrypt from "bcrypt";
import { generateAccessAndRefreshToken, userType } from "../admin/admin.controller";

export const clientSignUp = asyncHandler(async (req, res) => {

  const { agency_id, email, inviteKey, name, password }: clientTypes = req.body;

  if (!agency_id || !email || !inviteKey || !name || !password) throw new ApiError(400, "Enter all the required fields");

  const findUser = await pool.query('SELECT EXISTS (SELECT 1 FROM client WHERE email = $1 AND agency_id = $2)', [email, agency_id]);

  if (findUser.rows[0].exists) throw new ApiError(400, "client already exists with this email");

  const checkKey = await pool.query('SELECT EXISTS (SELECT 1 FROM key WHERE key_hash = $1 AND key_expiry > NOW() AND email = $2 AND is_used = $3)', [inviteKey, email, false]);

  if (!checkKey.rows[0].exists) throw new ApiError(400, "key not valid or key expired or key already used or not the correct email");

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query('INSERT INTO client (name , email ,  password , agency_id) VALUES ($1 , $2 , $3 , $4) RETURNING *', [name, email, hashedPassword, agency_id]);

  if (!result.rowCount) throw new ApiError(500, "problem while inserting client");

  await pool.query('UPDATE key SET is_used = $1', [true]);

  return res.json(new ApiResponse(201, result, "client successfully created!"));
});

export const clientLogin = asyncHandler(async (req, res) => {

  const { agency_id, email, password } = req.body;

  if (!agency_id || !email || !password) throw new ApiError(400, "Enter all the required fields");

  const check = await pool.query('SELECT id,password FROM client WHERE agency_id = $1 AND email = $2', [agency_id, email]);

  if (!check.rowCount) throw new ApiError(400, "no such account found with the provided email and agency");

  const hashedPassword = check.rows[0].password;

  const verify = await bcrypt.compare(password, hashedPassword);

  if (!verify) throw new ApiError(400, "invalid password");

  const id = check.rows[0].id;

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(id, userType.client);
  console.log("tokens are : ", AccessToken);

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options).json(new ApiResponse(200, "client logged in successfully"));

});
