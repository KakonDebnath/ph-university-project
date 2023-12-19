import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Authentication successfully',
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  // const result = await AuthServices.changePassword(req.body);

  console.log(req.body, req.user);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Authentication successfully',
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};