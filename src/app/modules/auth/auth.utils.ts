import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  jwt_secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(jwtPayload, jwt_secret, {
    expiresIn,
  });
};
