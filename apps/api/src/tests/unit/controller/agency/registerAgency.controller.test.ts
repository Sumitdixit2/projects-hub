import { expect, vi,beforeEach,describe,test } from "vitest";
import { pool } from "../../../../../postgress-config";
import bcrypt from "bcrypt"
import { registerAgency } from "../../../../controllers/agency/agency.controller";
import { generateOtp } from "../../../../utils/otpGenerator";
import { hashOtp } from "../../../../utils/hashOtp";
import { sendOtpToEmail } from "../../../../utils/sendOtpToEmail";


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
  default: {
    hash: vi.fn()
  } 
}));

vi.mock("../../../../utils/otpGenerator",() => ({
  generateOtp: vi.fn()
}));


vi.mock("../../../../utils/hashOtp",() => ({
  hashOtp: vi.fn()
}));

vi.mock("../../../../utils/sendOtpToEmail",() => ({
  sendOtpToEmail: vi.fn()
}))


describe("registerAgency controller",() => {
  let req:any;
  let res:any;
  let next:any;

  beforeEach(() => {
    req = {
      body: {
        name: "sumit",
        email: "sumitexample@gmail.com",
        password: "12345678",
        phone: "99999999",
        website: "timus.co.in",
        description: "an example agency"
      }
          };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn()
  });

  test("Error if wrong/missing credentials", async() => {
    req.body.name = "";

    await registerAgency(req,res,next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Enter all the required fields"
          })
        );

    expect(pool.query).not.toHaveBeenCalled();
    req.body.name = "sumit"

  })

  test("return 409 if agency already exists",async() => {
    pool.query.mockResolvedValue({
      rows: [
        {
          exists: true
        }
      ]
    });

    await registerAgency(req,res,next);

    expect(pool.query).toHaveBeenCalledWith('SELECT EXISTS (SELECT 1 FROM agency WHERE email = $1)',[req.body.email]);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: "agency already exists"
        })
      );
  });

  test("should register agency", async() => {
    const result = {
      id: "123",
      name: "sumit",
      email: "example@gmail.com",
      phone: "99999999",
      website: "timus.co.in",
      description: "dasdagag"
    };

    pool.query.mockResolvedValue({
      rows: [
        {
          exists: false
        }
      ]
    });

    const hashedPassword = "hashedPassword123"
    bcrypt.hash.mockResolvedValue(hashedPassword);

    sendOtpToEmail.mockResolvedValue(result);

    await registerAgency(req,res);

    expect(pool.query).toHaveBeenCalledWith('SELECT EXISTS (SELECT 1 FROM agency WHERE email = $1)', [req.body.email]);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password , 10);
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO agency (name , email , password , phone , website , description ) VALUES ($1,$2,$3,$4,$5,$6)', [req.body.name, req.body.email, hashedPassword, req.body.phone, req.body.website, req.body.description]);
    expect(sendOtpToEmail).toHaveBeenCalledWith(req.body.email);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 201,
        message: "agency created successfully",
        data: result
        })
  )
  });
})
  
