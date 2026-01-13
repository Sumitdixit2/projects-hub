import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt"
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { userInfo } from 'os';

enum userType {
  admin = "admin",
  client = "client"
}

enum role {
  owner = "owner",
  staff = "staff",
  developer = "developer"
}

const generateAccessAndRefreshToken = async (userId: string) => {
  const response = await pool.query('SELECT id,fullname,email FROM admin WHERE id = $1', [userId]);
  const user = response.rows[0];

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const AccessToken = generateAccessToken(user);
  const RefreshToken = generateRefreshToken(user);
  const hashToken = await bcrypt.hash(RefreshToken, 10);

  const result = await pool.query('UPDATE admin SET refreshtoken = $1 WHERE id = $2 ', [hashToken, userId]);

  if (!result.rowCount) throw new ApiError(500, "error while inserting refreshtoken")


  return { AccessToken, RefreshToken, user };

}

export const loginAdmin = asyncHandler(async (req, res) => {

  const { fullname, admin_role, agency_password, agency_email, email, inviteKey, password } = req.body;

  if (!fullname || !admin_role || !email || !password) throw new ApiError(400, "Enter all the required fields");

  if (admin_role != role.owner && admin_role != role.staff && admin_role != role.developer) throw new ApiError(400, "enter a valid admin role")

  if (admin_role === "owner") {
    if (!agency_password || !agency_email) throw new ApiError(400, "agency_password and agency_email are required for this role");

    const agency = await pool.query('SELECT id,password FROM agency WHERE email = $1 ', [agency_email]);

    if (!agency.rowCount) throw new ApiError(404, "agency not found with the email and password provided")

    const agencyId = agency.rows[0].id;
    const hashedPassword = agency.rows[0].password;

    const check = await bcrypt.compare(agency_password, hashedPassword);

    if (!check) throw new ApiError(400, "wrong password");

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agencyId, fullname, admin_role, password, email]);

    if (!response.rowCount) throw new ApiError(500, "Error , failed to insert admin");

    const id = response.rows[0].id;

    const { AccessToken, RefreshToken, user } = await generateAccessAndRefreshToken(id);

    const options = {
      httpOnly: true,
      secure: true
    };

    res.cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options).json(new ApiResponse(201, user, "admin logged in successfully"));

    console.log(res.getHeaders()["set-cookie"]);

  }

  if (admin_role === 'staff' || admin_role === 'developer') {

    if (!email || !inviteKey || !password) throw new ApiError(400, "email , password , inviteKey are required");

    const find = await pool.query('SELECT agency_id FROM key WHERE key_hash = $1 AND email = $2)', [inviteKey, email]);

    if (!find.rowCount) throw new ApiError(400, "invalid email or inviteKey");

    const agencyId = find.rows[0].agency_id;

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agencyId, fullname, admin_role, password, email]);

    if (!response.rowCount) throw new ApiError(500, "error while inserting admin");

    const id = response.rows[0].id;

    const { AccessToken, RefreshToken, user } = await generateAccessAndRefreshToken(id);

    const options = {
      httpOnly: true,
      secure: true
    };

    return res.json(new ApiResponse(201, user, "admin logged in successfully")).cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options);

  }
})


