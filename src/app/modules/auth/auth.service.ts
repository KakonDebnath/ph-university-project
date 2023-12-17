import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLoginUser) => {
  // Check if the user is exist
  const ifUserExists = await User.findOne({ id: payload.id });


  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }
  // Check if the user is already deleted
  if (ifUserExists.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is already deleted');
  }
  // Check if the user is blocked
  if (ifUserExists.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is blocked');
  }

  // check if the password is valid
  const isPasswordValid = await bcrypt.compare(
    payload?.password,
    ifUserExists.password,
  );
  
  console.log(isPasswordValid);
  // send access token and refresh token
  return {};
};

export const AuthServices = {
  loginUser,
};
