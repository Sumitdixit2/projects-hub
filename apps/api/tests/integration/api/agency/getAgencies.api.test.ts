import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest"
import app from "../../../../src/app"
import { pool } from "../../../../postgress-config";

describe("GET /get-agency",() => {

    beforeEach(async() => {
      await pool.query('DELETE FROM agency');

      await pool.query(`
      INSERT INTO agency (id, name, is_verified)
      VALUES
      (1, 'Google', true),
      (2, 'Microsoft', true),
      (3, 'Fake Agency', false)
    `);
    });
    
    test("return agencies",async() => {
        const endpoint = "/api/v1/agency/get-agency";
        
        const response = await request(app).get(endpoint);


        console.log("status is: ",response.status);
        console.log("body is: ",response.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          statusCode: 200,
          data: [
        {
          id: 1,
          name: "Google"
        },
        {
          id: 2,
          name: "Microsoft"
        }
      ],
      message: "fetched all agencies name and id",
      success: true
        });
    })
})
