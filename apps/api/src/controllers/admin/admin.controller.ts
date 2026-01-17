import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt"
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import crypto from "crypto";
import { agency } from '../../types/agency.type';

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
  const response = await pool.query('SELECT id,fullname,email,agency_id,admin_role FROM admin WHERE id = $1', [userId]);
  const user = response.rows[0];

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const AccessToken = generateAccessToken(user);
  const RefreshToken = generateRefreshToken(user);
  const hashToken = await bcrypt.hash(RefreshToken, 10);
  const refreshTokenExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  );

  const result = await pool.query('UPDATE admin SET refreshtoken = $1 , token_expiry = $2 WHERE id = $3 ', [hashToken, refreshTokenExpiry, userId]);

  if (!result.rowCount) throw new ApiError(500, "error while inserting refreshtoken")


  return { AccessToken, RefreshToken, user };

}

export const loginAdmin = asyncHandler(async (req, res) => {

  const { agency_id, fullname, admin_role, agency_password, agency_email, email, inviteKey, password } = req.body;

  if (!agency_id || !fullname || !admin_role || !email || !password) throw new ApiError(400, "Enter all the required fields");

  if (admin_role != role.owner && admin_role != role.staff && admin_role != role.developer) throw new ApiError(400, "enter a valid admin role")

  if (admin_role === "owner") {
    if (!agency_password || !agency_email) throw new ApiError(400, "agency_password and agency_email are required for this role");

    const agency = await pool.query('SELECT password,is_verified FROM agency WHERE email = $1  AND id = $2', [agency_email, agency_id]);

    if (!agency.rowCount) throw new ApiError(404, "agency not found with the email and agency_id");

    if (!agency.rows[0].is_verified) throw new ApiError(400, "agency is not verified , can't login")

    const hashedPassword = agency.rows[0].password;

    const find = await pool.query('SELECT EXISTS (SELECT 1 FROM admin WHERE agency_id = $1 AND email = $2)', [agency_id, email]);

    if (find.rows[0].exists) throw new ApiError(409, "admin already exists with the email");

    const check = await bcrypt.compare(agency_password, hashedPassword);

    if (!check) throw new ApiError(400, "wrong password");

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agency_id, fullname, admin_role, password, email]);

    if (!response.rowCount) throw new ApiError(500, "Error , failed to insert admin");

    const id = response.rows[0].id;

    const { AccessToken, RefreshToken, user } = await generateAccessAndRefreshToken(id);

    const options = {
      httpOnly: true,
      secure: true
    };

    return res.cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options).json(new ApiResponse(201, user, "admin logged in successfully"));
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
});

const createKey = (email: string, role: string) => {

  const key = crypto
    .createHash("sha256")
    .update(email + ":" + role + ":" + Date.now())
    .digest("hex");


  return key;
}

export const createAdminKey = asyncHandler(async (req, res) => {

  const fish = req as any;
  console.log("req is : ", fish.user);

  const user = fish.user;
  const { role, email } = req.body;

  if (user.admin_role != 'owner') throw new ApiError(400, "don't have the authroity perform this operation");

  if (!role || !email) throw new ApiError(400, "email and role are required");

  if (role != 'staff' && role != 'developer') throw new ApiError(400, "enter a  valid admin role");

  const key = createKey(email, role);
  const KEY_EXPIRY_MINUTES = 10;
  const keyExpiry = new Date(Date.now() + KEY_EXPIRY_MINUTES * 60 * 1000);

  const response = await pool.query('INSERT INTO key(key_hash , key_expiry , email , agency_id) VALUES ($1 , $2 ,$3 , $4) RETURNING *', [key, keyExpiry, email, user.agency_id]);
  const result = response.rows[0];

  return res.json(new ApiResponse(201, result, "key generated successfully!"));

});

