import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../../../src/app";
import { pool } from "../../../../postgress-config";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../../../src/types/env.config";

describe("POST /api/v1/project/createproject Workflow", () => {

  beforeEach(async () => {
    await pool.query('DELETE FROM activity_log');
    await pool.query('DELETE FROM milestone');
    await pool.query('DELETE FROM project');
    await pool.query('DELETE FROM admin');
    await pool.query('DELETE FROM client');
    await pool.query('DELETE FROM key');
    await pool.query('DELETE FROM agency');

    await pool.query(`
        INSERT INTO agency (id, name, email, password, is_verified)
        VALUES ('11111111-1111-1111-1111-111111111111', 'Test Agency', 'test@agency.com', 'pass', true)
      `);

    await pool.query(`
        INSERT INTO admin (id, agency_id, fullname, email, password, admin_role, token_expiry)
        VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Test Owner', 'owner@agency.com', 'pass', 'owner', NOW() + interval '1 day')
      `);

    await pool.query(`
        INSERT INTO client (id, agency_id, name, email, password, token_expiry)
        VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Test Client', 'client@test.com', 'pass', NOW() + interval '1 day')
      `);
  });

  test("Owner creates project -> project exists", async () => {
    const token = jwt.sign({ sub: '22222222-2222-2222-2222-222222222222', user_type: 'admin' }, ACCESS_TOKEN_SECRET as string);

    const projectPayload = {
      name: "New Integration Project",
      clientId: "33333333-3333-3333-3333-333333333333",
      description: "A solid integration test project",
      deadline: "2026-12-31",
      assignedTo: "22222222-2222-2222-2222-222222222222",
      project_status: "pending"
    };

    const response = await request(app)
      .post("/api/v1/project/createproject")
      .set("Authorization", `Bearer ${token}`)
      .send(projectPayload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("New Integration Project");

    const dbProject = await pool.query("SELECT * FROM project WHERE name = $1", ["New Integration Project"]);
    expect(dbProject.rowCount).toBe(1);
    expect(dbProject.rows[0].client_id).toBe("33333333-3333-3333-3333-333333333333");
  });
});
