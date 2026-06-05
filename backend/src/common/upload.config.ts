import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
export const PHOTOS_DIR = join(UPLOADS_ROOT, 'photos');

export function ensureUploadDirs() {
  if (!existsSync(PHOTOS_DIR)) {
    mkdirSync(PHOTOS_DIR, { recursive: true });
  }
}

export const photoUploadOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(new Error('Допустимы только изображения JPG, PNG, WEBP, GIF'), false);
      return;
    }
    cb(null, true);
  },
};
