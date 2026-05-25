import { Resend } from "resend";
import { pool } from "../../postgress-config";
import { hashOtp } from "./hashOtp";
import { generateOtp } from "./otpGenerator";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpToEmail = async (email: string) => {
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const OTP_EXPIRY_MINUTES = 10;
  const codeExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const response = await pool.query('UPDATE agency SET verify_code = $1,code_expiry = $2 WHERE email = $3 RETURNING id,name,email,phone,website,description', [hashedOtp, codeExpiry, email]);
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [`${email}`],
    subject: "verification code for project-hub",
    html: `<strong>${otp}</strong>`,
  });

  return response.rowCount;
}
