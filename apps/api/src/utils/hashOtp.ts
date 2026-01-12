import bcrypt from "bcrypt";

export async function hashOtp(otp: string) {
  return await bcrypt.hash(otp, 10);
}
