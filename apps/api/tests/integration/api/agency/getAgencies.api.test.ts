import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest"
import app from "../../../../src/app"
import { pool } from "../../../../postgress-config";

describe("GET /get-agency",() => {

    beforeEach(async() => {
      await pool.query('DELETE FROM agency');

      await pool.query(`
      INSERT INTO agency (name,email,password, is_verified)
      VALUES
      ('Google','lol@lol.com','asfdasf', true),
      ('Microsoft','hell@hol','dafdaf', true),
      ('Fake Agency','dafafaggh','adfafdarg', false)
    `);
    });
    
    test("return agencies",async() => {
        const endpoint = "/api/v1/agency/get-agency";
        
        const response = await request(app).get(endpoint);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          statusCode: 200,
          data: [
        {
          id: expect.any(String),
          name: "Google"
        },
        {
          id: expect.any(String),
          name: "Microsoft"
        }
      ],
      message: "fetched all agencies name and id",
      success: true
        });
    })
})
