import { expect, vi, beforeEach, describe, test } from "vitest";
import { pool } from "../../../postgress-config";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../../../src/middlewares/verifyJwt";

vi.mock("../../../postgress-config", () => ({
  pool: {
    query: vi.fn()
  }
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn()
  }
}));

vi.mock("../../../src/types/env.config", () => ({
  ACCESS_TOKEN_SECRET: "testsecret"
}));

describe("verifyJwt middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      header: vi.fn(),
      cookies: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  test("return 401 if no token provided", async () => {
    req.header.mockReturnValue(undefined);

    await expect(verifyJWT(req, res, next)).rejects.toMatchObject({
      statusCode: 401,
      message: "Access Denied! No token provided"
    });
  });

  test("return 401 if token expired", async () => {
    req.header.mockReturnValue("Bearer expiredToken");
    const error = new Error("TokenExpiredError");
    error.name = "TokenExpiredError";
    (jwt.verify as any).mockImplementation(() => {
      throw error;
    });

    await expect(verifyJWT(req, res, next)).rejects.toMatchObject({
      statusCode: 401,
      message: "Access token expired"
    });
  });

  test("return 401 if DB user token expired or user not found", async () => {
    req.header.mockReturnValue("Bearer validToken");
    (jwt.verify as any).mockReturnValue({ sub: "123", user_type: "admin" });
    
    pool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(verifyJWT(req, res, next)).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid Access Token or token expired"
    });
  });

  test("call next() if token and user are valid", async () => {
    req.header.mockReturnValue("Bearer validToken");
    (jwt.verify as any).mockReturnValue({ sub: "123", user_type: "admin" });
    
    const mockUser = { id: "123", admin_role: "owner" };
    pool.query.mockResolvedValue({ rowCount: 1, rows: [mockUser] });

    await verifyJWT(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id , agency_id , fullname , admin_role , email FROM admin WHERE id = $1 AND NOW() < token_expiry',
      ['123']
    );
    expect(req.user).toEqual(mockUser);
    expect(req.userType).toBe("admin");
    expect(next).toHaveBeenCalled();
  });
});
