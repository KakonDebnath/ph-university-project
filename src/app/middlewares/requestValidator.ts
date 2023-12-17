import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const requestValidator = (zodSchema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await zodSchema.parseAsync({
      body: req.body,
    });
    return next();
  });
};

export default requestValidator;
