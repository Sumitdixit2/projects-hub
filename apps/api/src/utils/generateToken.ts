import JsonWebToken from 'jsonwebtoken'
import { agency } from '../types/agency.type';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../types/env.config';

export const generateAccessToken = (user: agency) => {
  const { id, name, email, agency_id } = user;

  return JsonWebToken.sign(
    {
      id,
      email,
      name,
      agency_id,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
};

export const generateRefreshToken = (user: agency) => {

  const { id, name, email, agency_id } = user;

  return JsonWebToken.sign(
    {
      id,
      email,
      name,
      agency_id,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );
};


