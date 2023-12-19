import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordValid = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChanged = async function (
  passwordChangeAtTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const convertPasswordChangeAtTimeStampToMilliseconds =
    new Date(passwordChangeAtTimeStamp).getTime() / 1000; // because jwtIssuedTimeStamp is seconds

  const compareTime =
    convertPasswordChangeAtTimeStampToMilliseconds > jwtIssuedTimeStamp;

  // console.log(compareTime, {
  //   convertPasswordChangeAtTimeStampToMilliseconds,
  //   jwtIssuedTimeStamp,
  // });

  return compareTime;
};

export const User = model<TUser, UserModel>('User', userSchema);
