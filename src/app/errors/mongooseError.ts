import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const validationErrorHandler = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 401;
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};

const castErrorHandler = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 401;
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};

const duplicateErrorHandler = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export const mongooseErrors = {
  validationErrorHandler,
  castErrorHandler,
  duplicateErrorHandler
};
