import bcrypt from "bcrypt";

export function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}
