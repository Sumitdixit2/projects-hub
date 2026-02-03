import JsonWebToken from 'jsonwebtoken'
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../types/env.config';
import { JwtPayloadType } from '../types/payload.type';
import { userType } from '../controllers/admin/admin.controller';

export const generateAccessToken = (user: JwtPayloadType, user_type: userType) => {
  const { id, agency_id, admin_role }: JwtPayloadType = user;

  return JsonWebToken.sign(
    {
      sub: id,
      user_type,
      agency_id,
      role: admin_role || null,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
};

export const generateRefreshToken = (user: JwtPayloadType, user_type: userType) => {

  const { id, agency_id, admin_role }: JwtPayloadType = user;

  return JsonWebToken.sign(
    {
      sub: id,
      user_type,
      agency_id,
      role: admin_role || null,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

};


