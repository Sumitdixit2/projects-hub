import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../types/env.config";
import { pool } from "../../postgress-config";
import { AccessTokenJwtPayload } from "../types/payload.type";
import { userType } from "../controllers/admin/admin.controller";


const fetchUser = async (userId: string, userType: userType) => {

  if (userType === "admin") {
    const response = await pool.query('SELECT id , agency_id , fullname , admin_role , email FROM admin WHERE id = $1 AND NOW() < token_expiry', [userId]);
    return response;
  }

  const response = await pool.query('SELECT id , agency_id , fullname , email FROM client WHERE id = $1 AND NOW() < token_expiry', [userId]);
  return response;
}

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access Denied! No token provided");
  }

  let decodedToken: AccessTokenJwtPayload;
  try {
    decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenJwtPayload;
  } catch (error: any) {

    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }

    throw new ApiError(401, "Invalid access token");
  }

  const userId = decodedToken.sub;

  if (!userId) throw new ApiError(400, "invalid token");

  const userType = decodedToken.user_type;

  const response = await fetchUser(userId, userType);

  if (!response) throw new ApiError(500, "Error while fetching user data");

  if (!response.rowCount) {
    throw new ApiError(401, "Invalid Access Token or token expired");
  }

  const user = response.rows[0];

  console.log("user for jwt is :", user);
  (req as any).user = user;
  (req as any).userType = userType;
  next();
})

