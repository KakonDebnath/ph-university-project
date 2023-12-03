import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const requestValidator = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await zodSchema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default requestValidator;
