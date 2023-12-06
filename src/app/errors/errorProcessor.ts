import { ZodError } from 'zod';
import { TGenericErrorResponse } from '../interface/error';
import { zodErrorHandler } from './zodError';
import mongoose from 'mongoose';
import { mongooseErrors } from './mongooseError';

export const errorResponseProcessor = (err: any): TGenericErrorResponse => {
  if (err instanceof ZodError) {
    return zodErrorHandler(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    return mongooseErrors.validationErrorHandler(err);
  } else if (err instanceof mongoose.Error.CastError) {
    return mongooseErrors.castErrorHandler(err);
  } else if (err.code && err.code === 11000) {
    return mongooseErrors.duplicateErrorHandler(err);
  } else {
    return {
      statusCode: 400,
      message: 'Something wrong!',
      errorSources: [
        {
          path: '',
          message: '',
        },
      ],
    };
  }
};
