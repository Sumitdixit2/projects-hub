import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { pool } from '../../../postgress-config';
import ApiError from '../../utils/apiError';
import bcrypt from "bcrypt"
import asyncHandler from '../../utils/asyncHandler';

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

  const { fullname, admin_role, agency_password, agency_email, key } = req.body;


})


