import { expect, vi, beforeEach, describe, test } from "vitest";
import { pool } from "../../../../postgress-config";
import { logger } from "../../../../src/utils/logger";
import { createProject } from "../../../../src/controllers/project/project.controller";

vi.mock("../../../../postgress-config", () => ({
  pool: {
    query: vi.fn()
  }
}));

vi.mock("../../../../src/utils/logger", () => ({
  logger: vi.fn()
}));

describe("createProject controller", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Project",
        clientId: "client-1",
        description: "description",
        deadline: "2026-12-31",
        assignedTo: "admin-2",
        project_status: "planning"
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

  test("return 400 if missing fields", async () => {
    req.body.name = "";

    await expect(createProject(req, res, next)).rejects.toMatchObject({
      statusCode: 400,
      message: "Enter all the required fields"
    });
  });

  test("return 400 if client not found", async () => {
    pool.query.mockResolvedValueOnce(null); // check client

    await expect(createProject(req, res, next)).rejects.toMatchObject({
      statusCode: 400,
      message: "no such client found"
    });
  });

  test("return 400 if project name exists for agency", async () => {
    pool.query.mockResolvedValueOnce(true); // check client
    pool.query.mockResolvedValueOnce({ rows: [{ exists: true }] }); // nameCheck

    await expect(createProject(req, res, next)).rejects.toMatchObject({
      statusCode: 400,
      message: "another project exists with this email"
    });
  });

  test("create project and log activity", async () => {
    pool.query.mockResolvedValueOnce(true); // check client
    pool.query.mockResolvedValueOnce({ rows: [{ exists: false }] }); // nameCheck
    
    const newProject = { id: "proj-1", name: "Test Project" };
    pool.query.mockResolvedValueOnce({ rows: [newProject] }); // create

    await createProject(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO project (name , description , client_id , admin_id , deadline,agency_id , project_status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.body.name, req.body.description, req.body.clientId, req.body.assignedTo, req.body.deadline, req.user.agency_id, req.body.project_status]
    );

    expect(logger).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 201,
        message: "new project created successfully",
        data: newProject
      })
    );
  });
});
