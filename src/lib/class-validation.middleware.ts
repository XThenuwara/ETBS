import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { sendResponse } from './common';

export const classValidator = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToClass(dtoClass, req.body);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
            const validationErrors = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
            return sendResponse(res, 400, "Validation Error", null, validationErrors); 
        }
        req.body = dtoObject;
        next();
    };
};