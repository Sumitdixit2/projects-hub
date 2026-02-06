import { generateAccessAndRefreshToken, userType } from '../admin/admin.controller';
import jwt from "jsonwebtoken";
import { AccessTokenJwtPayload } from "../../types/payload.type";
import { REFRESH_TOKEN_SECRET } from "../../types/env.config";
import { pool } from '../../../postgress-config';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt";

export const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingToken = req.body.refreshToken || req.cookies.refreshToken;

  if (!incomingToken) throw new ApiError(400, "no token received!");
  console.log('incomingToken : ', incomingToken);

  const decodeToken = jwt.verify(incomingToken, REFRESH_TOKEN_SECRET) as AccessTokenJwtPayload;

  if (!decodeToken) throw new ApiError(400, "token failed to get verified");
  if (!decodeToken.sub) throw new ApiError(500, "id is undefined");

  console.log("id: ", decodeToken.sub);

  const findUser = await pool.query('SELECT refreshtoken FROM admin WHERE id = $1', [decodeToken.sub]);
  console.log("User is : ", findUser.rowCount);

  if (findUser.rowCount === 0) throw new ApiError(400, "No user found for the token being provided");

  const refreshToken = findUser.rows[0].refreshtoken;
  console.log('refresh token is : ', refreshToken);

  const result = await bcrypt.compare(incomingToken, refreshToken);

  if (!result) throw new ApiError(400, "Invalid RefreshToken");

  const { AccessToken, RefreshToken, user } = await generateAccessAndRefreshToken(decodeToken.sub, decodeToken.user_type);

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.cookie("accessToken", AccessToken, options).cookie("refreshToken", RefreshToken, options).json(new ApiResponse(201, user, "token refreshed successfully"));
})


