import { pool } from '../../../postgress-config';
import bcrypt from "bcrypt"
import ApiError from '../../utils/apiError';
import asyncHandler from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { Resend } from "resend";
import { generateOtp } from '../../utils/otpGenerator';
import { hashOtp } from '../../utils/hashOtp';
import { sendOtpToEmail } from '../../utils/sendOtpToEmail';



export const getAgencies = asyncHandler(async (req, res) => {

  const response = await pool.query("SELECT name , id FROM agency WHERE is_verified = true");

  let result = [];
  result = response.rows;
  return res.status(200).json(new ApiResponse(200, result, "fetched all agencies name and id"))

});


type registerType = {
  name: string | null;
  email: string | null;
  password: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
}

export const registerAgency = asyncHandler(async (req, res) => {
  const { name, email, password, phone, website, description }: registerType = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Enter all the required fields");
  }

  const find = await pool.query('SELECT EXISTS (SELECT 1 FROM agency WHERE email = $1)', [email]);
  if (find.rows[0].exists) {
    throw new ApiError(409, "agency already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query('INSERT INTO agency (name , email , password , phone , website , description ) VALUES ($1,$2,$3,$4,$5,$6)', [name, email, hashedPassword, phone, website, description])

  const result = await sendOtpToEmail(email);

  res.json(new ApiResponse(201, result, "agency created successfully"));

});

export const verifyCode = asyncHandler(async (req, res) => {
  const { Code, email } = req.body;


  if (!Code || !email) {
    throw new ApiError(400, "Code and email and are both required!")
  }

  const response = await pool.query('SELECT verify_code,is_verified FROM agency WHERE email = $1 AND code_expiry > NOW()', [email]);

  if (!response.rowCount) throw new ApiError(400, "OTP expired or email not found")

  if (response.rows[0].is_verified) throw new ApiError(400, "Agency already verified");

  const hashedOtp = response.rows[0].verify_code;

  const match = await bcrypt.compare(Code, hashedOtp);

  if (!match) {
    throw new ApiError(400, "invalid OTP");
  }
  const is_verified = true;
  await pool.query('UPDATE agency SET is_verified = $1 WHERE email = $2 ', [is_verified, email])

  return res.json(new ApiResponse(200, match, "verified successfully!"));
})

export const renewCode = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email) throw new ApiError(400, "email is required!")

  const response = await sendOtpToEmail(email);

  if (!response) throw new ApiError(500, "error while generating and sending OTP")

  return res.json(new ApiResponse(201, "otp successfully renewed"))
});

export const resetPassword = asyncHandler(async (req, res) => {

  const { email, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);


  if (!email || !newPassword) throw new ApiError(400, "Email and password both are required!");

  const response = await pool.query('UPDATE agency SET password = $1 WHERE email = $2', [hashedPassword, email])

  if (!response.rowCount) throw new ApiError(500, "password reset failed");

  return res.json(new ApiResponse(201, response.rows[0], "password successfully changed"))

})


