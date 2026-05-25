import { describe,beforeEach, expect, test, vi } from "vitest";
import { pool } from "../../../../postgress-config";
import { Resend } from "resend";
import bcrypt from "bcrypt"
import { resetPassword } from "../../../../src/controllers/agency/agency.controller";

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
    hash: vi.fn()
  } 
}));


describe("resetPassword controller",() => {
  let req:any;
  let res:any;
  let next:any;

  beforeEach(() => {
    req = {
      body: {
        email: "example@gmail.com",
        newPassword: "123456"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    next = vi.fn()

    vi.clearAllMocks()
  });

  test("return 500 if bcrypt fails",async() => {
    const error = new Error("bcrypt failed");
    bcrypt.hash.mockRejectedValue(error);

    await resetPassword(req,res,next);

    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword , 10);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "bcrypt failed"
      })
    )
  });

  test("return error if update query fails",async() => {
    const error = new Error("query failed")
    pool.query.mockRejectedValue(error);
    bcrypt.hash.mockResolvedValue("hashedPassword");

    await resetPassword(req,res,next);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword,10);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "query failed"
      })
    )
  });

  test("return 400 if email or password missing",async() => {
    req.body.email = "";

    await resetPassword(req,res,next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Email and password both are required!"
      })
    )
  });

  test("password change should be successful", async() => {
    pool.query.mockResolvedValue({
      rows: [{
        id: "1234",
        email: "agency@gmail.com"
      }],
      rowCount : 1
    });

    bcrypt.hash.mockResolvedValue("hashedPassword");

    await resetPassword(req,res,next);

    console.log("next mock call",next.mock.calls);
    console.log(res.json.mock.calls);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword,10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 201,
        message: "password successfully changed"
      })
    )
  })
})
