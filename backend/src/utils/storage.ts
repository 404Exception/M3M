import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage abstraction interface
export interface IStorageProvider {
  saveFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

// Local Server Storage Provider
export class LocalStorageProvider implements IStorageProvider {
  async saveFile(file: Express.Multer.File): Promise<string> {
    // Returns the public URL path
    return `/uploads/${file.filename}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (fileUrl.startsWith('/uploads/')) {
        const filename = path.basename(fileUrl);
        const fullPath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  }
}

export const storageProvider: IStorageProvider = new LocalStorageProvider();

// Multer disk configuration
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const prefix = file.mimetype.startsWith('video/') ? 'video' : 'plot';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];
  const allowedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg',
    'video/x-matroska',
    'video/avi',
    'video/mpeg',
  ];

  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only standard images (JPEG, PNG, WebP) and video files (MP4, WebM, MOV, MKV) are permitted'));
  }
};

export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for high quality walkthrough videos
    files: 10,
  },
  fileFilter,
});
