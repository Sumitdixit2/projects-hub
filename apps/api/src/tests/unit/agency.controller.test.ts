import {beforeEach, expect, test, vi,describe} from "vitest"
import { pool } from "../../../postgress-config";
import { getAgencies } from "../../controllers/agency/agency.controller";
import { Resend } from "resend";


vi.mock("../../../postgress-config",() => ({
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
    req = {}
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
    expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
    statusCode: 200,
    data: [data],
    message: "fetched all agencies name and id"
                            })
);  })
});


