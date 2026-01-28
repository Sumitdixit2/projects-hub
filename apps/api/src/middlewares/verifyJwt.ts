import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../types/env.config";
import { pool } from "../../postgress-config";
import { agency } from "../types/agency.type";
import { AccessTokenJwtPayload } from "../types/payload.type";
import {SendUser} from "../types/user.type";
 

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access Denied! No token provided");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenJwtPayload;
    console.log("decodedToken: ",decodedToken);
    const userId = decodedToken.id;
    console.log("user id: ",userId);

    const response = await pool.query('SELECT id , agency_id , fullname , admin_role , email FROM admin WHERE id = $1 AND NOW() < token_expiry', [userId]);

    if (!response.rowCount) {
      throw new ApiError(401, "Invalid Access Token or token expired");
    }

    console.log("incoming response is :",response);

    const user = response.rows[0];

    console.log("user for jwt is :", user);
    (req as any).user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
})

