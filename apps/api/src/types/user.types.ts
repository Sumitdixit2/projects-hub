import { Request } from "express";
import { SendUser } from "./user.type";

export interface UserForReq extends Request {
  user: SendUser;
}
