import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old Password is required' }),
    newPassword: z.string({ required_error: 'new Password is required' }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id is required' }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User Id is required' }),
    newPassword: z.string({ required_error: 'New Password Id is required' }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema
};
