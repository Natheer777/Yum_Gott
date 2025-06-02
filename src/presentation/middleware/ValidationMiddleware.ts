import { Request, Response, NextFunction } from 'express';

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'mobile';
    minLength?: number;
    maxLength?: number;
  };
}

export class ValidationMiddleware {
  static validate(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const errors: string[] = [];
      const data = req.body;

      for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];

        if (rules.required && (!value || value.toString().trim() === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        if (value) {
          if (rules.type === 'email' && !ValidationMiddleware.isValidEmail(value)) {
            errors.push(`${field} must be a valid email`);
          }

          if (rules.type === 'mobile' && !ValidationMiddleware.isValidMobile(value)) {
            errors.push(`${field} must be a valid mobile number`);
          }

          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters long`);
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters long`);
          }
        }
      }

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      next();
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidMobile(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10,15}$/;
    return mobileRegex.test(mobile);
  }
}