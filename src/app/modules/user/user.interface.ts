/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;

  isPasswordValid(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}
