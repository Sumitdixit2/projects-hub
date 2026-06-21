import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../../../src/app";
import { pool } from "../../../../postgress-config";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../../../src/types/env.config";

describe("PATCH /api/v1/milestone/changeMilestoneStatus Workflow", () => {
    beforeEach(async () => {
      await pool.query('DELETE FROM milestone');
      await pool.query('DELETE FROM project');
      await pool.query('DELETE FROM admin');
      await pool.query('DELETE FROM client');
      await pool.query('DELETE FROM agency');

      await pool.query(`
        INSERT INTO agency (id, name, email, password, is_verified)
        VALUES ('ag-1', 'Test Agency', 'test@agency.com', 'pass', true)
      `);

      await pool.query(`
        INSERT INTO admin (id, agency_id, fullname, email, password, admin_role, token_expiry)
        VALUES ('ad-1', 'ag-1', 'Test Dev', 'dev@agency.com', 'pass', 'staff', NOW() + interval '1 day')
      `);

      await pool.query(`
        INSERT INTO client (id, agency_id, name, email, password, phone, token_expiry)
        VALUES ('cl-1', 'ag-1', 'Test Client', 'client@test.com', 'pass', '123456789', NOW() + interval '1 day')
      `);

      await pool.query(`
        INSERT INTO project (id, name, description, client_id, admin_id, deadline, agency_id, project_status)
        VALUES ('proj-1', 'Test Project', 'Desc', 'cl-1', 'ad-1', '2026-12-31', 'ag-1', 'pending')
      `);

      await pool.query(`
        INSERT INTO milestone (id, name, description, due_date, project_id, milestone_status)
        VALUES ('mile-1', 'Phase 1', 'Desc', '2026-10-10', 'proj-1', 'pending')
      `);
    });

    test("Developer updates milestone status -> status persists", async () => {
        const token = jwt.sign({ sub: 'ad-1', user_type: 'admin' }, ACCESS_TOKEN_SECRET as string);

        const response = await request(app)
            .patch("/api/v1/milestone/changeMilestoneStatus/mile-1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                newStatus: "active"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const dbMilestone = await pool.query("SELECT milestone_status FROM milestone WHERE id = $1", ["mile-1"]);
        expect(dbMilestone.rows[0].milestone_status).toBe("active");
    });
});
