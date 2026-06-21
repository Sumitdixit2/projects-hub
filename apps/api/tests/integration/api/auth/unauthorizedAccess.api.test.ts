import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../../../src/app";

describe("Unauthorized Access Workflow", () => {
    test("Unauthorized user accesses protected resource -> receives 401", async () => {
        const response = await request(app)
            .post("/api/v1/project/createproject")
            .send({
                name: "Hacked Project"
            });

        // verifyJWT middleware returns 401 when no token is provided
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("User with invalid token accesses resource -> receives 401", async () => {
        const response = await request(app)
            .post("/api/v1/project/createproject")
            .set("Authorization", "Bearer invalid-token-123")
            .send({
                name: "Hacked Project"
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
