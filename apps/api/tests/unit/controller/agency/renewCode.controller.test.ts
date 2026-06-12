import { describe,beforeEach, vi, test, expect } from "vitest";
import { pool } from "../../../../postgress-config";
import { Resend } from "resend";
import { sendOtpToEmail } from "../../../../src/utils/sendOtpToEmail";
import { renewCode } from "../../../../src/controllers/agency/agency.controller";

vi.mock("../../../../postgress-config", () => ({
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

vi.mock("../../../../src/utils/sendOtpToEmail",() => ({
  sendOtpToEmail: vi.fn()
}))

describe("renewCode controller",() => {
  let req:any;
  let res:any;
  let next:any;

  beforeEach(() => {
    req = {
      body: {
        email: "example@gmail.com"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    next = vi.fn()
  });

  test("return 500 if sendOtpToEmail fails", async() => {
    const error = new Error("sendOtpToEmail failed");

    sendOtpToEmail.mockRejectedValue(error);

    await renewCode(req,res,next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "sendOtpToEmail failed" 
      })
    );
  });

  test("return 400 if email missing",async() => {
      req.body.email = "";

      await renewCode(req,res,next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "email is required!"
        })
      );
  });

  test("return 201 with message if otp renewed", async() => {
    sendOtpToEmail.mockResolvedValue(1);

    await renewCode(req,res,next);

    expect(sendOtpToEmail).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 201,
        data: "otp successfully renewed",
        message: "Success"
      })
    )
  })
})
