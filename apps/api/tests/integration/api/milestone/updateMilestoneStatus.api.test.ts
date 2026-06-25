import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../../../src/app";
import { pool } from "../../../../postgress-config";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../../../src/types/env.config";

describe("PATCH /api/v1/milestone/changeMilestoneStatus Workflow", () => {
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
        VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Test Dev', 'dev@agency.com', 'pass', 'staff', NOW() + interval '1 day')
      `);

    await pool.query(`
        INSERT INTO client (id, agency_id, name, email, password, token_expiry)
        VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Test Client', 'client@test.com', 'pass', NOW() + interval '1 day')
      `);

    await pool.query(`
        INSERT INTO project (id, name, description, client_id, admin_id, deadline, agency_id, project_status)
        VALUES ('44444444-4444-4444-4444-444444444444', 'Test Project', 'Desc', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-12-31', '11111111-1111-1111-1111-111111111111', 'pending')
      `);

    await pool.query(`
        INSERT INTO milestone (id, name, description, due_date, project_id, milestone_status)
        VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Phase 1', 'Desc', '2026-10-10', '44444444-4444-4444-4444-444444444444', 'pending')
      `);
  });

  test("Developer updates milestone status -> status persists", async () => {
    const token = jwt.sign({ sub: '22222222-2222-2222-2222-222222222222', user_type: 'admin' }, ACCESS_TOKEN_SECRET as string);

    const response = await request(app)
      .patch("/api/v1/milestone/changeMilestoneStatus/123e4567-e89b-12d3-a456-426614174000")
      .set("Authorization", `Bearer ${token}`)
      .send({
        newStatus: "active"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const dbMilestone = await pool.query("SELECT milestone_status FROM milestone WHERE id = $1", ["123e4567-e89b-12d3-a456-426614174000"]);
    expect(dbMilestone.rows[0].milestone_status).toBe("active");
  });
});
