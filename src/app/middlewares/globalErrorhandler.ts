/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import config from '../config';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import { ZodError } from 'zod';
import { zodErrorHandler } from '../errors/zodError';
import { mongooseErrors } from './../errors/mongooseError';
import mongoose from 'mongoose';
import { errorResponseProcessor } from '../errors/errorProcessor';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // let statusCode = err.statusCode || 500;
  // let message = err.message || 'Something went wrong!';
  // let errorSources: TErrorSources = [
  //   {
  //     path: '',
  //     message: 'Something went wrong!',
  //   },
  // ];

  const errorResponse: TGenericErrorResponse = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong!',
    errorSources: [
      {
        path: '',
        message: 'Something went wrong!',
      },
    ],
  };

  if (err instanceof ZodError) {
    const simplifiedError = zodErrorHandler(err);
    errorResponse.statusCode = simplifiedError?.statusCode;
    errorResponse.message = simplifiedError?.message;
    errorResponse.errorSources = simplifiedError?.errorSources;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError = mongooseErrors.validationErrorHandler(err);
    errorResponse.statusCode = simplifiedError?.statusCode;
    errorResponse.message = simplifiedError?.message;
    errorResponse.errorSources = simplifiedError?.errorSources;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = mongooseErrors.castErrorHandler(err);
    errorResponse.statusCode = simplifiedError?.statusCode;
    errorResponse.message = simplifiedError?.message;
    errorResponse.errorSources = simplifiedError?.errorSources;
  } else if (err.code && err.code === 11000) {
    const simplifiedError = mongooseErrors.duplicateErrorHandler(err);
    errorResponse.statusCode = simplifiedError?.statusCode;
    errorResponse.message = simplifiedError?.message;
    errorResponse.errorSources = simplifiedError?.errorSources;
  }

  return res.status(errorResponse.statusCode).json({
    success: false,
    message: errorResponse.message,
    errorSources: errorResponse.errorSources,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;

//pattern
/*
success
message
errorSources:[
  {
    path:'',
    message:''
  }
]
stack
*/
