import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt"
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { createHmac } from 'node:crypto';
import { Request, Response } from "express";

export enum userType {
  admin = "admin",
  client = "client"
}

export enum role {
  owner = "owner",
  staff = "staff",
  developer = "developer"
}

const getUser = async (userId: string, userType: userType) => {
  if (userType === "admin") {
    const response = await pool.query('SELECT id,agency_id,admin_role FROM admin WHERE id = $1', [userId]);
    const user = response.rows[0];
    return user;
  }

  const response = await pool.query('SELECT id,agency_id FROM client WHERE id = $1', [userId]);
  const user = response.rows[0];
  return user;

}

export const generateAccessAndRefreshToken = async (userId: string, userType: userType) => {

  if (userType !== "admin" && userType !== "client") throw new ApiError(400, "Enter a valid userType");

  const user = await getUser(userId, userType);
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const AccessToken = generateAccessToken(user, userType);
  const RefreshToken = generateRefreshToken(user, userType);
  const hashToken = await bcrypt.hash(RefreshToken, 10);
  const refreshTokenExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  );

  if (userType === "admin") {
    const result = await pool.query('UPDATE admin SET refreshtoken = $1 , token_expiry = $2 WHERE id = $3 ', [hashToken, refreshTokenExpiry, userId]);

    if (!result.rowCount) throw new ApiError(500, "error while inserting refreshtoken");
  }

  if (userType === "client") {
    const result = await pool.query('UPDATE client SET refreshtoken = $1 , token_expiry = $2 WHERE id = $3', [hashToken, refreshTokenExpiry, userId]);

    if (!result.rowCount) throw new ApiError(500, "refreshtoken was not inserted");
  }

  return { AccessToken, RefreshToken, user };
}

export const signUp = asyncHandler(async (req, res) => {

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

    const myhashedPassword = await bcrypt.hash(password, 10);

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agency_id, fullname, admin_role, myhashedPassword, email]);

    if (!response.rowCount) throw new ApiError(500, "Error , failed to insert admin");

    const user = response.rows[0];

    return res.json(new ApiResponse(201, user, "admin created successfully"));
  }

  if (admin_role === 'staff' || admin_role === 'developer') {

    if (!email || !inviteKey || !password) throw new ApiError(400, "email , password , inviteKey are required");

    const find = await pool.query('SELECT agency_id FROM key WHERE key_hash = $1 AND email = $2 AND NOW() < key_expiry AND is_used = false AND agency_id = $3', [inviteKey, email, agency_id]);

    if (!find.rowCount) throw new ApiError(400, "invalid email,inviteKey,used key or key expired");

    const agencyId = find.rows[0].agency_id;

    const myhashedPassword = await bcrypt.hash(password, 10);

    const response = await pool.query('INSERT INTO admin(agency_id , fullname , admin_role , password , email) VALUES ($1 , $2 , $3 , $4 ,$5) RETURNING *', [agencyId, fullname, admin_role, myhashedPassword, email]);

    if (!response.rowCount) throw new ApiError(500, "error while inserting admin");

    await pool.query('UPDATE key SET is_used = true WHERE key_hash = $1 AND email = $2 AND NOW() < key_expiry RETURNING *', [inviteKey, email]);

    const user = response.rows[0].id;

    return res.json(new ApiResponse(201, user, "login successful"));
  }
});

export const adminLogin = asyncHandler(async (req, res) => {

  const { password, email, agencyId, admin_role } = req.body;

  if (!password || !email || !agencyId || !admin_role) throw new ApiError(400, "Enter all the required fields");

  const check = await pool.query('SELECT id,fullname,password,admin_role FROM admin WHERE admin_role = $1 AND email = $2 AND agency_id = $3', [admin_role, email, agencyId]);

  if (!check.rowCount) throw new ApiError(404, "no such admin found registered");

  const hashedPassword = check.rows[0].password;

  const verify = await bcrypt.compare(password, hashedPassword);

  if (!verify) throw new ApiError(400, "enter a valid password");

  const id = check.rows[0].id;
  const fullname = check.rows[0].fullname;

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(id, userType.admin);

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options).json(new ApiResponse(200, {id,fullname,admin_role}, "admin logged in successfully"));

});

const SECRET = process.env.INVITE_SECRET!;

const createKey = (email: string, role: string = "Client") => {
  const raw = `${email}:${role}:${Date.now()}`;

  console.log("so is the hash not working?");
  console.log("SECRET IS OF TYPE", typeof SECRET);
  const hash = createHmac("sha256", SECRET)
    .update(raw)
    .digest("base64")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 8);

  console.log("type is : ", typeof hash);
  return `INV-${hash}`;
}


export const createAdminKey = asyncHandler(async (req: Request, res: Response) => {

  const { role, email } = req.body;
  const user = (req as any).user;

  console.log("my user is : ", user);

  if (user.admin_role != 'owner') throw new ApiError(400, "don't have the authroity perform this operation");

  if (!role || !email) throw new ApiError(400, "email and role are required");

  const check = await pool.query('SELECT EXISTS (SELECT 1 FROM key  WHERE email = $1 AND is_used = $2)', [email, false]);

  if (check.rows[0].exists) throw new ApiError(400, "unused invite key already exists for this email");

  const key = createKey(email, role);
  const KEY_EXPIRY_MINUTES = 10;
  const keyExpiry = new Date(Date.now() + KEY_EXPIRY_MINUTES * 60 * 1000);

  const response = await pool.query('INSERT INTO key(key_hash , key_expiry , email , agency_id) VALUES ($1 , $2 ,$3 , $4) RETURNING *', [key, keyExpiry, email, user.agency_id]);

  if (response.rows[0].exits) throw new ApiError(500, "Failed to insert key in the database");
  const result = response.rows[0];

  return res.json(new ApiResponse(201, result, "key generated successfully!"));

});

export const createClientKey = asyncHandler(async (req, res) => {

  const { email } = req.body;
  const user = (req as any).user;

  console.log("my user is : ", user);

  if (!email) throw new ApiError(400, "email is required");

  const check = await pool.query('SELECT EXISTS (SELECT 1 FROM key  WHERE email = $1 AND is_used = $2)', [email, false]);

  if (check.rows[0].exists) throw new ApiError(400, "unused invite key already exists for this email");

  console.log("is code working till this point?");
  const key = createKey(email);
  console.log("key is : ", typeof key);

  const KEY_EXPIRY_MINUTES = 10;
  const keyExpiry = new Date(Date.now() + KEY_EXPIRY_MINUTES * 60 * 1000);

  const response = await pool.query('INSERT INTO key(key_hash , key_expiry , email , agency_id) VALUES ($1 , $2 ,$3 , $4) RETURNING *', [key, keyExpiry, email, user.agency_id]);

  const result = response.rows[0];

  return res.json(new ApiResponse(201, result, "key generated successfully!"));

});

export const getClients = asyncHandler(async (req, res) => {

  const user = (req as any).user;
  const agency_id = user.agency_id;

  const result = await pool.query('SELECT id, name , email FROM client WHERE agency_id = $1', [agency_id]);

  return res.json(new ApiResponse(200, result.rows, "clients fetched successfully"));

})

export const getClient = asyncHandler(async (req, res) => {

  const { clientId } = req.params;

  const result = await pool.query(
    `
  SELECT 
    c.id,
    c.name,
    c.email,
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'project_status', p.project_status,
          'deadline', p.deadline
        )
      ) FILTER (WHERE p.id IS NOT NULL),
      '[]'
    ) AS project
  FROM client c
  LEFT JOIN project p ON c.id = p.client_id
  WHERE c.id = $1
  GROUP BY c.id;
  `,
    [clientId]
  );
  console.log("result is: ", result.rows[0]);

  return res.json(new ApiResponse(200, result.rows[0], "client fetched successfully"));
})

export const getAdmins = asyncHandler(async (req, res) => {

  const user = (req as any).user;
  const agency_id = user.agency_id;

  const result = await pool.query('SELECT id, fullname , admin_role , created_at , email FROM admin WHERE agency_id = $1', [agency_id]);

  if (!result.rowCount) throw new ApiError(404, "no admin found");

  return res.json(new ApiResponse(200, result.rows, "admins fetched"));
});

export const logoutAdmin = asyncHandler(async(req,res) => {

  const {id} = req.params;

  if(!id) throw new ApiError(400, "admin id is required");

  await pool.query('UPDATE admin SET refreshtoken = NULL , token_expiry = NULL WHERE id = $1',[id]);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json(new ApiResponse(200, "admin logged out successfully"));
});

export const deleteClient = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) throw new ApiError(400, "Client id is required");

  await pool.query('DELETE FROM client WHERE id = $1', [id]);

  return res.status(204).json(new ApiResponse(204, "Client deleted successfully"));
})
