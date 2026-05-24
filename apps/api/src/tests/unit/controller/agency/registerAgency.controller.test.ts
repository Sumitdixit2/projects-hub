import { vi } from "vitest";
import { pool } from "../../../../../postgress-config";
import bcrypt from "bcrypt"
import { sendOtpToEmail } from "../../../../controllers/agency/agency.controller";
import { generateOtp } from "../../../../utils/otpGenerator";


vi.mock("../../../../../postgress-config", () => ({
  pool : {
    query: vi.fn()
  }
}));

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn()
      };
    }
  };
});

vi.mock("bcrypt", () => ({
  hash: vi.fn()
}));


vi.mock("../../../../controllers/agency/agency.controller", () => ({

}))
