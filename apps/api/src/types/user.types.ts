import {Request} from "express";
import {SendUser} from "./user.type.ts";

export interface UserForReq extends Request {
  user:SendUser;
}
