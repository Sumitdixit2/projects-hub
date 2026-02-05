import { JwtPayload } from "jsonwebtoken";
import { role, userType } from "../controllers/admin/admin.controller";

export interface AccessTokenJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  agency_id: string;
}

export type JwtPayloadType = {
  id: string,
  user_type: userType
}
