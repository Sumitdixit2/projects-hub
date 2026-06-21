import { expect, vi, beforeEach, describe, test } from "vitest";
import { pool } from "../../../postgress-config";
import { isMyMilestone } from "../../../src/middlewares/isMyMilestone.middleware";

vi.mock("../../../postgress-config", () => ({
  pool: {
    query: vi.fn()
  }
}));

describe("isMyMilestone middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      params: { id: "mile-1" },
      user: {},
      userType: "admin"
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  test("admin: return 404 if milestone not found", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: "Milestone not found"
    }));
  });

  test("admin: return 404 if project not found", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce(null);

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: "project not found"
    }));
  });

  test("admin: return 403 if admin not assigned and not owner", async () => {
    req.user = { id: "user-1", admin_role: "staff" };
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ admin_id: "user-2" }] });

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 403,
      message: "don't have the authority to access this project"
    }));
  });

  test("admin: call next if admin is assigned", async () => {
    req.user = { id: "user-1", admin_role: "staff" };
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ admin_id: "user-1" }] });

    await isMyMilestone(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("client: return 404 if milestone not found", async () => {
    req.userType = "client";
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: "Milestone not found"
    }));
  });

  test("client: return 404 if project not found", async () => {
    req.userType = "client";
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce(null);

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: "project not found"
    }));
  });

  test("client: return 403 if client not assigned", async () => {
    req.userType = "client";
    req.user = { id: "client-1" };
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ client_id: "client-2" }] });

    await isMyMilestone(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 403,
      message: "don't have the access for this project"
    }));
  });

  test("client: call next if client is assigned", async () => {
    req.userType = "client";
    req.user = { id: "client-1" };
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ project_id: "proj-1" }] });
    pool.query.mockResolvedValueOnce({ rows: [{ client_id: "client-1" }] });

    await isMyMilestone(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
