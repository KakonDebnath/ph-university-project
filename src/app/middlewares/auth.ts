import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if the token is not sent form client

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!');
    }

    // check if the token is valid

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

    // Check if the user is exist
    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }
    // Check if the user is already deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This User is already deleted');
    }
    // Check if the user is blocked
    if (user?.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This User is blocked');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You role are not authorized!!',
      );
    }
    req.user = decoded;
    return next();
  });
};

export default auth;
