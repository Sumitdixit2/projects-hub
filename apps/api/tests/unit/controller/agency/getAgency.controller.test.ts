import {beforeEach, expect, test, vi,describe} from "vitest"
import { Resend } from "resend";
import { getAgencies } from "../../../../src/controllers/agency/agency.controller";
import {pool} from "../../../../postgress-config.ts"



vi.mock("../../../../postgress-config",() => ({
  pool: {
    query: vi.fn()
  }
}));

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn()
      };
    }
  };
});

describe("getAgencies Controller",() => {
  let req:any;
  let res:any;

  beforeEach(() => {
    req = {
      name: ""
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  });

  test("should return agencies",async() => {

    const data = {
          name: "xyz",
          id: "123"
        };
    
    pool.query.mockResolvedValue({
      rows: [
        data
      ]
    } as any);

    await getAgencies(req,res);

    expect(pool.query).toHaveBeenCalledWith("SELECT name , id FROM agency WHERE is_verified = true");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
    statusCode: 200,
    data: [data],
    message: "fetched all agencies name and id"
                            })
);  })
});


