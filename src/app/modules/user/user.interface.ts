/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id: string;
  password: string;
  email: string;
  needsPasswordChange: boolean;
  passwordChangeAt: Date,
  role: TUserRole;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;

  isPasswordValid(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  
  isJwtIssuedBeforePasswordChanged(
    passwordChangeAtTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;