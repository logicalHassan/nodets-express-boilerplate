import { ApiError, pick } from '@/utils';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ZodError, type ZodTypeAny } from 'zod';

type SchemaObject = {
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
};

const validate = (schema: SchemaObject) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);

    for (const key of Object.keys(validSchema) as (keyof SchemaObject)[]) {
      validSchema[key]!.parse(object[key]);
    }

    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues
        .map((issue) => (issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
        .join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next(error);
  }
};

export default validate;
