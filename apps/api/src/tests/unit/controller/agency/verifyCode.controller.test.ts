import { expect, vi,test,beforeEach,describe } from "vitest";
import { pool } from "../../../../../postgress-config";
import { Resend } from "resend";
import bcrypt, { compare } from "bcrypt"
import { verifyCode } from "../../../../controllers/agency/agency.controller";

vi.mock("../../../../../postgress-config", () => ({
  pool: {
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
  default: {
    compare: vi.fn()
  } 
}));

describe("verifyCode controller",() => {
  let req:any;
  let res:any;
  let next:any;

  beforeEach(() => {
    req = {
      body: {
        Code: "1234",
        email: "example@gmail.com"
      }
    }
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    next = vi.fn()
  }
  );

  test("return 400 if missing values", async() => {
    req.body.Code = null;
  
    await verifyCode(req,res,next);

    expect(pool.query).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Code and email and are both required!"
      })
    );

  });

  test("return 400 if email not found or code expired",async() => {
    pool.query.mockResolvedValue({
        rowCount: 0
    });

    await verifyCode(req,res,next);

    expect(pool.query).toHaveBeenCalledWith('SELECT verify_code,is_verified FROM agency WHERE email = $1 AND code_expiry > NOW()', [req.body.email]);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "OTP expired or email not found"
      })
    );

  });

  test("return 400 if agency already verified", async() => {
    pool.query.mockResolvedValue({
      rowCount: 1,
      rows : [
        {
          is_verified : true 
        }
      ]
    });

    await verifyCode(req,res,next);

    expect(pool.query).toHaveBeenCalledWith('SELECT verify_code,is_verified FROM agency WHERE email = $1 AND code_expiry > NOW()', [req.body.email]);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Agency already verified"
      })
    )
  });

  test("return 400 if wrong OTP",async() => {
    const data = {
      rowCount: 1,
      rows: [
        {
          is_verified: false,
          verify_code: "123476"
        }
      ]
    }
    const hashedCode = "fafhjahdsfdaf";
    pool.query.mockResolvedValue(data);

    bcrypt.compare.mockResolvedValue(false);

    await verifyCode(req,res,next);

    expect(pool.query).toHaveBeenCalledWith('SELECT verify_code,is_verified FROM agency WHERE email = $1 AND code_expiry > NOW()', [req.body.email]);
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.Code,data.rows[0].verify_code);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "invalid OTP"
      })
    );
  });

  test("return 200 with data if successful verification",async() => {
    const data = {
      rowCount: 1,
      rows: [
        {
          is_verified: false,
          verify_code: "1234"
        }
      ]
    };

    const match = true;

    pool.query.mockResolvedValue(data);
    bcrypt.compare.mockResolvedValue(match);

    await verifyCode(req,res,next);

    expect(pool.query).toHaveBeenCalledWith('SELECT verify_code,is_verified FROM agency WHERE email = $1 AND code_expiry > NOW()', [req.body.email]);
    expect(pool.query).toHaveBeenCalledWith('UPDATE agency SET is_verified = $1 WHERE email = $2 ', [match, req.body.email])
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.Code,data.rows[0].verify_code);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "verified successfully!",
        data: match
      })
    )
  })
});
