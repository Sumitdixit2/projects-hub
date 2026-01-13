import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt"
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';

const generateAccessAndRefreshToken = async (userId: string) => {
  const response = await pool.query('SELECT id,name,email FROM agency WHERE id = $1', [userId]);
  const user = response.rows[0];

  if (!user) {
    throw new ApiError(404, "Agency not found");
  }

  const AccessToken = generateAccessToken(user);
  const RefreshToken = generateRefreshToken(user);
  const hashToken = await bcrypt.hash(RefreshToken, 10);

  await pool.query('UPDATE agency SET  refreshtoken = $1 WHERE id = $2 RETURNING *', [hashToken, userId]);


  return { AccessToken, RefreshToken };

}

export const loginAdmin = asyncHandler(async (req, res) => {

  const { fullname, admin_role, agency_password, agency_email, email, inviteKey, password } = req.body;

  if (!fullname || !admin_role) throw new ApiError(400, "Enter all the required fields");

  if (admin_role != 'owner' || admin_role != 'staff' || admin_role != 'developer') throw new ApiError(400, "Enter a valid admin_role")

  if (admin_role === "owner") {
    if (!agency_password || !agency_email) throw new ApiError(400, "agency_password and agency_email are required for this role");

    const agencyId = await pool.query('SELECT id FROM agency WHERE email = $1 AND password = $2', [agency_email, agency_password]);

    if (!agencyId.rowCount) throw new ApiError(404, "agency not found with the email and password provided")

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , agency_password , agency_email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agencyId, fullname, admin_role, agency_password, agency_email]);

    if (!response.rowCount) throw new ApiError(500, "Error , failed to insert admin");

    return res.json(new ApiResponse(201, response.rows[0], "admin created!"))

  }

  if (admin_role === 'staff' || admin_role === 'developer') {

    if (!email || !inviteKey || !password) throw new ApiError(400, "email , password , inviteKey are required");

    const find = await pool.query('SELECT agency_id FROM key WHERE key_hash = $1 AND email = $2)', [inviteKey, email]);

    if (!find.rowCount) throw new ApiError(400, "invalid email or inviteKey");

    const agencyId = find.rows[0].agency_id;

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agencyId, fullname, admin_role, password, email]);

    if (!response.rowCount) throw new ApiError(500, "error while inserting admin");

    return res.json(new ApiResponse(201, response.rows[0], "admin inserted successfully"));
  }
})


