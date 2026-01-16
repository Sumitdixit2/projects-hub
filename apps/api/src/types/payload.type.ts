import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  agency_id: string;
}
