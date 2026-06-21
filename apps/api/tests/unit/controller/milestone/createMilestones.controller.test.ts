import { expect, vi, beforeEach, describe, test } from "vitest";
import { pool } from "../../../../postgress-config";
import { logger } from "../../../../src/utils/logger";
import { createMilestones } from "../../../../src/controllers/milestone/milestone.controller";

vi.mock("../../../../postgress-config", () => ({
  pool: {
    query: vi.fn()
  }
}));

vi.mock("../../../../src/utils/logger", () => ({
  logger: vi.fn()
}));

describe("createMilestones controller", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      params: { id: "proj-1" },
      body: {
        name: "Phase 1",
        description: "description",
        due_date: "2026-10-10",
        initialStatus: "planning"
      },
      user: {
        id: "admin-1",
        agency_id: "agency-1"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  test("return 400 if missing id or fields", async () => {
    req.params.id = undefined;

    await expect(createMilestones(req, res, next)).rejects.toMatchObject({
      statusCode: 400,
      message: "id must be provided"
    });

    req.params.id = "proj-1";
    req.body.name = "";

    await expect(createMilestones(req, res, next)).rejects.toMatchObject({
      statusCode: 400,
      message: "Enter all the required fields"
    });
  });

  test("return 404 if project not found", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // check project

    await expect(createMilestones(req, res, next)).rejects.toMatchObject({
      statusCode: 404,
      message: "Project not found"
    });
  });

  test("create milestone with initialStatus and log activity", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ name: "Project Name" }] }); // check project
    
    const newMilestone = { id: "mile-1", name: "Phase 1" };
    pool.query.mockResolvedValueOnce({ rows: [newMilestone] }); // create

    await createMilestones(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO milestone (name , description , due_date , project_id , milestone_status) VALUES ($1 , $2 , $3, $4, $5) RETURNING *',
      [req.body.name, req.body.description, req.body.due_date, req.params.id, req.body.initialStatus]
    );

    expect(logger).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 201,
        message: "milestone created",
        data: newMilestone
      })
    );
  });
});
