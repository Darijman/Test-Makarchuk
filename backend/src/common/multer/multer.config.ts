import { diskStorage, FileFilterCallback } from 'multer';
import type { Request } from 'express';
import type { Express } from 'express';
import * as path from 'path';

const allowedTypes = /jpeg|jpg|png|svg/;

export const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const name = path.parse(file.originalname).name;
      const ext = path.extname(file.originalname);
      const filename = `${name}-${Date.now()}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      callback(null, true);
    } else {
      callback(null, false);
      req['fileValidationError'] = {
        error: 'Invalid file type. Only JPEG, JPG, PNG, and SVG are allowed.',
      };
    }
  },
};
