import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// TO PREVENT UPLOADING FILES
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const file = request.file;

    const exceptionResponse = exception.getResponse();

    const isValidationError =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as any).message);

    if (isValidationError && file) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete uploaded file after validation error:', err);
        } else {
          console.log('Uploaded file deleted due to validation error.');
        }
      });
    }

    response.status(400).json(isValidationError ? { error: 'Validation failed!' } : exceptionResponse);
  }
}
