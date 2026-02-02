import ApiError from "../../utils/apiError";
import asyncHandler from "../../utils/asyncHandler"
import { pool } from "../../../postgress-config";

export const clientLogin = asyncHandler(async (req, res) => {

  const { email, invitekey, fullname, password } = req.body;

  if (!email || !invitekey || !fullname || !password) throw new ApiError(400, "Enter all the required fields");

  const findUser = await pool.query('SELECT EXISTS (SELECT 1 FROM agency WHERE email = $1', [email]);

  if (findUser.rows[0].exists) throw new ApiError(400,)
})
